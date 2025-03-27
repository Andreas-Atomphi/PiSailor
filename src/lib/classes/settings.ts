export namespace Settings {

    export namespace piAssembling {
        const COLOR_DIGITS = 6;
        export const MAX_DIGITS_PER_REQUEST = 900;
        export const CHUNK_SIZE = MAX_DIGITS_PER_REQUEST / COLOR_DIGITS;
    }

}