var gl = document.getElementById('webgl')
        .getContext('webgl') ||
        document.getElementById('webgl')
        .getContext('experimental-webgl');

function InitWebGL()
{
    if (!gl)
    {
        alert('webGL is not supported');
        return;
    }
    let canvas = document.getElementById('webgl')
    if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight)
    {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    InitVievport();
}

function InitVievport()
{
    gl.viewport(0,                  //left
                0,                  //right
                gl.canvas.width,    //width
                gl.canvas.height);  //height
    
    gl.clearColor(0.0,0.4,0.6,1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    InitShaders();
}

function InitShaders()
{
    const vertex = InitVertexShader();
    const fragment = InitFragmentShader();

    let program = InitShaderProgram(vertex, fragment);

    if(!validateShaderProgram(program))
    {
        return false;
    }

    return CreateGeometryBuffers(program);
}

function InitVertexShader()
{
    let e = document.getElementById('vs');
    let vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, e.value);
    gl.compileShader(vs);

    if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
    {
        let e = gl.getShaderInfoLog(vs);
        console.error('failed init vertex shader: ', e);
        return;
    }
    return vs;
}

function InitShaders()
{
    let vs = InitVertexShader();
    let fs = InitFragmentShader();

    let program = InitShaderProgram(vs, fs);

    if(!validateShaderProgram(program))
    {
        return false;
    }

    return CreateGeometryBuffers(program);
}

function InitFragmentShader()
{
    let e = document.getElementById('fs');
    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, e.value);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
    {
        console.error('failed init fragmentshader: ', e);
    return;
    }
    return fs;
}

function InitShaderProgram(vs, fs)
{
    let p =gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);

    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    {
        console.error(gl.getProgramInfoLog(p));
        alert('failed linking program');
        return;
    }
    return p;
}

function validateShaderProgram(p)
{
    gl.validateProgram(p);

    if (!gl.getProgramParameter(p, gl.VALIDATE_STATUS))
    {
        console.error(gl.getProgramInfoLog(p));
        alert('errors found validating shader program');
        return false;
    }
    return true;
}

function CreateGeometryBuffers(program)
{
    //triangle        x    y   z   r   g   b
    const vertices = [0.0,0.5,0.0,1.0,0.0,0.0,
                      -0.5,-0.5,0.0,0.0,1.0,0.0,
                      0.5,-0.5,0.0,0.0,0.0,1.0,];

    CreateVBO(program, new Float32Array(vertices));

    gl.useProgram(program);

    Render();
}

function CreateVBO(program, vert)
{
    let vbo= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
    const s = 6 * Float32Array.BYTES_PER_ELEMENT;

    let p = gl.getAttribLocation(program, 'Pos');
    gl.vertexAttribPointer(p,3,gl.FLOAT,gl.FALSE,s,0);
    gl.enableVertexAttribArray(p);

    const o = 3 * Float32Array.BYTES_PER_ELEMENT;
    let c = gl.getAttribLocation(program, 'Color');
    gl.vertexAttribPointer(c,3,gl.FLOAT,gl.FALSE,s,o);
    gl.enableVertexAttribArray(c);
}

function Render()
{
    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT |
             gl.DEPTH_BUFFER_BIT );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}