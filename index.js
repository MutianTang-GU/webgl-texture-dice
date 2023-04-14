import { cube } from "./simpleObjectLibrary.js";
import { mat4 } from "gl-matrix";
import {
  createShaderProgram,
  bufferData,
  setUniform_mat4,
  setUniform_vec3,
} from "./utils.js";
import vertexShaderSource from "./dice-vert.glsl";
import fragmentShaderSource from "./dice-frag.glsl";

function main() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("gl-canvas");
  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl2");
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  const { vertexPositions, vertexNormals, indices } = cube(2);
  const vertexTextureCoords = new Float32Array([
    // one
    0, 0.5, 0.25, 0.5, 0.25, 0.75, 0, 0.75,
    // six
    0.5, 0.25, 0.75, 0.25, 0.75, 0.5, 0.5, 0.5,
    // two
    0.25, 0.5, 0.5, 0.5, 0.5, 0.75, 0.25, 0.75,
    // five
    0.5, 0.75, 0.75, 0.75, 0.75, 1, 0.5, 1,
    // three
    0.5, 0.5, 0.75, 0.5, 0.75, 0.75, 0.5, 0.75,
    // four
    0.75, 0.5, 1, 0.5, 1, 0.75, 0.75, 0.75,
  ]);

  const program = createShaderProgram(
    gl,
    vertexShaderSource.sourceCode,
    fragmentShaderSource.sourceCode
  );

  bufferData(
    gl,
    program,
    vertexPositions,
    vertexNormals,
    vertexTextureCoords,
    indices,
    "vertPosition",
    "vertNormal",
    "texCoord"
  );

  const projectionMatrix = mat4.create();
  {
    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  }

  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);

  setUniform_mat4(gl, program, "projMatrix", projectionMatrix);
  setUniform_mat4(gl, program, "viewMatrix", modelViewMatrix);
  setUniform_vec3(gl, program, "lightDirection", [2, 1, 1]);
  setUniform_vec3(gl, program, "ambientLightColor", [0.3, 0.3, 0.3]);
  setUniform_vec3(gl, program, "diffuseLightColor", [0.7, 0.7, 0.7]);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([221, 221, 221, 255])
  ); // Before image loaded, fill the texture with a 1x1 gray pixel.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const textureImage = new Image();
  textureImage.src = "./dice_uv.png";
  textureImage.addEventListener("load", function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      textureImage
    );
    gl.generateMipmap(gl.TEXTURE_2D);
  });

  let then = 0;

  function draw(time) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    const deltaTime = time - then;
    then = time;

    mat4.rotate(
      modelViewMatrix,
      modelViewMatrix,
      deltaTime * 0.001,
      [0, 3, 2]
    );
    setUniform_mat4(gl, program, "viewMatrix", modelViewMatrix);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

if (document.readyState !== "loading") {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}
