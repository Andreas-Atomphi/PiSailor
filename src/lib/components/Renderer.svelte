<script lang="ts">
    window.addEventListener("resize", event => {
        const renderer = document.querySelector("canvas");
        renderer!.width = window.innerWidth;
        renderer!.height = window.innerHeight;
    })
</script>

<canvas id="canvas-renderer"></canvas>

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