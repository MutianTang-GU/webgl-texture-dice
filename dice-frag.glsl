#version 300 es

precision mediump float;

in vec2 v_texCoord;
in vec3 v_lighting;

out vec4 outColor;

uniform sampler2D sampler;

void main() {
    vec4 texColor = texture(sampler, v_texCoord);
    outColor = vec4(texColor.rgb * v_lighting, texColor.a);
}