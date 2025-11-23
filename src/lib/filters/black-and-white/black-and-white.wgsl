struct Uniforms {
    threshold: f32,
}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;

fn luma(rgb: vec3<f32>) -> f32 {
    // valores de luminância (ITU-R BT.601)
    return dot(rgb, vec3<f32>(0.299, 0.587, 0.114));
}

@fragment
fn main(
    @location(0) vTextureCoord: vec2<f32>
) -> @location(0) vec4<f32> {
    let c = textureSample(uTexture, uSampler, vTextureCoord);
    let lum = luma(c.rgb);

    let bw = select(0.0, 1.0, lum > uniforms.threshold);

    return vec4<f32>(vec3<f32>(bw), c.a);
}
