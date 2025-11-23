in vec2 vTextureCoord;

out vec4 finalColor;

uniform sampler2D uTexture;
uniform float uThreshold;

// https://en.wikipedia.org/wiki/Luma_(video)
const vec3 weight = vec3(0.299, 0.587, 0.114);

void main()
{
    vec4 color = texture(uTexture, vTextureCoord);
    float lum = dot(color.rgb, weight);
    float bw = lum > uThreshold ? 1.0 : 0.0;
    finalColor = vec4(
        vec3(bw),
        color.a
    );
}