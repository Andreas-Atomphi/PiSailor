import { Container, Point, Sprite, Texture } from "pixi.js";
import app from "../../main";
import { PiDigitsManager } from "./pi-digits-manager";
import { Settings } from "./settings";

export class ChunkManager extends Container {

    private _chunks: Map<string, Sprite> = new Map();
    private _queue: Point[] = [new Point(0, 0)];
    public maxChunks = 1000;
    get chunksLength() { return this._queue.length; }

    constructor() {
        super();
    }

    generateChunk(imageData: ImageData): Sprite | null {
        if (this._queue.length === 0) return null;

        const { x, y } = this._queue.shift()!;
        const key = `${x},${y}`;

        if (this._chunks.has(key)) return null;
        const canvasSource = document.createElement('canvas');
        canvasSource.width = imageData.width;
        canvasSource.height = imageData.height;
        const canvasSourceCtx = canvasSource.getContext("2d");
        canvasSourceCtx!.putImageData(imageData, 0, 0);
        const texture = Texture.from(canvasSource);
        texture.source.scaleMode = 'nearest';
        const sprite = new Sprite(texture);
        const chunkSize = imageData.width;
        sprite.x = x * chunkSize;
        sprite.y = y * chunkSize;
        this._chunks.set(key, sprite);

        if (Math.abs(x) < this.maxChunks && Math.abs(y) < this.maxChunks) {
            this._queue.push(new Point( x + 1, y ));
            this._queue.push(new Point( x - 1, y ));
            this._queue.push(new Point( x, y + 1 ));
            this._queue.push(new Point(x, y - 1 ));
        }
        return sprite;
    }

}