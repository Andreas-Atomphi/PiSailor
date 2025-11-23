<script lang="ts">
      import "pixi.js/math-extras";
      import { onMount } from "svelte";
      import { Filter, Graphics, Point } from "pixi.js";
      import { Viewport } from "pixi-viewport";
      import hotkeys from "hotkeys-js";
      import Sortable from 'sortablejs';
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
      import KeyIndicator from "./lib/components/KeyIndicator.svelte";
      import { pixiShaders } from "./lib/classes/pixi-filters";

      let renderer: Renderer;
      let refreshShaders: () => void
      let activeShaders = new Map(pixiShaders.entries().map(shader => [shader[0], false]));

      hotkeys.setScope("general");
      let sortableList: HTMLUListElement;

      onMount(async () => {
            const { app, Input } = await setup(renderer!.getCanvas());
            const viewport = new Viewport({
                  screenWidth: window.innerWidth,
                  screenHeight: window.innerHeight,
                  events: app.renderer.events,
            });
            viewport
                  .clampZoom({
                        minScale: 0.25,
                        maxScale: 10,
                  })
                  .drag()
                  .pinch()
                  .wheel({ smooth: 3 });
            app.stage.addChild(viewport);
            refreshShaders = () => {
                  const filters: Filter[] = []
                  for (const [name, enabled] of activeShaders.entries()) {
                        if (!enabled) continue;
                        if (activeShaders.get(name)) {
                              filters.push(pixiShaders.get(name)!)
                        }
                  }
                  app.stage.filters = filters;
            }
            app.stage.filters = []

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

            new Sortable(sortableList!, {
                  animation: 150,
                  onEnd: (evt) => {
                        activeShaders = new Map();
                        for (const li of sortableList!.children) {
                              const checkbox = li.firstElementChild! as HTMLInputElement;
                              activeShaders.set(checkbox.getAttribute("name")!, checkbox.checked);
                        }
                        refreshShaders();
                  }
            });
      });
</script>

<Renderer bind:this={renderer}></Renderer>

<TriggerButton
      className="
            absolute
            top-0
            right-0
      "
      icon="menu"
      hotkey="m"
      onTrigger={() => {
            document.getElementById("menu")!.classList.toggle("menu-hide");
            document.getElementById("menu")!.classList.toggle("menu-show");
      }}
/>
<div id="menu" class="absolute h-full top-0 w-100 pointer-events-none menu-hide">
      <div class="
            absolute
            top-0
            left-0
            w-50
            justify-between
            bg-black
            rounded-br-xl
            border-b-4
            border-r-4
            border-white
            pointer-events-auto
      ">
            <ul bind:this={sortableList} id="sortable-list">
                  {#each pixiShaders as shader}
                        <li
                              class="
                                    text-white
                                    flex
                                    items-center
                                    justify-between
                                    pl-2
                                    pr-2
                                    border-b-1
                                    border-t-1
                                    border-white
                              "
                        >
                              <input
                                    id="checkbox-{shader[0]}"
                                    name="{shader[0]}" type="checkbox"
                                    class="border border-default-medium"
                                    onchange={(e) => {
                                          activeShaders.set(
                                                shader[0],
                                                e.currentTarget.checked
                                          )
                                          refreshShaders();
                                    }}
                              />
                              <label
                                    for="checkbox-{shader[0]}"
                                    class="
                                          select-none
                                          w-full
                                          py-4
                                          ms-2
                                          text-sm
                                          font-medium
                                          text-heading"
                              >
                                    {shader[0]}
                              </label>
                              <svg class="cursor-grab shrink-0 size-4 ms-auto text-white h-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="9" cy="12" r="1"></circle>
                                    <circle cx="9" cy="5" r="1"></circle>
                                    <circle cx="9" cy="19" r="1"></circle>
                                    <circle cx="15" cy="12" r="1"></circle>
                                    <circle cx="15" cy="5" r="1"></circle>
                                    <circle cx="15" cy="19" r="1"></circle>
                              </svg>
                        </li>            
                  {/each}
            </ul>
      </div>

      <div class="
            absolute
            bottom-0
            left-0
            grid
            grid-rows-2
            grid-cols-4
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
                        key="r"
                        icon="settings_backup_restore"
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
                  <KeyIndicator
                        className="relative"
                        shape="circle"
                  />

      </div>
</div>

<style>
      :global(body){
            margin: 0;
            padding: 0;
            background-color: black;
            overflow: hidden;
      }

      #menu {
            transition: transform 0.25s cubic-bezier(.4, 0, .2, 1), opacity 0.25s cubic-bezier(.4, 0, .2, 1);
      }

      /* svelte-ignore unused-selector */
      #menu.menu-show {
            transform: translateX(0%);
            opacity: 1.0;
      }

      #menu.menu-hide {
            transform: translateX(-100%);
            opacity: 0.0;
      }
</style>