import { Application, Point, type ICanvas } from "pixi.js";
import "pixi.js/math-extras";
import { PiDigitsManager } from "./lib/classes/pi-digits-manager";
import { PiImageEncoder } from "./lib/classes/pi-image-encoder";
import { PiDecoder } from "./lib/classes/pi-codec";
import { ChunkManager } from "./lib/classes/chunk-manager";
import { Settings } from "./lib/classes/settings";


export async function setup(canvas:ICanvas) {
    const app = new Application();
    await app.init({
        background: "#000000",
        resizeTo: window,
        antialias: false,
        roundPixels: true,
        resolution: 1,
        canvas
    });

    const keysMap = new Map<string, { justPressed: boolean }>();

    const isKeyPressed = (key: string) => keysMap.has(key) ?? false;
    const isKeyJustPressed = (key: string) => (keysMap.get(key)?.justPressed) ?? false;
    
    const inputSign = (minus: string, plus: string):number =>
        -Number(isKeyPressed(minus)) + Number(isKeyPressed(plus));

    const inputAxis = (left: string, right: string, up: string, down: string): Point => {
        const [xSign, ySign] = [inputSign(left, right), inputSign(up, down)]
        if (xSign === 0 && ySign === 0) return new Point(0, 0);
        return new Point(xSign, ySign).normalize();
    }

    const inputListeners: Set<(event: KeyboardEvent) => void> = new Set();

    function addInputListener(listener: (event: KeyboardEvent) => void) {
        inputListeners.add(listener);
    }

    function removeInputListener(listener: (event: KeyboardEvent) => void) {
        inputListeners.delete(listener);
    }

    app.ticker.add(time => {
        for (const key of keysMap.keys()) {
            keysMap.get(key)!.justPressed = false;
        }
    });

    window.addEventListener("keydown", event => {
        if (!keysMap.has(event.code)) {
            keysMap.set(event.code, { justPressed: true});
        }
        for (const listener of inputListeners) {
            listener(event);
        }
    });
    window.addEventListener("keyup", event => {
        if (keysMap.has(event.code)) {
            keysMap.delete(event.code);
        }
        for (const listener of inputListeners) {
            listener(event);
        }
    });

    return {
        app,
        Input: {
            isKeyPressed,
            isKeyJustPressed,
            addInputListener,
            removeInputListener,
            inputSign,
            inputAxis
        }
    }
}