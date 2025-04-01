import { StringUtils } from "./helpers/string-utils";
import Observer from "./observer";
import { Settings } from "./settings";


const FETCH_URL = "https://api.pi.delivery";
const API_VERSION = "v1";
const QUERY_TEMPLATE = "pi?start={0}&numberOfDigits={1}&radix=16";

const buildRequestUrl = (start: number, digits: number) =>
    `${FETCH_URL}/${API_VERSION}/` +
    StringUtils.format(
        QUERY_TEMPLATE,
        start.toString(),
        digits.toString()
    );

function setupPIFetch(start: number, pRemaining: number): string[] {
    const TARGET_REQUEST_COUNT = 12;
    let requestURLs: string[] = [];
    let currentRequest = start;
    let remaining = pRemaining;

    while (requestURLs.length < TARGET_REQUEST_COUNT && remaining > 0n) {
        let numberOfDigits = Math.min(remaining, 1000);
        requestURLs.push(buildRequestUrl(currentRequest, numberOfDigits));
        currentRequest += numberOfDigits;
        remaining -= numberOfDigits;
    }
    return requestURLs;
}

export class PiDigitsFetcher {

    public readonly assembleEnded = new Observer();
    public readonly assembleRaisedError = new Observer();
    private _assembling: boolean = false
    private _digits: string = "";

    constructor(
        private readonly start: number,
        private size: number,
    ) {
        
    }

    async assemble(): Promise<Error | null> {
        type PiResponse = {content: string};
        let tempDigits = "";
        const remainingLength = () => this.size - tempDigits.length;
        this._assembling = true
        try {
            let tempStartOffset = 0;
            while (remainingLength() > 0n) {
                const requestURLs = setupPIFetch(this.start + tempStartOffset, remainingLength());
                const responses = await Promise.allSettled(
                    requestURLs.map(async (url): Promise<string> => {
                        try {
                            const response = await fetch(url);
                            if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
                            const data: PiResponse = await response.json();
                            tempStartOffset += data.content.length;
                            return data.content;
                        } catch (error) {
                            console.error("PI request failed:", error);
                            return "";
                        }
                    })
                );

                tempDigits += responses
                    .filter(res => res.status === "fulfilled")
                    .map(res => res.value)
                    .join("");
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            this._assembling = false
            console.error("Uncaught error on assemble:", error);
            this.assembleRaisedError.notify();
            return error as Error;
        } finally {
            this._digits = tempDigits;
            this._assembling = false
            this.assembleEnded.notify();
        }
        this._assembling = false;
        return null
    }

    get digits() { return this._digits; }
    get assembling () { return this._assembling; }
}

export class PiDigitsManager {

    assemble(start: number): PiDigitsFetcher {
        return new PiDigitsFetcher(start, Settings.piAssembling.MAX_DIGITS_PER_REQUEST);
    }


}