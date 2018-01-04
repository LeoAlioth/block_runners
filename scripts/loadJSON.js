function loadJSON(file, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", file);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            callback(request.responseText);
        }
    };
    request.send();
}
function load(file,tempGameObject){
    loadJSON(file, function(response){
        var actual_JSON = JSON.parse(response);
        var tempVertices = actual_JSON.meshes[0].vertices;
        var tempVertexNormals = actual_JSON.meshes[0].normals;
        var tempTextureCoords = actual_JSON.meshes[0].texturecoords;
        var tempVertexIndices = actual_JSON.meshes[0].faces;
        initGameObjectBuffers(tempGameObject, tempVertices, tempVertexNormals, tempTextureCoords, tempVertexIndices);
    });
}