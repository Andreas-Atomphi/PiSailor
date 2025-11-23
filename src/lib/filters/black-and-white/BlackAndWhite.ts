import fragment from "./black-and-white.frag?raw";
import source from "./black-and-white.wgsl?raw";
import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from 'pixi-filters/defaults';

export class BlackAndWhite extends Filter
{
    constructor(threshold: number)
    {
        const gpuProgram = GpuProgram.from({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = GlProgram.from({
            vertex,
            fragment,
            name: 'black-and-white-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                blackAndWhiteUniforms: {
                    uThreshold: { value: 0.5, type: "f32" }
                }
            },
        });
    }
}