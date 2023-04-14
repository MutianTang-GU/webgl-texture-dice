/**
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexShaderSource
 * @param {string} fragmentShaderSource
 * @returns {WebGLProgram}
 */
export function createShaderProgram(
  gl,
  vertexShaderSource,
  fragmentShaderSource
) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(
      "An error occurred compiling the shaders" +
        gl.getShaderInfoLog(vertexShader)
    );
  }
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw new Error(
      "An error occurred compiling the shaders" +
        gl.getShaderInfoLog(fragmentShader)
    );
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program)
    );
  }
  gl.useProgram(program);
  return program;
}
/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {Float32Array} vertices
 * @param {Float32Array} normals
 * @param {Float32Array} textureCoords
 * @param {Uint16Array} indices
 * @param {string} positionAttributeName
 * @param {string} normalAttributeName
 * @param {string} textureCoordAttributeName
 */
export function bufferData(
  gl,
  program,
  vertices,
  normals,
  textureCoords,
  indices,
  positionAttributeName,
  normalAttributeName,
  textureCoordAttributeName
) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(
    program,
    positionAttributeName
  );
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  {
    const size = 3;
    const type = gl.FLOAT;
    const normalized = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalized,
      stride,
      offset
    );
  }
  const normalAttributeLocation = gl.getAttribLocation(
    program,
    normalAttributeName
  );
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  {
    const size = 3;
    const type = gl.FLOAT;
    const normalized = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
      normalAttributeLocation,
      size,
      type,
      normalized,
      stride,
      offset
    );
  }
  const textureCoordAttributeLocation = gl.getAttribLocation(
    program,
    textureCoordAttributeName
  );
  gl.enableVertexAttribArray(textureCoordAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  {
    const size = 2;
    const type = gl.FLOAT;
    const normalized = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
      textureCoordAttributeLocation,
      size,
      type,
      normalized,
      stride,
      offset
    );
  }
}

export function setUniform_mat4(gl, program, name, value) {
  const location = gl.getUniformLocation(program, name);
  gl.uniformMatrix4fv(location, false, value);
}

export function setUniform_vec3(gl, program, name, value) {
  const location = gl.getUniformLocation(program, name);
  gl.uniform3fv(location, value);
}
