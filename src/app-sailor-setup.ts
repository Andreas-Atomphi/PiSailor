import * as PIXI from "pixi.js";
import { PiDigitsManager } from "./lib/classes/pi-digits-manager";
import { PiImageEncoder } from "./lib/classes/pi-image-encoder";
import { PiDecoder } from "./lib/classes/pi-codec";
import { ChunkManager } from "./lib/classes/chunk-manager";
import { Settings } from "./lib/classes/settings";


export async function setup() {
    const app = new PIXI.Application();
    await app.init({
        background: "#000000",
        resizeTo: window,
        antialias: false,
        roundPixels: true,
        resolution: 1,
    });


    app.stage.scale = 1;
    app.stage.x = -app.stage.width / 2;
    app.stage.y = -app.stage.height / 2;



    const keysMap = new Map<string, { justPressed: boolean }>();

    const isKeyPressed = (key: string) => keysMap.has(key);
    const isKeyJustPressed = (key: string) => keysMap.get(key)?.justPressed ?? false;
    const inputAxis = (minus: string, plus: string) =>
        -Number(isKeyPressed(minus)) + Number(isKeyPressed(plus));

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
        isKeyPressed,
        isKeyJustPressed,
        addInputListener,
        removeInputListener,
        inputAxis
    }
}