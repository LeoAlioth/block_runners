// Global variable definition
var canvas;
var gl;

// shading programs
var shaderProgram;

class GameObject {
    constructor() {
        this.VertexPositionBuffer;
        this.VertexNormalBuffer;
        this.VertexTextureCoordBuffer;
        this.VertexIndexBuffer;
        this.Position;
        this.Rotation;
        this.Speed;
        this.RotationSpeed;
    }
}

class LevelPiece {
    constructor() {
        this.Ground;
        this.GameObject = new Array(3);
        for (var i = 0; i < 3; i++) {
            this.GameObject[i] = new Array(3);
            for (var j = 0; j < 3; j++) {
                this.GameObject[i][j] = new Array(3);
            }
        }
    }
}

var CubeVertices = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
];

// Now create an array of vertex normals for the GameObject.
var CubeVertexNormals = [
    // Front face
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back face
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Top face
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom face
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Right face
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left face
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
];


// Now create an array of vertex texture coordinates for the GameObject.
var CubeTextureCoords = [
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
// Buffers

var CubeVertexIndices = [
    0, 1, 2, 0, 2, 3,    // Front face
    4, 5, 6, 4, 6, 7,    // Back face
    8, 9, 10, 8, 10, 11,  // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23  // Left face
];


var Cube = new GameObject();
var GroundPlane = new GameObject();
var LevelPart = new Array(10);
for (var i = 0; i < LevelPart.length; i++) {
    LevelPart[i] = new LevelPiece();
    LevelPart[i].Ground = GroundPlane;
}

// Model-View and Projection matrices
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// Helper variables for storing current Rotation of pyramid and Cube


// Helper variable for animation
var lastTime = 0;

// Variable for storing textures
var CubeTexture;
var GroundPlaneTexture;

// Variable that stores  loading state of textures.
var numberOfTextures = 2;
var texturesLoaded = 0;


// Keyboard handling helper variable for reading the status of keys
var currentlyPressedKeys = {};
var clickedKeys = {};

// Variables for storing game mechanics data
var travelSpeed = 0;
var jump = false;
var onGround = true;
var CubeLane = 0;
var laneWidth = 4;

// Variables for storing current Position of Cube

Cube.Position = [0.0, -1.0, -7.0];
Cube.Rotation = [0.0, 0.0, 0.0];
Cube.Speed = [0.0, 0.0, travelSpeed];
Cube.RotationSpeed = [0.0, 0.0, 0.0];


//
// Matrix utility functions
//
// mvPush   ... push current matrix on matrix stack
// mvPop    ... pop top matrix from stack
// degToRad ... convert degrees to radians
//

function setCameraPosition(pMatrix, posX, posY, posZ, pitch, yaw) {
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

    // turn on vertex Position attribute at specified Position
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // store location of vertex normals variable defined in shader
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");

    // turn on vertex normals attribute at specified Position
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // store location of texture coordinate variable defined in shader
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");

    // turn on texture coordinate attribute at specified Position
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

    GroundPlaneTexture = gl.createTexture();
    GroundPlaneTexture.image = new Image();
    GroundPlaneTexture.image.onload = function () {
        handleTextureLoaded(GroundPlaneTexture)
    };
    GroundPlaneTexture.image.src = "./assets/wall.png";

    //console.log("initializing GroundPlane");

    CubeTexture = gl.createTexture();
    CubeTexture.image = new Image();
    CubeTexture.image.onload = function () {
        handleTextureLoaded(CubeTexture);
    };
    CubeTexture.image.src = "./assets/crate.gif";

    //console.log("initializing Cube");
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

    //console.log(texture);

    // when texture loading is finished we can draw scene.
    texturesLoaded += 1;
}


function initGameObjectBuffers(GameObject, vertices, vertexNormals, textureCoords, vertexIndices) {
    GameObject.VertexPositionBuffer = gl.createBuffer();

    // Select the GameObject.VertexPositionBuffer as the one to apply vertex
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, GameObject.VertexPositionBuffer);


    // Now pass the list of vertices into WebGL to build the shape. We
    // do this by creating a Float32Array from the JavaScript array,
    // then use it to fill the current vertex buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    GameObject.VertexPositionBuffer.itemSize = 3;
    GameObject.VertexPositionBuffer.numItems = vertices.length / 3;

    // Map the normals onto the GameObject's faces.
    GameObject.VertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, GameObject.VertexNormalBuffer);


    // Pass the normals into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    GameObject.VertexNormalBuffer.itemSize = 3;
    GameObject.VertexNormalBuffer.numItems = vertexNormals.length / 3;

    // Now create an array of texture coordinates for the GameObject.
    GameObject.VertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, GameObject.VertexTextureCoordBuffer);


    // Pass the texture coordinates into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    GameObject.VertexTextureCoordBuffer.itemSize = 2;
    GameObject.VertexTextureCoordBuffer.numItems = 24;

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // Position.
    GameObject.VertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GameObject.VertexIndexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    GameObject.VertexIndexBuffer.itemSize = 1;
    GameObject.VertexIndexBuffer.numItems = 36;
}


//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// two objects -- a simple two-dimensional pyramid and Cube.
//

function initBuffers() {


    // GroundPlane PLANE
    // Create a buffer for the Plane's vertices.
    GroundPlane.VertexPositionBuffer = gl.createBuffer();

    // Select the GroundPlane.VertexPositionBuffer as the one to apply vertex
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundPlane.VertexPositionBuffer);

    // Now create an array of vertices for the GroundPlane.
    vertices = [
        // MAIN PLANE
        -6.0, 0.0, -500.0,
        6.0, 0.0, -500.0,
        6.0, 0.0, 0.0,
        -6.0, 0.0, 0.0
    ];

    // Now pass the list of vertices into WebGL to build the shape. We
    // do this by creating a Float32Array from the JavaScript array,
    // then use it to fill the current vertex buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    GroundPlane.VertexPositionBuffer.itemSize = 3;
    GroundPlane.VertexPositionBuffer.numItems = 4;

    // Map the normals onto the GroundPlane's faces.
    GroundPlane.VertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundPlane.VertexNormalBuffer);

    // Now create an array of vertex normals for the GroundPlane.
    var vertexNormals = [
        // plane
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ];

    // Pass the normals into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    GroundPlane.VertexNormalBuffer.itemSize = 3;
    GroundPlane.VertexNormalBuffer.numItems = 4;

    // Now create an array of texture coordinates for the GroundPlane.
    GroundPlane.VertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundPlane.VertexTextureCoordBuffer);

    // Now create an array of vertex texture coordinates for the GroundPlane.
    var textureCoords = [
        // plane
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0
    ];

    // Pass the texture coordinates into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    GroundPlane.VertexTextureCoordBuffer.itemSize = 2;
    GroundPlane.VertexTextureCoordBuffer.numItems = 4;

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // Position.
    GroundPlane.VertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GroundPlane.VertexIndexBuffer);
    var GroundPlaneVertexIndices = [
        2, 1, 0, 3, 2, 0    // MAIN PLANE
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(GroundPlaneVertexIndices), gl.STATIC_DRAW);
    GroundPlane.VertexIndexBuffer.itemSize = 1;
    GroundPlane.VertexIndexBuffer.numItems = 6;


    initGameObjectBuffers(Cube, CubeVertices, CubeVertexNormals, CubeTextureCoords, CubeVertexIndices);
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
    setCameraPosition(pMatrix, Cube.Position[0] / 2, Cube.Position[1] / 2 + 3, Cube.Position[2] + 10, 10, 0);

    var lighting = true;
    gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, true);
    gl.uniform1i(shaderProgram.useLightingUniform, lighting);
    gl.uniform1i(shaderProgram.useTexturesUniform, true);
    gl.uniform1f(shaderProgram.materialShininessUniform, 1000);

    // Set the drawing Position to the "identity" point, which is
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

    // GroundPlane:

    // Set the drawing Position to the "identity" point, which is
    // the center of the scene.
    mat4.identity(mvMatrix);

    // Now move the drawing Position a bit to where we want to start
    // drawing the GroundPlane.
    mat4.translate(mvMatrix, [0.0, -2.0, -7.0]);

    // Save the current matrix, then rotate before we draw.
    mvPushMatrix();

    // Set the vertex Positions attribute for the GroundPlane vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundPlane.VertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, GroundPlane.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the normals attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundPlane.VertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, GroundPlane.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the texture coordinates attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundPlane.VertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, GroundPlane.VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Activate textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, GroundPlaneTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // Draw the GroundPlane.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GroundPlane.VertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, GroundPlane.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    // Restore the original matrix
    mvPopMatrix();

    mvPushMatrix();

    // Cube:

    // Set the drawing Position to the "identity" point, which is
    // the center of the scene.
    mat4.identity(mvMatrix);
    //setCameraPosition(0, 0, 2, 0, 0);

    // Now move the drawing Position a bit to where we want to start
    // drawing the Cube.
    mat4.translate(mvMatrix, Cube.Position);

    // Save the current matrix, then rotate before we draw.
    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(Cube.Rotation[0]), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(Cube.Rotation[1]), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(Cube.Rotation[2]), [0, 0, 1]);

    // Set the vertex Positions attribute for the Cube vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.VertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, Cube.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the normals attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.VertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, Cube.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the texture coordinates attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.VertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, Cube.VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Activate textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, CubeTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // Draw the Cube.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.VertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Cube.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    // Restore the original matrix
    mvPopMatrix();
}

//
// animate
//
// Called every time before redeawing the screen.
//

function moveObjects(elapsed) {
    Cube.Position[0] += Cube.Speed[0] * elapsed / 1000;
    Cube.Position[1] += Cube.Speed[1] * elapsed / 1000;
    Cube.Position[2] += Cube.Speed[2] * elapsed / 1000;
    Cube.Rotation[0] += Cube.RotationSpeed[0] * elapsed / 1000;
    Cube.Rotation[1] += Cube.RotationSpeed[1] * elapsed / 1000;
    Cube.Rotation[2] += Cube.RotationSpeed[2] * elapsed / 1000;
}


function animate() {
    var timeNow = new Date().getTime();
    var sideAcc = 150;
    var maxSpeed = 15;
    if (lastTime !== 0) {
        var elapsed = timeNow - lastTime;
        // console.log(CubeLane);
        //console.log(CubeLane*laneWidth);
        //console.log(Cube.Position[0]);
        var distance = laneWidth * CubeLane - Cube.Position[0];
        //console.log(distance);
        //console.log(Math.abs((Cube.Speed[0]) * (Cube.Speed[0] / sideAcc)));
        //console.log(Cube.Speed[0]);


        if (Math.abs(distance) < 0.05) {
            Cube.Speed[0] = 0;
            //console.log("not moving");
        } else {
            if (Math.abs(distance) < Math.abs((Cube.Speed[0] / 2) * (Cube.Speed[0] / sideAcc))) {
                //console.log("if looks good");
                if (distance < 0)
                    Cube.Speed[0] += sideAcc * elapsed / 1000;
                else
                    Cube.Speed[0] -= sideAcc * elapsed / 1000;
            } else {
                //console.log("if doesn't look good");
                if (distance > 0)
                    Cube.Speed[0] += sideAcc * elapsed / 1000;
                else
                    Cube.Speed[0] -= sideAcc * elapsed / 1000;
            }
            if (Cube.Speed[0] > maxSpeed)
                Cube.Speed[0] = maxSpeed;
            if (Cube.Speed[0] < -maxSpeed)
                Cube.Speed[0] = -maxSpeed;

        }


        // rotate pyramid and Cube for a small amount
        if (jump && onGround) {
            Cube.Speed[1] = 20;
            onGround = false;
            jump = false;
        }
        if (!onGround) {
            Cube.Speed[1] -= 60 * elapsed / 1000;
            Cube.RotationSpeed[0] = -560;
        }

        moveObjects(elapsed);

        if (!(Cube.Position[1] <= -1 && !onGround)) {
        } else {
            Cube.Position[1] = -1;
            Cube.Speed[1] = 0;
            Cube.RotationSpeed[0] = 0;
            Cube.Rotation[0] = Math.round((Cube.Rotation[0] / 90)) * 90;
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
function handleKeyPress(event) {
    // storing the pressed state for individual key
    currentlyPressedKeys[event.keyCode] = true;
    clickedKeys[event.keyCode] = true;
    //console.log("key pressed");

}

function handleKeyUp(event) {
    // reseting the pressed state for individual key
    currentlyPressedKeys[event.keyCode] = false;

}

function handleKeys() {

    if (clickedKeys[37]) {
        // Left cursor key
        if (CubeLane > -1)
            CubeLane--;
        clickedKeys[37] = false;
    } else if (clickedKeys[39]) {
        // Right cursor key
        if (CubeLane < 1)
            CubeLane++;
        clickedKeys[39] = false;
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        console.log("up pressed");
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
        document.onkeypress = handleKeyPress;
        document.onkeyup = handleKeyUp;

        // Set up to draw the scene periodically every 15ms.
        setInterval(function () {
            if (texturesLoaded === numberOfTextures) {
                requestAnimationFrame(animate);
                handleKeys();
                drawScene();
            }
        }, 15);

    }
}
