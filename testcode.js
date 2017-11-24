var canvas = document.getElementById('main_game_canvas');
         gl = canvas.getContext('experimental-webgl');

var vertices = [
            -0.5,0.5,0.0,
            0.0,0.5,0.0,
            -0.25,0.25,0.0, 
         ];
var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

/*=========================Shaders========================*/
      
         // vertex shader source code
         var vertCode =
            'attribute vec3 coordinates;' +
                
            'void main(void) {' +
               ' gl_Position = vec4(coordinates, 1.0);' +
               'gl_PointSize = 10.0;'+
            '}';
         
         // Create a vertex shader object
         var vertShader = gl.createShader(gl.VERTEX_SHADER);

         // Attach vertex shader source code
         gl.shaderSource(vertShader, vertCode);

         // Compile the vertex shader
         gl.compileShader(vertShader);

         // fragment shader source code
         var fragCode =
            'void main(void) {' +
               ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
            '}';
         
         // Create fragment shader object
         var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

         // Attach fragment shader source code
         gl.shaderSource(fragShader, fragCode);
      
         // Compile the fragmentt shader
         gl.compileShader(fragShader);

         // Create a shader program object to store
         // the combined shader program
         var shaderProgram = gl.createProgram();

         // Attach a vertex shader
         gl.attachShader(shaderProgram, vertShader); 
 
         // Attach a fragment shader
         gl.attachShader(shaderProgram, fragShader);

         // Link both programs
         gl.linkProgram(shaderProgram);

         // Use the combined shader program object
         gl.useProgram(shaderProgram);
