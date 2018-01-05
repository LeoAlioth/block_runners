// Global variable definition
var canvas;
var gl;

// arrays for object buffers
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
var CubeVertexIndices = [
    0, 1, 2, 0, 2, 3,    // Front face
    4, 5, 6, 4, 6, 7,    // Back face
    8, 9, 10, 8, 10, 11,  // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23  // Left face
];

var ObstacleVertices = [
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
var ObstacleVertexNormals = [
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
var ObstacleTextureCoords = [
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
var ObstacleVertexIndices = [
    0, 1, 2, 0, 2, 3,    // Front face
    4, 5, 6, 4, 6, 7,    // Back face
    8, 9, 10, 8, 10, 11,  // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23  // Left face
];


var PowerUpVertices = [
    // Front face
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,

    // Back face
    -0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,

    // Top face
    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,

    // Bottom face
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,

    // Right face
    0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,

    // Left face
    -0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5
];
var PowerUpVertexNormals = [
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
var PowerUpTextureCoords = [
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
var PowerUpVertexIndices = [
    0, 1, 2, 0, 2, 3,    // Front face
    4, 5, 6, 4, 6, 7,    // Back face
    8, 9, 10, 8, 10, 11,  // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23  // Left face
];


var GroundPlaneVertices = [
    // MAIN PLANE
    -6.0, 0.0, -6.0,
    6.0, 0.0, -6.0,
    6.0, 0.0, 6.0,
    -6.0, 0.0, 6.0
];
var GroundPlaneVertexNormals = [
    // plane
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0
];
var GroundPlaneTextureCoords = [
    // plane
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0
];
var GroundPlaneVertexIndices = [
    2, 1, 0, 3, 2, 0    // MAIN PLANE
];


// shading programs
var shaderProgram;

class GameObject {
    constructor() {
        this.Type = 0; //0 - 4:  solid objects, 5-9 power ups, 10 - 14: penalties
        this.VertexPositionBuffer = null;
        this.VertexNormalBuffer = null;
        this.VertexTextureCoordBuffer = null;
        this.VertexIndexBuffer = null;
        this.Texture = null;
        this.Position = [0, 0, 0];
        this.RelativePosition = [0, 0, 0];
        this.Rotation = [0, 0, 0];
        this.Speed = [0, 0, 0];
        this.RotationSpeed = [0, 0, 0];
        this.Size = [0, 0, 0];
    }

    clone() {
        var tmp = new GameObject();
        tmp.VertexPositionBuffer = this.VertexPositionBuffer;
        tmp.VertexNormalBuffer = this.VertexNormalBuffer;
        tmp.VertexTextureCoordBuffer = this.VertexTextureCoordBuffer;
        tmp.VertexIndexBuffer = this.VertexIndexBuffer;
        tmp.Texture = this.Texture;
        tmp.Position = [0, 0, 0]
        tmp.Position[0] = this.Position[0];
        tmp.Position[1] = this.Position[1];
        tmp.Position[2] = this.Position[2];
        tmp.RelativePosition = [0, 0, 0]
        tmp.RelativePosition[0] = this.RelativePosition[0];
        tmp.RelativePosition[1] = this.RelativePosition[1];
        tmp.RelativePosition[2] = this.RelativePosition[2];
        tmp.Rotation = [0, 0, 0]
        tmp.Rotation[0] = this.Rotation[0];
        tmp.Rotation[1] = this.Rotation[1];
        tmp.Rotation[2] = this.Rotation[2];
        tmp.Speed = [0, 0, 0]
        tmp.Speed[0] = this.Speed[0];
        tmp.Speed[1] = this.Speed[1];
        tmp.Speed[2] = this.RelativePosition[2];
        tmp.RotationSpeed = [0, 0, 0]
        tmp.RotationSpeed[0] = this.RotationSpeed[0];
        tmp.RotationSpeed[1] = this.RotationSpeed[1];
        tmp.RotationSpeed[2] = this.RotationSpeed[2];
        tmp.Size = [0, 0, 0]
        tmp.Size[0] = this.Size[0];
        tmp.Size[1] = this.Size[1];
        tmp.Size[2] = this.Size[2];
        tmp.Type = this.Type;

        return tmp;
    }

    hitObjectUnder(gameObject) {

        if (gameObject == null) {
            //console.log("game object null");
            return false;
        }
        if (this.isAbove(gameObject)) {
            //console.log("above object");
            if ((gameObject.Position[1] + (gameObject.Size[1] / 2)) >= (this.Position[1] - (this.Size[1] / 2))) {
                //console.log("on object");
                return true;
            }
        }
        return false;
    }

    getObjectUnder() {
        var highest = -1024;
        var objectUnder = null;
        for (var i = 0; i < LevelPart.length / 2; i++) {
            //console.log(LevelPart[i].Ground.Size);
            if (this.isAbove(LevelPart[i].Ground)) {
                objectUnder = LevelPart[i].Ground;
                //console.log(objectUnder);
                highest = LevelPart[i].Ground.Position[1];
                for (var j = 0; j < LevelPart[i].gameObject.length; j++) {
                    if (this.isAbove(LevelPart[i].gameObject[j]) && LevelPart[i].gameObject[j].Position[1] > highest) {
                        objectUnder = LevelPart[i].gameObject[j];
                        highest = LevelPart[i].gameObject[j].Position[1];
                    }
                }
            }

        }
        return objectUnder;
    }

    isAbove(gameObject) {
        var posXmin = this.Position[0] - this.Size[0] / 2 * 0.95;
        var posYmin = this.Position[1] - this.Size[1] / 2 * 0.5;
        var posZmin = this.Position[2] - this.Size[2] / 2 * 0.95;
        var posXmax = this.Position[0] + this.Size[0] / 2 * 0.95;
        var posZmax = this.Position[2] + this.Size[2] / 2 * 0.95;
        var objXmin = gameObject.Position[0] - gameObject.Size[0] / 2 * 0.95;
        var objZmin = gameObject.Position[2] - gameObject.Size[2] / 2 * 0.95;
        var objXmax = gameObject.Position[0] + gameObject.Size[0] / 2 * 0.95;
        var objZmax = gameObject.Position[2] + gameObject.Size[2] / 2 * 0.95;
        //console.log(gameObject.Size);
        //console.log("X: " + posXmax, posXmin, objXmax, objXmin);
        //console.log("Z: " + posZmax, posZmin, objZmax, objZmin);
        var above = false;
        if (posYmin > gameObject.Position[1]) {
            //console.log("higher");
            if (((objXmin <= posXmax && posXmax <= objXmax) || (objXmin <= posXmin && posXmin <= objXmax)) || ((posXmin <= objXmax && objXmax <= posXmax) || (posXmin <= objXmin && objXmin <= posXmax))) {
                //console.log("x right");
                if (((objZmin <= posZmax && posZmax <= objZmax) || (objZmin <= posZmin && posZmin <= objZmax)) || ((posZmin <= objZmax && objZmax <= posZmax) || (posZmin <= objZmin && objZmin <= posZmax))) {
                    //console.log("y right");
                    above = true;
                }
            }
        }
        return above;
    }

    hitObjectInFront(gameObject) {

        if (gameObject == null) {
            //console.log("game object null");
            return false;
        }
        if (this.isBehind(gameObject)) {
            //console.log("above object");
            if ((gameObject.Position[2] + (gameObject.Size[2] / 2)) >= (this.Position[2] - (this.Size[2] / 2))) {
                //console.log("on object");
                return true;
            }
        }
        return false;
    }

    getObjectInFront() {
        var highest = -1024;
        var objectUnder = null;
        for (var i = 0; i < LevelPart.length / 2; i++) {
            for (var j = 0; j < LevelPart[i].gameObject.length; j++) {
                //console.log(LevelPart[i].gameObject[j]);
                if (this.isBehind(LevelPart[i].gameObject[j]) && LevelPart[i].gameObject[j].Position[2] > highest) {
                    objectUnder = LevelPart[i].gameObject[j];
                    highest = LevelPart[i].gameObject[j].Position[2];
                    //console.log(LevelPart[i].gameObject[j]);
                }
            }
        }
        return objectUnder;
    }

    isBehind(gameObject) {
        var posXmin = this.Position[0] - this.Size[0] / 2 * 0.95;
        var posYmin = this.Position[1] - this.Size[1] / 2 * 0.95;
        var posZmin = this.Position[2] - this.Size[2] / 2 * 0.95;
        var posXmax = this.Position[0] + this.Size[0] / 2 * 0.95;
        var posYmax = this.Position[1] + this.Size[1] / 2 * 0.95;
        var posZmax = this.Position[2] + this.Size[2] / 2 * 0.95;
        var objXmin = gameObject.Position[0] - gameObject.Size[0] / 2 * 0.95;
        var objYmin = gameObject.Position[1] - gameObject.Size[1] / 2 * 0.95;
        var objZmin = gameObject.Position[2] - gameObject.Size[2] / 2 * 0.95;
        var objXmax = gameObject.Position[0] + gameObject.Size[0] / 2 * 0.95;
        var objYmax = gameObject.Position[1] + gameObject.Size[1] / 2 * 0.95;
        var objZmax = gameObject.Position[2] + gameObject.Size[2] / 2 * 0.95;
        //console.log(gameObject.Size);
        //console.log("X: " + posXmax, posXmin, objXmax, objXmin);
        //console.log("Y: " + posYmax, posYmin, objYmax, objYmin);
        //console.log("testing");
        var above = false;
        if (posZmin >= gameObject.Position[2]) {
            //console.log("higher");
            if (((objXmin <= posXmax && posXmax <= objXmax) || (objXmin <= posXmin && posXmin <= objXmax)) || ((posXmin <= objXmax && objXmax <= posXmax) || (posXmin <= objXmin && objXmin <= posXmax))) {
                //console.log("x right");
                if (((objYmin <= posYmax && posYmax <= objYmax) || (objYmin <= posYmin && posYmin <= objYmax)) || ((posYmin <= objYmax && objYmax <= posYmax) || (posYmin <= objYmin && objYmin <= posYmax))) {
                    //console.log("y right");
                    above = true;
                }
            }
        }
        return above;
    }

    hitObjectOnLeft(gameObject) {
        if (gameObject == null) {
            //console.log("game object null");
            return false;
        }
        if (this.isRightFrom(gameObject)) {
            //console.log("above object");
            if ((gameObject.Position[0] + (gameObject.Size[0] / 2)) >= (this.Position[0] - (this.Size[0] / 2))) {
                //console.log("on object");
                return true;
            }
        }
        return false;
    }

    getObjectOnLeft() {
        var highest = -1024;
        var objectUnder = null;
        for (var i = 0; i < LevelPart.length / 2; i++) {
            for (var j = 0; j < LevelPart[i].gameObject.length; j++) {
                //console.log(LevelPart[i].gameObject[j]);
                if (this.isRightFrom(LevelPart[i].gameObject[j]) && LevelPart[i].gameObject[j].Position[0] > highest) {
                    objectUnder = LevelPart[i].gameObject[j];
                    highest = LevelPart[i].gameObject[j].Position[0];
                    //console.log(LevelPart[i].gameObject[j]);
                }
            }
        }
        return objectUnder;
    }

    isRightFrom(gameObject) {
        var posXmin = this.Position[0] - this.Size[0] / 2 * 0.95;
        var posYmin = this.Position[1] - this.Size[1] / 2 * 0.95;
        var posZmin = this.Position[2] - this.Size[2] / 2 * 0.95;
        var posXmax = this.Position[0] + this.Size[0] / 2 * 0.95;
        var posYmax = this.Position[1] + this.Size[1] / 2 * 0.95;
        var posZmax = this.Position[2] + this.Size[2] / 2 * 0.95;
        var objXmin = gameObject.Position[0] - gameObject.Size[0] / 2 * 0.95;
        var objYmin = gameObject.Position[1] - gameObject.Size[1] / 2 * 0.95;
        var objZmin = gameObject.Position[2] - gameObject.Size[2] / 2 * 0.95;
        var objXmax = gameObject.Position[0] + gameObject.Size[0] / 2 * 0.95;
        var objYmax = gameObject.Position[1] + gameObject.Size[1] / 2 * 0.95;
        var objZmax = gameObject.Position[2] + gameObject.Size[2] / 2 * 0.95;
        //console.log(gameObject.Size);
        //console.log("X: " + posXmax, posXmin, objXmax, objXmin);
        //console.log("Y: " + posYmax, posYmin, objYmax, objYmin);
        //console.log("testing");
        var above = false;
        if (posXmin >= gameObject.Position[0]) {
            //console.log("higher");
            if (((objZmin <= posZmax && posZmax <= objZmax) || (objZmin <= posZmin && posZmin <= objZmax)) || ((posZmin <= objZmax && objZmax <= posZmax) || (posZmin <= objZmin && objZmin <= posZmax))) {
                //console.log("x right");
                if (((objYmin <= posYmax && posYmax <= objYmax) || (objYmin <= posYmin && posYmin <= objYmax)) || ((posYmin <= objYmax && objYmax <= posYmax) || (posYmin <= objYmin && objYmin <= posYmax))) {
                    //console.log("y right");
                    above = true;
                }
            }
        }
        return above;
    }

    hitObjectOnRight(gameObject) {
        if (gameObject == null) {
            //console.log("game object null");
            return false;
        }
        if (this.isLeftFrom(gameObject)) {
            //console.log("above object");
            if ((gameObject.Position[0] - (gameObject.Size[0] / 2)) <= (this.Position[0] + (this.Size[0] / 2))) {
                //console.log("on object");
                return true;
            }
        }
        return false;
    }

    getObjectOnRight() {
        var highest = 1024;
        var objectUnder = null;
        for (var i = 0; i < LevelPart.length / 2; i++) {
            for (var j = 0; j < LevelPart[i].gameObject.length; j++) {
                //console.log(LevelPart[i].gameObject[j]);
                if (this.isLeftFrom(LevelPart[i].gameObject[j]) && LevelPart[i].gameObject[j].Position[0] < highest) {
                    objectUnder = LevelPart[i].gameObject[j];
                    highest = LevelPart[i].gameObject[j].Position[0];
                    //console.log(LevelPart[i].gameObject[j]);
                }
            }
        }
        return objectUnder;
    }

    isLeftFrom(gameObject) {
        var posXmin = this.Position[0] - this.Size[0] / 2 * 0.95;
        var posYmin = this.Position[1] - this.Size[1] / 2 * 0.95;
        var posZmin = this.Position[2] - this.Size[2] / 2 * 0.95;
        var posXmax = this.Position[0] + this.Size[0] / 2 * 0.95;
        var posYmax = this.Position[1] + this.Size[1] / 2 * 0.95;
        var posZmax = this.Position[2] + this.Size[2] / 2 * 0.95;
        var objXmin = gameObject.Position[0] - gameObject.Size[0] / 2 * 0.95;
        var objYmin = gameObject.Position[1] - gameObject.Size[1] / 2 * 0.95;
        var objZmin = gameObject.Position[2] - gameObject.Size[2] / 2 * 0.95;
        var objXmax = gameObject.Position[0] + gameObject.Size[0] / 2 * 0.95;
        var objYmax = gameObject.Position[1] + gameObject.Size[1] / 2 * 0.95;
        var objZmax = gameObject.Position[2] + gameObject.Size[2] / 2 * 0.95;
        //console.log(gameObject.Size);
        //console.log("X: " + posXmax, posXmin, objXmax, objXmin);
        //console.log("Y: " + posYmax, posYmin, objYmax, objYmin);
        //console.log("testing");
        var above = false;
        if (posXmin <= gameObject.Position[0]) {
            //console.log("higher");
            if (((objZmin <= posZmax && posZmax <= objZmax) || (objZmin <= posZmin && posZmin <= objZmax)) || ((posZmin <= objZmax && objZmax <= posZmax) || (posZmin <= objZmin && objZmin <= posZmax))) {
                //console.log("x right");
                if (((objYmin <= posYmax && posYmax <= objYmax) || (objYmin <= posYmin && posYmin <= objYmax)) || ((posYmin <= objYmax && objYmax <= posYmax) || (posYmin <= objYmin && objYmin <= posYmax))) {
                    //console.log("y right");
                    above = true;
                }
            }
        }
        return above;
    }
}

class LevelPiece {
    constructor() {
        this.partPosition = [0, 0, 0];
        this.Ground = new GameObject();
        this.gameObject = [];
    }

    moveComponents() {
        this.Ground.Position = [0, 0, 0];
        this.Ground.Position[0] = this.partPosition[0] + this.Ground.RelativePosition[0];
        this.Ground.Position[1] = this.partPosition[1] + this.Ground.RelativePosition[1];
        this.Ground.Position[2] = this.partPosition[2] + this.Ground.RelativePosition[2];
        for (var i = 0; i < this.gameObject.length; i++) {
            this.gameObject[i].Position = [0, 0, 0];
            this.gameObject[i].Position[0] = this.partPosition[0] + this.gameObject[i].RelativePosition[0];
            this.gameObject[i].Position[1] = this.partPosition[1] + this.gameObject[i].RelativePosition[1];
            this.gameObject[i].Position[2] = this.partPosition[2] + this.gameObject[i].RelativePosition[2];
        }
    }

    clone() {
        var tmp = new LevelPiece();
        tmp.partPosition = this.partPosition;
        tmp.Ground = this.Ground.clone();
        for (var i = 0; i < this.gameObject.length; i++) {
            tmp.gameObject.push(this.gameObject[i].clone());
        }
    }
}

//variables for different objects in game;
var Cube;
var PowerUp;
var GroundPlane;
var Obstacle;
var LevelPart;
var StartTime;


// Model-View and Projection matrices
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// Helper variable for animation
var lastTime = 0;


// Variable that stores  loading state of textures.
var numberOfTextures = 4;
var texturesLoaded = 0;

// Keyboard handling helper variable for reading the status of keys
var currentlyPressedKeys = {};
var clickedKeys = {};

// Variables for storing game mechanics data
var inGame = true;
var startingTravelSpeed;
var speedupFactor;
var score;
var jump;
var maxSpeed;
var objectLeft;
var objectRight;
var objectFront;
var objectBottom;
var GameOver;
var hp;
var invincible;

function createAllObjects() {
    Cube = new GameObject();
    Cube.Size = getObjectSize(CubeVertices);
    Cube.Type = 0;
    GroundPlane = new GameObject();
    GroundPlane.Size = getObjectSize(GroundPlaneVertices);
    GroundPlane.Type = 1;
    console.log("GroundPlane size: " + GroundPlane.Size);
    Obstacle = new GameObject();
    Obstacle.Size = getObjectSize(ObstacleVertices);
    Obstacle.Type = 1;
    PowerUp = new GameObject();
    PowerUp.Size = getObjectSize(PowerUpVertices);
    PowerUp.Type = 5;
    LevelPart = new Array(20);

}

function getObjectSize(vertices) {
    var minX = 0;
    var minY = 0;
    var minZ = 0;
    var maxX = 0;
    var maxY = 0;
    var maxZ = 0;
    for (var i = 0; i < vertices.length / 3; i++) {
        var iX = 3 * i;
        var iY = 3 * i + 1;
        var iZ = 3 * i + 2;
        if (vertices[iX] > maxX) {
            maxX = vertices[iX];
        } else if (vertices[iX] < minX) {
            minX = vertices[iX];
        }
        if (vertices[iY] > maxY) {
            maxY = vertices[iY];
        } else if (vertices[iY] < minY) {
            minY = vertices[iY];
        }
        if (vertices[iZ] > maxZ) {
            maxZ = vertices[iZ];
        } else if (vertices[iZ] < minZ) {
            minZ = vertices[iZ];
        }
    }
    return [maxX - minX, maxY - minY, maxZ - minZ];
}

//
// Matrix utility functions
//
// mvPush   ... push current matrix on matrix stack
// mvPop    ... pop top matrix from stack
// degToRad ... convert degrees to radians
//

function generateLevelPart() {
    var LevelPart = new LevelPiece();
    LevelPart.Ground = GroundPlane.clone();
    for (var i = 0; i <= Math.round(score / 1000); i++) {
        //console.log("obstacle")
        LevelPart.gameObject.push(Obstacle.clone());
        var objectI = LevelPart.gameObject.length - 1;
        LevelPart.gameObject[objectI].Position = [0, 0, 0];
        LevelPart.gameObject[objectI].RelativePosition = [0, 0, 0];
        var posX = (Math.random() - 0.5) * GroundPlane.Size[0];
        var posY = Math.round(Math.random() * 0.6) * GroundPlane.Size[0] / 2 + 1;
        var posZ = (Math.random() - 0.5) * GroundPlane.Size[0];
        LevelPart.gameObject[objectI].RelativePosition[0] = posX;
        LevelPart.gameObject[objectI].RelativePosition[1] = posY;
        LevelPart.gameObject[objectI].RelativePosition[2] = posZ;
    }
    if(Math.random() > 0.5){
        LevelPart.gameObject.push(PowerUp.clone());
        var objectI = LevelPart.gameObject.length - 1;
        LevelPart.gameObject[objectI].Position = [0, 0, 0];
        LevelPart.gameObject[objectI].RelativePosition = [0, 0, 0];
        var posX = (Math.random() - 0.5) * GroundPlane.Size[0];
        var posY = Math.round(Math.random() * 0.6) * GroundPlane.Size[0] / 2 + 1;
        var posZ = (Math.random() - 0.5) * GroundPlane.Size[0];
        LevelPart.gameObject[objectI].RelativePosition[0] = posX;
        LevelPart.gameObject[objectI].RelativePosition[1] = posY;
        LevelPart.gameObject[objectI].RelativePosition[2] = posZ;

    }
    return LevelPart;
}

function initializeGame() {
    // Variables for storing current Position of Cube
    Cube.Position = [0.0, 1, -7.0];
    Cube.Rotation = [0.0, 0.0, 0.0];
    Cube.Speed = [0.0, 0.0, 0.0];
    Cube.RotationSpeed = [0.0, 0.0, 0.0];
    startingTravelSpeed = 7;
    speedupFactor = 5;
    score = 0;
    jump = false;
    maxSpeed = 20;
    inGame = true;
    GameOver = false;
    hp = 3;
    invincible = false;
    //Variables for storing world data
    for (var i = 0; i < LevelPart.length; i++) {
        LevelPart[i] = generateLevelPart();
        LevelPart[i].partPosition = [0, 0, -GroundPlane.Size[2] * i];
        if (i < 3) {
            LevelPart[i].gameObject = [];
        }
        LevelPart[i].moveComponents();
    }
    StartTime = new Date().getTime();

}

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
    var vertexShader = getShader(gl, "per-vertex-lighting-vs");


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

    GroundPlane.Texture = gl.createTexture();
    GroundPlane.Texture.image = new Image();
    GroundPlane.Texture.image.onload = function () {
        handleTextureLoaded(GroundPlane.Texture)
    };
    GroundPlane.Texture.image.src = "./assets/wall.png";

    Obstacle.Texture = gl.createTexture();
    Obstacle.Texture.image = new Image();
    Obstacle.Texture.image.onload = function () {
        handleTextureLoaded(Obstacle.Texture)
    };
    Obstacle.Texture.image.src = "./assets/glass.gif";


    PowerUp.Texture = gl.createTexture();
    PowerUp.Texture.image = new Image();
    PowerUp.Texture.image.onload = function () {
        handleTextureLoaded(PowerUp.Texture);
    };
    PowerUp.Texture.image.src = "./assets/companion_cube.png";

    //console.log("initializing GroundPlane");

    Cube.Texture = gl.createTexture();
    Cube.Texture.image = new Image();
    Cube.Texture.image.onload = function () {
        handleTextureLoaded(Cube.Texture);
    };
    Cube.Texture.image.src = "./assets/crate.png";

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

function initGameObjectBuffers(gameObject, vertices, vertexNormals, textureCoords, vertexIndices) {
    gameObject.VertexPositionBuffer = gl.createBuffer();

    // Select the gameObject.VertexPositionBuffer as the one to apply vertex
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.VertexPositionBuffer);


    // Now pass the list of vertices into WebGL to build the shape. We
    // do this by creating a Float32Array from the JavaScript array,
    // then use it to fill the current vertex buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gameObject.VertexPositionBuffer.itemSize = 3;
    gameObject.VertexPositionBuffer.numItems = vertices.length / 3;

    // Map the normals onto the gameObject's faces.
    gameObject.VertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.VertexNormalBuffer);


    // Pass the normals into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    gameObject.VertexNormalBuffer.itemSize = 3;
    gameObject.VertexNormalBuffer.numItems = vertexNormals.length / 3;

    // Now create an array of texture coordinates for the gameObject.
    gameObject.VertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.VertexTextureCoordBuffer);


    // Pass the texture coordinates into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    gameObject.VertexTextureCoordBuffer.itemSize = 2;
    gameObject.VertexTextureCoordBuffer.numItems = 24;

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // Position.
    gameObject.VertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gameObject.VertexIndexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    gameObject.VertexIndexBuffer.itemSize = 1;
    gameObject.VertexIndexBuffer.numItems = vertexIndices.length;
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// two objects -- a simple two-dimensional pyramid and Cube.
//
function initBuffers() {
    initGameObjectBuffers(GroundPlane, GroundPlaneVertices, GroundPlaneVertexNormals, GroundPlaneTextureCoords, GroundPlaneVertexIndices);
    initGameObjectBuffers(Cube, CubeVertices, CubeVertexNormals, CubeTextureCoords, CubeVertexIndices);
    initGameObjectBuffers(Obstacle, ObstacleVertices, ObstacleVertexNormals, ObstacleTextureCoords, ObstacleVertexIndices);
    initGameObjectBuffers(PowerUp, PowerUpVertices, PowerUpVertexNormals, PowerUpTextureCoords, PowerUpVertexIndices);
}

//
// drawScene
//
// Draw the scene.
//
function drawObject(gameObject) {
    // gameObject:

    // Set the drawing Position to the "identity" point, which is
    // the center of the scene.
    mat4.identity(mvMatrix);

    // Now move the drawing Position a bit to where we want to start
    // drawing the gameObject.
    mat4.translate(mvMatrix, gameObject.Position);

    // Save the current matrix, then rotate before we draw.
    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(gameObject.Rotation[0]), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(gameObject.Rotation[1]), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(gameObject.Rotation[2]), [0, 0, 1]);

    // Set the vertex Positions attribute for the gameObject vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.VertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, gameObject.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the normals attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.VertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, gameObject.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the texture coordinates attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.VertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, gameObject.VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Activate textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gameObject.Texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // Draw the gameObject.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gameObject.VertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, gameObject.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    // Restore the original matrix
    mvPopMatrix();
}

function setUpShaderAndLight() {
    gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, true);
    gl.uniform1i(shaderProgram.useLightingUniform, true);
    gl.uniform1i(shaderProgram.useTexturesUniform, true);
    gl.uniform1i(shaderProgram.useTexturesUniform, true);
    gl.uniform1f(shaderProgram.materialShininessUniform, 1000);

    // Set the drawing Position to the "identity" point, which is
    // the center of the scene.
    mat4.identity(mvMatrix);

    // set uniforms for lights as defined in the document

    gl.uniform3f(
        shaderProgram.ambientColorUniform,
        parseFloat(document.getElementById("ambientR").value),
        parseFloat(document.getElementById("ambientG").value),
        parseFloat(document.getElementById("ambientB").value)
    );

    gl.uniform3f(
        shaderProgram.pointLightingLocationUniform,
        Cube.Position[0],
        Cube.Position[1] + 1.5,
        Cube.Position[2] - 1.5
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

function drawScene() {
    // set the rendering environment to full canvas size
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Establish the perspective with which we want to view the
    // scene. Our field of view is 45 degrees, with a width/height
    // ratio and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 200.0, pMatrix);
    setCameraPosition(pMatrix, Cube.Position[0] / 2, Cube.Position[1] / 2 + 5, Cube.Position[2] + 10, 10, 0);

    setUpShaderAndLight();

    drawObject(Cube);
    for (var i = 0; i < LevelPart.length; i++) {
        drawObject(LevelPart[i].Ground);
        for (var j = 0; j < LevelPart[i].gameObject.length; j++) {
            drawObject(LevelPart[i].gameObject[j]);
        }
    }
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
    for (var i = 0; i < LevelPart.length; i++) {
        LevelPart[i].partPosition[2] += elapsed * (startingTravelSpeed + speedupFactor * score / 1000) / 1000;
        LevelPart[i].moveComponents();
    }
    if (LevelPart[0].partPosition[2] > GroundPlane.Size[2]) {
        LevelPart.shift();
        LevelPart.push(generateLevelPart());
        LevelPart[LevelPart.length - 1].partPosition[2] = LevelPart[LevelPart.length - 2].partPosition[2] - GroundPlane.Size[2];
        LevelPart[LevelPart.length - 1].moveComponents();
    }
}

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
        var elapsed = timeNow - lastTime;

        objectFront = Cube.getObjectInFront();
        objectBottom = Cube.getObjectUnder();
        objectLeft = Cube.getObjectOnLeft();
        objectRight = Cube.getObjectOnRight();

        if (Cube.hitObjectInFront(objectFront)) {
            if(objectFront.Type === 1) {
                if(!(hp > 0) && ! invincible) {
                    console.log("hit object in front");
                    inGame = false;
                    GameOver = true;
                } else {
                    hp--;
                }
            }
            else {
                handleGameItems(objectFront);
            }

        }

        if (jump && Cube.hitObjectUnder(objectBottom)) {
            if(objectBottom.Type === 1) {
                Cube.Speed[1] = 20;
                jump = false;
                //console.log("starting jump");
            } else {
                handleGameItems(objectBottom);
            }
        }

        if (Cube.hitObjectOnLeft(objectLeft)) {
            if(objectLeft.Type === 1) {
                Cube.Speed[0] = 0;
                Cube.Position[0] = objectLeft.Position[0] + objectLeft.Size[0] / 2 + Cube.Size[0] / 2 + 0.001;
            }
            else {
                handleGameItems(objectLeft);
            }
        }

        if (Cube.hitObjectOnRight(objectRight)) {
            if(objectRight.Type === 1) {
                Cube.Speed[0] = 0;
                Cube.Position[0] = objectRight.Position[0] - objectRight.Size[0] / 2 - Cube.Size[0] / 2 - 0.001;
            }
            else {
                handleGameItems(objectRight);
            }
        }


        if (!Cube.hitObjectUnder(objectBottom)) {
            Cube.Speed[1] -= 60 * elapsed / 1000;
            Cube.RotationSpeed[0] = -540;
            //console.log("gravity");
        }

        moveObjects(elapsed);

        if (Cube.hitObjectUnder(objectBottom)) {
            if(objectBottom.Type === 1) {
                //console.log("placed on ground");
                Cube.Position[1] = objectBottom.Position[1] + objectBottom.Size[1] / 2 + Cube.Size[1] / 2;
                Cube.Speed[1] = 0;
                Cube.RotationSpeed[0] = 0;
                Cube.Rotation[0] = Math.round((Cube.Rotation[0] / 90)) * 90;
                jump = false;
            }
        }


    }
    lastTime = timeNow;
}

function handleGameItems(gameItem){
    console.log(gameItem.Type);
    gameItem.RelativePosition[1] = -10;
}

//
// Keyboard handling helper functions
//
// handleKeyDown    ... called on keyDown event
// handleKeyUp      ... called on keyUp event
//

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyPress(event) {
    // storing the pressed state for individual key
    clickedKeys[event.keyCode] = true;
    //console.log("key pressed");

}

function handleKeyUp(event) {
    // reseting the pressed state for individual key
    currentlyPressedKeys[event.keyCode] = false;

}

function handleKeys() {

    if (currentlyPressedKeys[37]) {
        // Left cursor key
        if (Cube.Speed[0] > -maxSpeed) {
            Cube.Speed[0] -= 1.5;
        }
    } else if (currentlyPressedKeys[39]) {
        // Right cursor key
        if (Cube.Speed[0] < maxSpeed) {
            Cube.Speed[0] += 1.5;
        }
    } else {
        if (Cube.Speed[0] > 1) {
            Cube.Speed[0] -= 1.9;
        } else if (Cube.Speed[0] < -1) {
            Cube.Speed[0] += 1.9
        } else {
            Cube.Speed[0] = 0;
        }
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        //console.log("up pressed");
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
        createAllObjects();

        initBuffers();

        initTextures();

        // Bind keyboard handling functions to document handlers
        document.onkeypress = handleKeyPress;
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        initializeGame();
        // Set up to draw the scene periodically every 15ms.
        setInterval(function () {
            if (texturesLoaded === numberOfTextures && inGame) {
                requestAnimationFrame(animate);
                handleKeys();
                drawScene();
                var currTime = new Date().getTime();
                score = Math.round((currTime - StartTime) * startingTravelSpeed / 100) / 10;
                document.getElementById("score").innerHTML = "Score: " + score.toString();// +  "<br/>" +"Speed: " + (startingTravelSpeed + speedupFactor * score / 1000 ) + "<br/>" + "CubePosition: " + Cube.Position + "<br/>" + "TilePosition: " + LevelPart[1].partPosition ;
            }
        }, 15);

    }
}
