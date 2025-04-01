export namespace Settings {

    export namespace piAssembling {
        export const COLOR_DIGITS = 6;
        export const MAX_DIGITS_PER_REQUEST = 9000;
        export const CHUNK_SIZE = MAX_DIGITS_PER_REQUEST / COLOR_DIGITS;
    }

}