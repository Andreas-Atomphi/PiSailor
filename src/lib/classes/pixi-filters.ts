import * as PIXI from "pixi.js";
import * as PIXIFilters from "pixi-filters";
import * as PISailorFilters from "../filters/index";


const blackAndWhite = new PISailorFilters.BlackAndWhite(0.5);

const grayScale = new PIXI.ColorMatrixFilter();
grayScale.blackAndWhite(true);


const sepia = new PIXI.ColorMatrixFilter();
sepia.sepia(true);

const negative = new PIXI.ColorMatrixFilter();
negative.negative(true);

const highContrast = new PIXI.ColorMatrixFilter();
highContrast.contrast(1.0, true)

const emboss = new PIXIFilters.EmbossFilter(1.0);

const pixiShaders = new Map<string, PIXI.Filter>();
pixiShaders.set("Black and white", blackAndWhite)
    .set("Grayscale", grayScale)
    .set("Sepia", sepia)
    .set("Negative", negative)
    .set("High Contrast", highContrast)
    .set("Emboss", emboss);

export { pixiShaders };