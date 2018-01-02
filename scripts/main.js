// Global variable definition
var canvas;
var gl;

// shading programs
var shaderProgram;

class GameObject{
    constructor(){
        this.VertexPositionBuffer;
        this.VertexNormalBuffer;
        this.VertexTextureCoordBuffer;
        this.VertexIndexBuffer;
    }
}

// Buffers

var cube = new GameObject();
var world = new GameObject();

// Model-View and Projection matrices
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// Helper variables for storing current rotation of pyramid and cube


// Helper variable for animation
var lastTime = 0;

// Variable for storing textures
var cubeTexture;
var worldTexture;

// Variable that stores  loading state of textures.
var numberOfTextures = 2;
var texturesLoaded = 0;


// Keyboard handling helper variable for reading the status of keys
var currentlyPressedKeys = {};

// Variables for storing current position of cube
var jump = false;
var positionCube = [0.0, -1.0, -7.0];
var rotationCube = [0.0, 0.0, 0.0];
var moveSpeedCube = [0.0, 0.0, -10,0];
var rotationSpeedCube = [0.0, 0.0, 0.0];
var onGround = true;
var cubeLane = 1;
var laneWidth = 4;



//
// Matrix utility functions
//
// mvPush   ... push current matrix on matrix stack
// mvPop    ... pop top matrix from stack
// degToRad ... convert degrees to radians
//

function setCameraPosition(pMatrix, posX, posY, posZ, pitch, yaw){
    mat4.rotate(pMatrix, degToRad(pitch), [1, 0, 0]);
    mat4.rotate(pMatrix, degToRad(yaw), [0, 1, 0]);
    mat4.translate(pMatrix, [-posX, -posY, -posZ]);
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length === 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

//
// initGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initGL(canvas) {
    var gl = null;
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    return gl;
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);

    // Didn't find an element with the specified ID; abort.
    if (!shaderScript) {
        return null;
    }

    // Walk through the source element's children, building the
    // shader source string.
    var shaderSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType === 3) {
            shaderSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    // Now figure out what type of shader script we have,
    // based on its MIME type.
    var shader;
    if (shaderScript.type === "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type === "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;  // Unknown shader type
    }

    // Send the source to the shader object
    gl.shaderSource(shader, shaderSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
    var fragmentShader = getShader(gl, "per-fragment-lighting-fs");
    var vertexShader = getShader(gl, "per-fragment-lighting-vs");
  
  // Create the shader program
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }

  // start using shading program for rendering
  gl.useProgram(shaderProgram);

  // store location of aVertexPosition variable defined in shader
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

  // turn on vertex position attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  // store location of vertex normals variable defined in shader
  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");

  // turn on vertex normals attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  // store location of texture coordinate variable defined in shader
  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");

  // turn on texture coordinate attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

  // store location of uPMatrix variable defined in shader - projection matrix 
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  // store location of uMVMatrix variable defined in shader - model-view matrix 
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  // store location of uNMatrix variable defined in shader - normal matrix 
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  // store location of uSampler variable defined in shader
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
  // store location of uMaterialShininess variable defined in shader
  shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
  // store location of uShowSpecularHighlights variable defined in shader
  shaderProgram.showSpecularHighlightsUniform = gl.getUniformLocation(shaderProgram, "uShowSpecularHighlights");
  // store location of uUseTextures variable defined in shader
  shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, "uUseTextures");
  // store location of uUseLighting variable defined in shader
  shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
  // store location of uAmbientColor variable defined in shader
  shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
  // store location of uPointLightingLocation variable defined in shader
  shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
  // store location of uPointLightingSpecularColor variable defined in shader
  shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");
  // store location of uPointLightingDiffuseColor variable defined in shader
  shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");
}

//
// setMatrixUniforms
//
// Set the uniform values in shaders for model-view and projection matrix.
//
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function initTextures() {

    worldTexture = gl.createTexture();
    worldTexture.image = new Image();
    worldTexture.image.onload = function () {
        handleTextureLoaded(worldTexture)
    };
    worldTexture.image.src = "./assets/wall.png";

    console.log("initializing world");

    cubeTexture = gl.createTexture();
    cubeTexture.image = new Image();
    cubeTexture.image.onload = function () {
        handleTextureLoaded(cubeTexture);
    };
    cubeTexture.image.src = "./assets/crate.gif";

    console.log("initializing cube");
}

function handleTextureLoaded(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Third texture uses Linear interpolation approximation with nearest Mipmap selection
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);

    console.log(texture);

    // when texture loading is finished we can draw scene.
    texturesLoaded += 1;
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// two objects -- a simple two-dimensional pyramid and cube.
//
function initBuffers() {


    // WORLD PLANE
    // Create a buffer for the cube's vertices.
    world.VertexPositionBuffer = gl.createBuffer();

    // Select the world.VertexPositionBuffer as the one to apply vertex
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, world.VertexPositionBuffer);

    // Now create an array of vertices for the world.
    vertices = [
        // MAIN PLANE
        -6.0, 0.0, -500.0,
        6.0, 0.0, -500.0,
        6.0, 0.0,  0.0,
        -6.0, 0.0,  0.0
    ];

    // Now pass the list of vertices into WebGL to build the shape. We
    // do this by creating a Float32Array from the JavaScript array,
    // then use it to fill the current vertex buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    world.VertexPositionBuffer.itemSize = 3;
    world.VertexPositionBuffer.numItems = 4;

    // Map the normals onto the world's faces.
    world.VertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, world.VertexNormalBuffer);

    // Now create an array of vertex normals for the world.
    var vertexNormals = [
        // plane
        0.0, 1.0,  0.0,
        0.0, 1.0,  0.0,
        0.0, 1.0,  0.0,
        0.0, 1.0,  0.0
    ];

    // Pass the normals into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    world.VertexNormalBuffer.itemSize = 3;
    world.VertexNormalBuffer.numItems = 4;

    // Now create an array of texture coordinates for the world.
    world.VertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, world.VertexTextureCoordBuffer);

    // Now create an array of vertex texture coordinates for the world.
    var textureCoords = [
        // plane
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0
    ];

    // Pass the texture coordinates into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    world.VertexTextureCoordBuffer.itemSize = 2;
    world.VertexTextureCoordBuffer.numItems = 4;

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    world.VertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, world.VertexIndexBuffer);
    var worldVertexIndices = [
        2, 1, 0,      3, 2, 0    // MAIN PLANE
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(worldVertexIndices), gl.STATIC_DRAW);
    world.VertexIndexBuffer.itemSize = 1;
    world.VertexIndexBuffer.numItems = 6;

    //CUBE
    // Create a buffer for the cube's vertices.
    cube.VertexPositionBuffer = gl.createBuffer();

    // Select the cube.VertexPositionBuffer as the one to apply vertex
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.VertexPositionBuffer);

    // Now create an array of vertices for the cube.
    vertices = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];

    // Now pass the list of vertices into WebGL to build the shape. We
    // do this by creating a Float32Array from the JavaScript array,
    // then use it to fill the current vertex buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cube.VertexPositionBuffer.itemSize = 3;
    cube.VertexPositionBuffer.numItems = 24;

    // Map the normals onto the cube's faces.
    cube.VertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.VertexNormalBuffer);

    // Now create an array of vertex normals for the cube.
    var vertexNormals = [
        // Front face
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back face
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        // Top face
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        // Bottom face
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Right face
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        // Left face
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];

    // Pass the normals into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    cube.VertexNormalBuffer.itemSize = 3;
    cube.VertexNormalBuffer.numItems = 24;

    // Now create an array of texture coordinates for the cube.
    cube.VertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.VertexTextureCoordBuffer);

    // Now create an array of vertex texture coordinates for the cube.
    var textureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];

    // Pass the texture coordinates into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cube.VertexTextureCoordBuffer.itemSize = 2;
    cube.VertexTextureCoordBuffer.numItems = 24;

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    cube.VertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.VertexIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cube.VertexIndexBuffer.itemSize = 1;
    cube.VertexIndexBuffer.numItems = 36;

}

//
// drawScene
//
// Draw the scene.
//
function drawScene() {
    // set the rendering environment to full canvas size
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Establish the perspective with which we want to view the
    // scene. Our field of view is 45 degrees, with a width/height
    // ratio and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    setCameraPosition(pMatrix, positionCube[0]/2, positionCube[1]/2+3, positionCube[2]+10, 10, 0);

    var lighting = true;
    gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, true);
    gl.uniform1i(shaderProgram.useLightingUniform, lighting);
    gl.uniform1i(shaderProgram.useTexturesUniform, true);
    gl.uniform1f(shaderProgram.materialShininessUniform, 1000);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    mat4.identity(mvMatrix);

   // set uniforms for lights as defined in the document
    if (lighting) {
        gl.uniform3f(
            shaderProgram.ambientColorUniform,
            parseFloat(document.getElementById("ambientR").value),
            parseFloat(document.getElementById("ambientG").value),
            parseFloat(document.getElementById("ambientB").value)
        );

        gl.uniform3f(
            shaderProgram.pointLightingLocationUniform,
            parseFloat(document.getElementById("lightPositionX").value),
            parseFloat(document.getElementById("lightPositionY").value),
            parseFloat(document.getElementById("lightPositionZ").value)
        );

        gl.uniform3f(
            shaderProgram.pointLightingSpecularColorUniform,
            parseFloat(document.getElementById("specularR").value),
            parseFloat(document.getElementById("specularG").value),
            parseFloat(document.getElementById("specularB").value)
        );

        gl.uniform3f(
            shaderProgram.pointLightingDiffuseColorUniform,
            parseFloat(document.getElementById("diffuseR").value),
            parseFloat(document.getElementById("diffuseG").value),
            parseFloat(document.getElementById("diffuseB").value)
        );
    }

    // set uniform to the value of the checkbox.
    gl.uniform1i(shaderProgram.useTexturesUniform, true);

    // world:

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    mat4.identity(mvMatrix);

    // Now move the drawing position a bit to where we want to start
    // drawing the world.
    mat4.translate(mvMatrix, [0.0, -2.0, -7.0]);

    // Save the current matrix, then rotate before we draw.
    mvPushMatrix();

    // Set the vertex positions attribute for the world vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, world.VertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, world.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the normals attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, world.VertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, world.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the texture coordinates attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, world.VertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, world.VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Activate textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, worldTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // Draw the world.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, world.VertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, world.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    // Restore the original matrix
    mvPopMatrix();

    mvPushMatrix();

    // CUBE:

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    mat4.identity(mvMatrix);
    //setCameraPosition(0, 0, 2, 0, 0);

    // Now move the drawing position a bit to where we want to start
    // drawing the cube.
    mat4.translate(mvMatrix, positionCube);

    // Save the current matrix, then rotate before we draw.
    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(rotationCube[0]), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(rotationCube[1]), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(rotationCube[2]), [0, 0, 1]);

    // Set the vertex positions attribute for the cube vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.VertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cube.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the normals attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.VertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cube.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the texture coordinates attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.VertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cube.VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Activate textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // Draw the cube.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.VertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cube.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    // Restore the original matrix
    mvPopMatrix();
}

//
// animate
//
// Called every time before redeawing the screen.
//

function moveObjects(elapsed){
    positionCube[0] += moveSpeedCube[0]*elapsed/1000;
    positionCube[1] += moveSpeedCube[1]*elapsed/1000;
    positionCube[2] += moveSpeedCube[2]*elapsed/1000;
}


function animate() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
        var elapsed = timeNow - lastTime;

        // rotate pyramid and cube for a small amount
        if (jump && onGround) {
            moveSpeedCube[1] = 10;
            onGround = false;
            jump = false;
        }
        if(!onGround){
            moveSpeedCube[1] -= 30*elapsed/1000;
        }

        moveObjects(elapsed);

        if(positionCube[1]<=-1 && !onGround){
            positionCube[1]= -1;
            moveSpeedCube[1] = 0;
            onGround = true;
            jump = false
        }



    }
    lastTime = timeNow;
}

//
// Keyboard handling helper functions
//
// handleKeyDown    ... called on keyDown event
// handleKeyUp      ... called on keyUp event
//
function handleKeyDown(event) {
    // storing the pressed state for individual key
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    // reseting the pressed state for individual key
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    if (currentlyPressedKeys[37]) {
        // Left cursor key
        moveSpeedCube[0] -= 0.5;
    } else if (currentlyPressedKeys[39]) {
        // Right cursor key
        moveSpeedCube[0] += 0.5;
    } else if (currentlyPressedKeys[38]) {
        // Up cursor key
        moveSpeedCube[2] -= 0.5;
    } else if (currentlyPressedKeys[40]) {
        // Down cursor key
        moveSpeedCube[2] += 0.5;
    } else {
        if(Math.abs(moveSpeedCube[0]) < 0.5){
            moveSpeedCube[0] = 0;
        } else {
            moveSpeedCube[0] = moveSpeedCube[0]*(1-(1/20));
        }
        if(Math.abs(moveSpeedCube[2]) < 0.5){
            moveSpeedCube[2] = 0;
        } else {
            moveSpeedCube[2] = moveSpeedCube[02]*(1-(1/20));
        }
    }
    if (currentlyPressedKeys[32]) {
        // Down cursor key
        jump = true;
    }
}



//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start() {
    canvas = document.getElementById("glCanvas");

    gl = initGL(canvas);      // Initialize the GL context

    // Only continue if WebGL is available and working
    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        gl.clearDepth(1.0);                                     // Clear everything
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

        // Initialize the shaders; this is where all the lighting for the
        // vertices and so forth is established.
        initShaders();

        // Here's where we call the routine that builds all the objects
        // we'll be drawing.
        initBuffers();

        initTextures();

        // Bind keyboard handling functions to document handlers
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        // Set up to draw the scene periodically every 15ms.
        setInterval(function() {
            if (texturesLoaded === numberOfTextures) {
                requestAnimationFrame(animate);
                handleKeys();
                drawScene();
            }
        }, 15);

    }
}
