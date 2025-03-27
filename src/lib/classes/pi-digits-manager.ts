import { StringUtils } from "./helpers/string-utils";
import Observer from "./observer";
import { Settings } from "./settings";


const FETCH_URL = "https://api.pi.delivery/";
const API_VERSION = "v1";
const QUERY_TEMPLATE = "pi?start={1}&numberOfDigits={2}&radix=16";

const buildRequestUrl = (start: number, digits: number) =>
    `${FETCH_URL}/${API_VERSION}/` +
    StringUtils.format(
        QUERY_TEMPLATE,
        start.toString(),
        digits.toString()
    );


class PiDigitsFetcher {

    public readonly assembleEnded = new Observer();
    public readonly assembleRaisedError = new Observer();
    private _digits: string = "";

    constructor(
        private start: number,
        private length: number,
    ) {
        fetch(buildRequestUrl(start, Settings.piAssembling.CHUNK_SIZE), {
            method: "GET",
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json() as Promise<{ content: string}>;
        }).then(data => {
            this._digits = data.content;
            this.assembleEnded.notify();
        }).catch((err) => {
            this.assembleRaisedError.notify(err);
        });
    }

    get digits() { return this._digits; }
}

export class PiDigitsManager {

    assemble(start: number): PiDigitsFetcher {
        return new PiDigitsFetcher(start, Settings.piAssembling.MAX_DIGITS_PER_REQUEST);
    }


}