import { Color } from "pixi.js";
import type { PiEncoder } from "./pi-codec";
import { Settings } from "./settings";


class PiImageEncoder implements PiEncoder<string, ImageData> {

    encode(value: string): ImageData {
        const chunkDimensions = Settings.piAssembling.CHUNK_SIZE / 2;
        const imageData = new ImageData(chunkDimensions, chunkDimensions);
        const data = imageData.data;
        for (let i = 0; i < data.length / 4; i ++) {
            const pixelIdx = i * 4;
            const hex = value.substring(pixelIdx, pixelIdx + Settings.piAssembling.COLOR_DIGITS);
            const color = parseInt(hex, 16);
            data[pixelIdx] = (color >> 16) & 0xFF;
            data[pixelIdx + 1] = (color >> 8) & 0xFF;
            data[pixelIdx + 2] = color & 0xFF;
            data[pixelIdx + 3] = 255;
        }
        return imageData;
    }

}