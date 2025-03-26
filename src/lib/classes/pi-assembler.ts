import Observer from "./observer";

const chunkSize = 900 / 6;


export class PiAssembler {

    readonly assembleStarted = new Observer<null>();
    readonly assembleFinished = new Observer<null>();

}