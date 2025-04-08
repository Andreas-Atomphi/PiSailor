import { Container, FillGradient, Graphics, GraphicsPipe, Point, Rectangle, Sprite, Texture, Ticker, type ColorSource, type Renderer, type Size } from "pixi.js";
import app from "../../main";
import { PiDigitsManager } from "./pi-digits-manager";
import { Settings } from "./settings";
import type { Viewport } from "pixi-viewport";
import { MathUtils } from "./helpers/math-utils";


function refreshGrid(chunkGrid: Graphics, screen: Size, fillGradient: FillGradient) {
    chunkGrid.clear();
    const worldCenter = new Point(
        screen.width * 0.5,
        screen.height * 0.5
    );
    const chunkArea = Math.sqrt(Settings.piAssembling.CHUNK_SIZE);
    const halfArea = chunkArea * 0.5;
    const gridStrokes:{ from: Point, to: Point }[] = [
        {
            from: worldCenter.subtract({ x: halfArea, y: halfArea + chunkArea}),
            to: worldCenter.add({ x: -halfArea, y: halfArea + chunkArea}),
        },
        {
            from: worldCenter.subtract({ x: -halfArea, y: halfArea + chunkArea}),
            to: worldCenter.add({ x: halfArea, y: halfArea + chunkArea}),
        },
        {
            from: worldCenter.subtract({ x: halfArea + chunkArea, y: halfArea}),
            to: worldCenter.add({ x: halfArea + chunkArea, y: -halfArea}),
        },
        {
            from: worldCenter.subtract({ x: halfArea + chunkArea, y: -halfArea}),
            to: worldCenter.add({ x: halfArea + chunkArea, y: halfArea}),
        },
    ];
    for (const stroke of gridStrokes) {
        chunkGrid
            .moveTo(stroke.from.x, stroke.from.y)
            .lineTo(stroke.to.x, stroke.to.y)
            .stroke({ fill: fillGradient, alpha: 1.0, width: 2 });
    }
}

export function chunkGridGraphics(screen: Size, ticker: Ticker) {
    const chunkArea = Math.sqrt(Settings.piAssembling.CHUNK_SIZE);
    const view = new Graphics();
    const worldCenter = new Point(
        screen.width * 0.5,
        screen.height * 0.5
    );
    const colorStops: {color: ColorSource, offset:number}[] = [
        { color: 0x222222, offset: 0 },
        { color: 0x555555, offset: 0.25 },
        { color: 0x222222, offset: 1 }
    ]
    let fillGradient = new FillGradient({
        type: "linear",
        start: worldCenter.subtract({ x: chunkArea * 2, y: 0 }),
        end: worldCenter.add({ x: chunkArea * 2, y: 0 }),
        colorStops: colorStops,
        textureSpace: "global",
    });

    let timeLine = 0;
    function animateGrid(time: Ticker) {
        const maxTime = 1000.0
        timeLine += time.deltaTime * 100
        const cycleTime = timeLine * 0.001;
        const gradientOffset = cycleTime * chunkArea * 2; 
    
        fillGradient = new FillGradient({
            type: "linear",
            start: worldCenter
                .subtract({ x: chunkArea * 2, y: 0 })
                .add({x: gradientOffset, y: 0}),
            end: worldCenter
                .add({ x: chunkArea * 2 + gradientOffset, y: 0 }),
            colorStops: colorStops,
            textureSpace: "global",
        });
        refreshGrid(view, screen, fillGradient);
    }
    ticker.add(animateGrid);

    refreshGrid(view, screen, fillGradient);

    const manager = {
        destroy(){
            ticker.remove(animateGrid);
            view.clear();
            view.destroy();
            view.removeFromParent();
            fillGradient.destroy();
        },
        view
    };
    return manager
}


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
        sprite.x = x * chunkSize - chunkSize * 0.5;
        sprite.y = y * chunkSize - chunkSize * 0.5;
        this._chunks.set(key, sprite);

        if (Math.abs(x) < this.maxChunks && Math.abs(y) < this.maxChunks) {
            this._queue.push(new Point(x + 1, y));
            this._queue.push(new Point(x - 1, y));
            this._queue.push(new Point(x, y + 1));
            this._queue.push(new Point(x, y - 1));
        }
        return sprite;
    }

}