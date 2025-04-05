<script lang="ts">
      import { Container, Point } from "pixi.js";
      import "pixi.js/math-extras";
      import { Viewport } from "pixi-viewport";
      import { setup } from "./app-sailor-setup";
      import { ChunkManager } from "./lib/classes/chunk-manager";
      import { PiDecoder } from "./lib/classes/pi-codec";
      import { PiDigitsManager } from "./lib/classes/pi-digits-manager";
      import { PiImageEncoder } from "./lib/classes/pi-image-encoder";
      import { Settings } from "./lib/classes/settings";

      setup().then(
            ({
                  app,
                  inputAxis,
                  inputSign,
                  addInputListener,
                  isKeyJustPressed,
            }) => {
                  document.body.appendChild(app.canvas);
                  const viewport = new Viewport({
                        screenWidth: window.innerWidth,
                        screenHeight: window.innerHeight,
                        worldWidth: 1000,
                        worldHeight: 1000,
                        events: app.renderer.events,
                  });
                  viewport.clampZoom({
                        minScale: 3,
                        maxScale: 10,
                  })
                  app.stage.addChild(viewport);
                  viewport.drag().pinch().wheel({ smooth: 3 }).decelerate();

                  const piDigitsManager = new PiDigitsManager();
                  const piImageEncoder = new PiImageEncoder();
                  const piDecoder = new PiDecoder(piImageEncoder);
                  const chunkManager = new ChunkManager();
                  
                  viewport.addChild(chunkManager);
                  
                  piDigitsManager.startAssemble();
                  piDigitsManager.refreshed.subscribe((_) => {
                        if (
                              piDigitsManager.length == 0 ||
                              piDigitsManager.length %
                                    (Settings.piAssembling.CHUNK_SIZE * 6) !=
                                    0
                        )
                              return;
                        let assembleStart =
                              piDigitsManager.length -
                              Settings.piAssembling.CHUNK_SIZE * 6;
                        const image = piDecoder.decode(
                              piDigitsManager.getDigits(
                                    assembleStart,
                                    Settings.piAssembling.CHUNK_SIZE * 6,
                              ),
                        );
                        const chunk = chunkManager.generateChunk(image);
                        if (chunk) chunkManager.addChild(chunk);
                  });

                  app.ticker.add((time) => {
                        viewport.position.subtract(
                              inputAxis("KeyA", "KeyD", "KeyW", "KeyS")
                                    .multiplyScalar(10)
                                    .multiplyScalar(time.deltaTime),
                              viewport.position,
                        );
                        viewport.zoom(
                              -inputSign("KeyQ", "KeyE") * time.deltaTime * 20,
                              true
                        );
                  });

                  addInputListener((event) => {
                        if (isKeyJustPressed("KeyR"))
                              app.stage.scale = new Point(0, 0);
                  });
            },
      );
</script>
