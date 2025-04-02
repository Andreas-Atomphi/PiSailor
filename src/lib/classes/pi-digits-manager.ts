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

export class PiDigitsManager {

    public readonly assembleEnded = new Observer();
    public readonly assembleRaisedError = new Observer();
    public readonly refreshed = new Observer();

    private _digits: string = "";
    private _isAssembling: boolean = false;
    private _maxSize: number = 100_000_000;

    get length() { return this._digits.length; }

    async startAssemble(): Promise<Error | null> {
        type PiResponse = {content: string};
        const remainingLength = () => this._maxSize - this._digits.length;
        this._isAssembling = true
        try {
            let offset = 0;
            while (remainingLength() > 0n) {
                const requestURLs = setupPIFetch(offset , remainingLength());
                const responses = await Promise.allSettled(
                    requestURLs.map(async (url): Promise<string> => {
                        try {
                            const response = await fetch(url);
                            if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
                            const data: PiResponse = await response.json();
                            offset += data.content.length;
                            return data.content;
                        } catch (error) {
                            console.error("PI request failed:", error);
                            return "";
                        }
                    })
                );
                
                this._digits += responses
                    .filter(res => res.status === "fulfilled")
                    .map(res => res.value)
                    .join("");
                this.refreshed.notify();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            this._isAssembling = false
            console.error("Uncaught error on assemble:", error);
            this.assembleRaisedError.notify();
            return error as Error;
        } finally {
            this._isAssembling = false
            this.assembleEnded.notify();
        }
        this._isAssembling = false;
        return null
    }
    getDigits(start: number, digits:number): string {
        if (this._digits.length < start || this._digits.length < start + digits) {
            throw new Error("Invalid range");
        }
        return this._digits.substring(start, start + digits);
    }

    get isAssembling () { return this._isAssembling; }

}