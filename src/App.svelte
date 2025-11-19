<script lang="ts">
      import "pixi.js/math-extras";
      import { onMount } from "svelte";
      import { Graphics, Point } from "pixi.js";
      import { Viewport } from "pixi-viewport";
      import hotkeys from "hotkeys-js";
      import { setup } from "./app-sailor-setup";
      import Renderer from "./lib/components/Renderer.svelte";
      import {
            chunkGridGraphics,
            ChunkManager,
      } from "./lib/classes/chunk-manager";
      import { PiDecoder } from "./lib/classes/pi-codec";
      import { PiDigitsManager } from "./lib/classes/pi-digits-manager";
      import { PiImageEncoder } from "./lib/classes/pi-image-encoder";
      import { Settings } from "./lib/classes/settings";
      import TriggerButton from "./lib/components/TriggerButton.svelte";
      import Menu from "./lib/components/menu/Menu.svelte";
      import KeyIndicator from "./lib/components/KeyIndicator.svelte";

      let renderer: Renderer;
      let menu: Menu;

      hotkeys.setScope("general");

      onMount(async () => {
            const { app, Input } = await setup(renderer!.getCanvas());
            const viewport = new Viewport({
                  screenWidth: window.innerWidth,
                  screenHeight: window.innerHeight,
                  events: app.renderer.events,
            });
            viewport
                  .clampZoom({
                        minScale: 3,
                        maxScale: 10,
                  })
                  .drag()
                  .pinch()
                  .wheel({ smooth: 3 });
            app.stage.addChild(viewport);

            const piDigitsManager = new PiDigitsManager();
            const piImageEncoder = new PiImageEncoder();
            const piDecoder = new PiDecoder(piImageEncoder);
            const chunkManager = new ChunkManager();

            viewport.addChild(chunkManager);
            chunkManager.position = {
                  x: viewport.screenWidthInWorldPixels * 0.5,
                  y: viewport.screenHeightInWorldPixels * 0.5,
            };

            let chunkGridManager: {
                  view: Graphics;
                  destroy: () => void;
            } | null = chunkGridGraphics(
                  {
                        width: viewport.screenWidthInWorldPixels,
                        height: viewport.screenHeightInWorldPixels,
                  },
                  app.ticker,
            );

            chunkGridManager.view.position = new Point(0, 0);
            viewport.addChildAt(chunkGridManager.view, 0);

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
                  if (chunk) {
                        if (chunkGridManager?.view) {
                              chunkGridManager.destroy();
                              chunkGridManager = null;
                        }
                        chunkManager.addChild(chunk);
                  }
            });

            app.ticker.add((time) => {
                  viewport.position.subtract(
                        Input.inputAxis("KeyA", "KeyD", "KeyW", "KeyS")
                              .multiplyScalar(10)
                              .multiplyScalar(time.deltaTime),
                        viewport.position,
                  );
                  viewport.zoom(
                        -Input.inputSign("KeyQ", "KeyE") * time.deltaTime * 20,
                        true,
                  );
            });

            Input.addInputListener((event) => {
                  if (Input.isKeyJustPressed("KeyR")) viewport.setZoom(3, true);
            });
      });
</script>

<Renderer bind:this={renderer}></Renderer>

<TriggerButton
      hotkey="m"
      onTrigger={ () => {} }
      icon="menu"
      className="absolute top-0 right-0 mt-4 mr-4"
/>


<div class="
      absolute
      bottom-0
      left-0
      grid
      grid-rows-2
      grid-cols-3
      justify-between
      gap-4
      bg-black
      pt-4
      pr-4
      pb-10
      pl-10
      rounded-tr-xl
      border-t-4
      border-r-4
      border-white
      ">
            
            <KeyIndicator
                  key="q"
                  icon="zoom_out"
                  className="relative"
                  shape="square"
            />
            <KeyIndicator
                  key="w"
                  icon="keyboard_arrow_up"
                  className="relative"
                  shape="square"
            />
            <KeyIndicator
                  key="e"
                  icon="zoom_in"
                  className="relative"
                  shape="square"
            />
            <KeyIndicator
                  key="a"
                  icon="keyboard_arrow_left"
                  className="relative"
                  shape="square"
            />
            <KeyIndicator
                  key="s"
                  icon="keyboard_arrow_down"
                  className="relative"
                  shape="square"
            />
            <KeyIndicator
                  key="d"
                  icon="keyboard_arrow_right"
                  className="relative"
                  shape="square"
            />
</div>

<style>
      :global(body){
            margin: 0;
            padding: 0;
            background-color: black;
            overflow: hidden;
      }
</style>