<script>
  import * as PIXI from "pixi.js";

  (async function () {
    const app = new PIXI.Application();
    await app.init({background: "#000000", resizeTo: window});
    document.body.appendChild(app.canvas);
  })();
</script>
