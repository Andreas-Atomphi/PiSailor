



export interface PiEncoder<I, O> {
    
    encode (value: I): O;
}

export class PiDecoder<O> {

    constructor(
        public encoder: PiEncoder<string, O>
    ) {}

    decode(value: string): O {
        return this.encoder.encode(value);
    }

}