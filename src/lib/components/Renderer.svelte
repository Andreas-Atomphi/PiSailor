<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let canvas: HTMLCanvasElement;

    // Resize handler
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    onMount(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
    });

    onDestroy(() => {
        window.removeEventListener("resize", resizeCanvas);
    });

    // Método exportado pra pegar o canvas de fora
    export function getCanvas(): HTMLCanvasElement {
        return canvas;
    }
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        background-color: black;
        image-rendering: pixelated;
    }
</style>
