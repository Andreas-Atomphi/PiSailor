<script lang="ts">
      import { ObservablePoint, Point } from "pixi.js";
      import { setup } from "./app-sailor-setup";
      import { ChunkManager } from "./lib/classes/chunk-manager";
      import { PiDecoder } from "./lib/classes/pi-codec";
      import { PiDigitsManager } from "./lib/classes/pi-digits-manager";
      import { PiImageEncoder } from "./lib/classes/pi-image-encoder";
      import { Settings } from "./lib/classes/settings";

      setup().then(({ app, inputAxis, addInputListener, isKeyJustPressed }) => {
            document.body.appendChild(app.canvas);
            const piDigitsManager = new PiDigitsManager();
            const piImageEncoder = new PiImageEncoder();
            const piDecoder = new PiDecoder(piImageEncoder);
            const chunkManager = new ChunkManager();
            let assembleStart = 0;
            const loopPiFetch = () => {
                  const piFetcher = piDigitsManager.assemble(assembleStart);
                  piFetcher.assembleEnded.subscribe((_) => {
                        const image = piDecoder.decode(piFetcher.digits);
                        const chunk = chunkManager.generateChunk(image);
                        assembleStart += Settings.piAssembling.CHUNK_SIZE;
                        if (chunk) app.stage.addChild(chunk);
                        loopPiFetch();
                  }, true);
                  piFetcher.assemble();
            };
            loopPiFetch();

            app.ticker.add((time) => {
                  if (displayPointerData == null || displayPointerData.pressed == false) {
                        app.stage.x -=
                              inputAxis("KeyA", "KeyD") * 10 * time.deltaTime;
                        app.stage.y -=
                              inputAxis("KeyW", "KeyS") * 10 * time.deltaTime;
                        app.stage.scale.x +=
                              inputAxis("KeyQ", "KeyE") * time.deltaTime;
                        app.stage.scale.y = app.stage.scale.x;
                        app.stage.scale.x = Math.max(2, app.stage.scale.x);
                        app.stage.scale.y = app.stage.scale.x;
                  } else {
                        if (displayPointerData.pressed) {
                              app.stage.x =
                                    appStagePressPosition!.x +
                                    displayPointerData.delta.x -
                                    displayPointerData.pressedPosition.x;
                              app.stage.y =
                                    appStagePressPosition!.y +
                                    displayPointerData.delta.y -
                                    displayPointerData.pressedPosition.y;
                        }
                  }
            });

            addInputListener((event) => {
                  if (isKeyJustPressed("KeyR"))
                        app.stage.scale = { x: 1, y: 1 };
            });

            type CanvasPointerData = {
                  pressed: boolean;
                  pressedPosition: Point;
                  releasedPosition: Point | null;
                  delta: Point;
            };

            let displayPointerData: CanvasPointerData | null;
            let appStagePressPosition: Point | null = null;
            window.addEventListener("pointerdown", (event) => {
                  displayPointerData = {
                        pressed: true,
                        pressedPosition: new Point(
                              event.clientX,
                              event.clientY,
                        ),
                        releasedPosition: null,
                        delta: new Point(event.clientX, event.clientY),
                  };
                  appStagePressPosition = app.stage.position.clone();
            });
            window.addEventListener("pointerup", (event) => {
                  if (displayPointerData == null) return;
                  displayPointerData!.releasedPosition = new Point(
                        event.clientX,
                        event.clientY,
                  );
                  displayPointerData.pressed = false;
                  appStagePressPosition = null;
            });
            window.addEventListener("pointermove", (event) => {
                  if (displayPointerData == null) return;
                  displayPointerData!.delta = new Point(
                        event.clientX,
                        event.clientY,
                  );
            });
      });
</script>
