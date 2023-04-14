#version 300 es

precision mediump float;

in vec3 vertPosition;
in vec3 vertNormal;
in vec2 texCoord;

out vec3 v_lighting;
out vec2 v_texCoord;

uniform mat4 viewMatrix;
uniform mat4 projMatrix;

uniform vec3 lightDirection;
uniform vec3 ambientLightColor;
uniform vec3 diffuseLightColor;

void main() {
    gl_Position = projMatrix * viewMatrix * vec4(vertPosition, 1.0);
    v_texCoord = texCoord;

    mat4 normalMatrix = transpose(inverse(viewMatrix));
    vec3 transformedNormal = normalize(normalMatrix * vec4(vertNormal, 1.0)).xyz;
    float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
    v_lighting = ambientLightColor + (diffuseLightColor * directionalLightWeighting);
}