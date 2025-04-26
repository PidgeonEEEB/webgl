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
    InitViewport();
}

function InitViewport()
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
    let p = gl.createProgram();
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
   CreateGeometryUI();
    //create GPU buffer (VBO)
    CreateVBO(program, new Float32Array(vertices));
    angleGL = gl.getUniformLocation(program, 'Angle');
    CreateTexture(program, "img/1812.jpg");
    //activate shader program
    gl.useProgram(program);
    //update view rotation
    gl.uniform4fv(angleGL, new Float32Array(angle));
    //update display option
    gl.uniform4fv(displayGL, new Float32Array(display));
    //display geometry on screen
    Render();
}
    

function CreateVBO(program, vert)
{
    let vbo= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
    const s = 8 * Float32Array.BYTES_PER_ELEMENT;

    let p = gl.getAttribLocation(program, 'Pos');
    gl.vertexAttribPointer(p,3,gl.FLOAT,gl.FALSE,s,0);
    gl.enableVertexAttribArray(p);

    const o = 3 * Float32Array.BYTES_PER_ELEMENT;
    let c = gl.getAttribLocation(program, 'Color');
    gl.vertexAttribPointer(c,3,gl.FLOAT,gl.FALSE,s,o);
    gl.enableVertexAttribArray(c);
    //create shader attribute: uv
    const o2 = o * 2;
    let u = gl.getAttribLocation(program, 'UV');
    gl.vertexAttribPointer(u,2,gl.FLOAT,gl.FALSE,s,o2);
    gl.enableVertexAttribArray(u);
}

function Render()
{
    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT |
             gl.DEPTH_BUFFER_BIT );
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 6);
}

var vertices = [];

var gl = document.getElementById('webgl')
        .getContext('webgl') ||
        document.getElementById('webgl')
        .getContext('experimental-webgl');

function AddVertex(x, y, z, r, g, b, u, v)
{
    const index = vertices.length;
    vertices.length += 8;
    vertices[index + 0] = x;
    vertices[index + 1] = y;
    vertices[index + 2] = z;
    vertices[index + 3] = r;
    vertices[index + 4] = g;
    vertices[index + 5] = b;
    vertices[index + 6] = u;
    vertices[index + 7] = v;

}

function AddTriangle(x1, y1, z1, r1, g1, b1, u1, v1,
                     x2, y2, z2, r2, g2, b2, u2, v2,
                     x3, y3, z3, r3, g3, b3, u3, v3)
{
    AddVertex(x1, y1, z1, r1, g1, b1, u1, v1);
    AddVertex(x2, y2, z2, r2, g2, b2, u2, v2);
    AddVertex(x3, y3, z3, r3, g3, b3, u3, v3);
}
function AddQuad(x1, y1, z1, r1, g1, b1, u1, v1,
                 x2, y2, z2, r2, g2, b2, u2, v2,
                 x3, y3, z3, r3, g3, b3, u3, v3,
                 x4, y4, z4, r4, g4, b4, u4, v4)
{
    AddTriangle(x1, y1, z1, r1, g1, b1, u1, v1,
                x2, y2, z2, r2, g2, b2, u2, v2,
                x3, y3, z3, r3, g3, b3, u3, v3);

    AddTriangle(x3, y3, z3, r3, g3, b3, u3, v3,
                x4, y4, z4, r4, g4, b4, u4, v4,
                x1, y1, z1, r1, g1, b1, u1, v1);
}

function CreateTriangle(width, height)
{
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    AddTriangle(0.0, h, 0.0, 1.0, 0.0, 0.0, 0.5, 1.0,
                -w, -h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
                 w, -h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0 );
}

function CreateQuad(width, height)
{
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    AddQuad(
        -w, h, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
        -w,-h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
         w,-h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
         w, h, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0);
}

function Create3dSquare(width, height, depth)
{
    vertices.length = 0; // <--- Clear old geometry!
    //vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    const d = depth * 0.5;
    //front
    AddQuad(-w,  h, -d, 1.0, 0.0, 0.0, 0.0, 1.0,
            -w, -h, -d, 1.0, 0.0, 0.0, 0.0, 0.0,
             w, -h, -d, 1.0, 0.0, 0.0, 1.0, 0.0,
             w,  h, -d, 1.0, 0.0, 0.0, 1.0, 1.0 );
    //back
    AddQuad(
        -w,  h, d, 0.5, 0.0, 0.5, 0.0, 1.0,
         w,  h, d, 0.5, 0.0, 0.5, 0.0, 0.0,
         w, -h, d, 0.5, 0.0, 0.5, 1.0, 0.0,
         -w, -h, d, 0.5, 0.0,0.5, 1.0, 1.0  );
    //top
    AddQuad(
             w,  h, -d, 0.0, 1.0, 0.0, 0.0, 1.0,
             w,  h,  d, 0.0, 1.0, 0.0, 0.0, 0.0,
            -w,  h,  d, 0.0, 1.0, 0.0, 1.0, 0.0,
            -w,  h, -d, 0.0, 1.0, 0.0, 1.0, 1.0  );
    //bottom
    AddQuad(
            -w, -h,  d, 0.5, 0.5, 0.0, 0.0, 1.0,
             w, -h,  d, 0.5, 0.5, 0.0, 0.0, 0.0,
             w, -h, -d, 0.5, 0.5, 0.0, 1.0, 0.0,
            -w, -h, -d, 0.5, 0.5, 0.0, 1.0, 1.0 );

   //left side
    AddQuad(
        -w,  h, -d, 0.0, 0.0, 1.0, 0.0, 1.0,
        -w,  h,  d, 0.0, 0.0, 1.0, 0.0, 0.0,
        -w, -h,  d, 0.0, 0.0, 1.0, 1.0, 0.0,
        -w, -h, -d, 0.0, 0.0, 1.0, 1.0, 1.0 );
    //right side
    AddQuad(
         w,  h, -d, 0.4, 0.3, 0.3, 0.0, 1.0,
         w, -h, -d, 0.4, 0.3, 0.3, 0.0, 0.0,
         w, -h,  d, 0.4, 0.3, 0.3, 1.0, 0.0,
         w,  h,  d, 0.4, 0.3, 0.3, 1.0, 1.0 );
}

function Create3DSub(width, height, depth, subdivision)
{
    vertices.length = 0;
    //vertices.length = 0;
    const w = width  * 0.5;
    const h = height * 0.5;
    const d = depth  * 0.5;

    const wi = width / subdivision;
    const hi = height / subdivision;
    const di = depth / subdivision;
    
    
    //front
    for (let y = 0; y < subdivision; y++)
    {
        for (let x = 0; x < subdivision; x++)
        {
            const u1 = x/(subdivision);
            const v1 = y/(subdivision);
            const u2 = (x+1.0)/(subdivision);
            const v2 = (y+1.0)/(subdivision);
            
            const c = (x + y) % 2 == 0 ? 1.0 : 0.0; //color switcher
            AddQuad(                                    // u
             -w + wi*(x+1), -h + hi*y,     -d, c, c, c,  u2, v1,
             -w + wi*(x+1), -h + hi*(y+1), -d, c, c, c,  u2, v2,
             -w + wi*x,     -h + hi*(y+1), -d, c, c, c,  u1, v2,
             -w + wi*x,     -h + hi*y,     -d, c, c, c,  u1, v1);
        }
    }

    //back
    for (let y = 0; y < subdivision; y++)
    {
        for (let x = 0; x < subdivision; x++)
        {
            const u1 = x/(subdivision);
            const v1 = y/(subdivision);
            const u2 = (x+1.0)/(subdivision);
            const v2 = (y+1.0)/(subdivision);

            const c = (x + y) % 2 == 0 ? 1.0 : 0.0; //color switcher
            AddQuad(
             -w + wi*(x+1), -h + hi*y,     d, c, c, c, u1, v1, // 1
             -w + wi*x,     -h + hi*y,     d, c, c, c, u2, v1, // 2
             -w + wi*x,     -h + hi*(y+1), d, c, c, c, u2, v2,  // 3
             -w + wi*(x+1), -h + hi*(y+1), d, c, c, c, u1, v2  );  // 4
        }
    }

    //top
    for (let z = 0; z < subdivision; z++)
    {
        for (let x = 0; x < subdivision; x++)
        {
            const u1 = x/(subdivision);
            const v1 = z/(subdivision);
            const u2 = (x+1.0)/(subdivision);
            const v2 = (z+1.0)/(subdivision);

            const c = (x + z) % 2 == 0 ? 1.0 : 0.0; //color switcher
            AddQuad(
             -w + wi*(x+1), h, -d + di*z,     c, c, c, u2, v1, 
             -w + wi*(x+1), h, -d + di*(z+1), c, c, c, u2, v2, 
             -w + wi*x,     h, -d + di*(z+1), c, c, c, u1, v2, 
             -w + wi*x,     h, -d + di*z,     c, c, c, u1, v1   );
        }
    }

    //bottom
    for (let z = 0; z < subdivision; z++)
    {
        for (let x = 0; x < subdivision; x++)
        {
            const u1 = x/(subdivision);
            const v1 = z/(subdivision);
            const u2 = (x+1.0)/(subdivision);
            const v2 = (z+1.0)/(subdivision);

            const c = (x + z) % 2 == 0 ? 1.0 : 0.0; //color switcher
            AddQuad(
             -w + wi*(x+1), -h, -d + di*z,     c, c, c, u2, v1, // 1
             -w + wi*x,     -h, -d + di*z,     c, c, c, u1, v1, // 2
             -w + wi*x,     -h, -d + di*(z+1), c, c, c, u1, v2,  // 3
             -w + wi*(x+1), -h, -d + di*(z+1), c, c, c, u2, v2 );  // 4
        }
    }
    //right
    for (let z = 0; z < subdivision; z++)
    {
        for (let y = 0; y < subdivision; y++)
        {
            const u1 = y/(subdivision);
            const v1 = z/(subdivision);
            const u2 = (y+1.0)/(subdivision);
            const v2 = (z+1.0)/(subdivision);

            const c = (y + z) % 2 == 0 ? 1.0 : 0.0; //color switcher
            AddQuad(
             w, -h + hi*(y+1), -d + di*z,     c, c, c, u1, v2,
             w, -h + hi*y,     -d + di*z,     c, c, c, u1, v1,
             w, -h + hi*y,     -d + di*(z+1), c, c, c, u2, v1, 
             w, -h + hi*(y+1), -d + di*(z+1), c, c, c, u2, v2 ); 
        }
    }

    //left
    for (let z = 0; z < subdivision; z++)
    {
        for (let y = 0; y < subdivision; y++)
        {
            const u1 = y/(subdivision);
            const v1 = z/(subdivision);
            const u2 = (y+1.0)/(subdivision);
            const v2 = (z+1.0)/(subdivision);

            const c = (y + z) % 2 == 0 ? 1.0 : 0.0; //color switcher
            AddQuad(
            -w, -h + hi*(y+1), -d + di*z,     c, c, c, u2, v2, //1
            -w, -h + hi*(y+1), -d + di*(z+1), c, c, c, u1, v2, //2
            -w, -h + hi*y,     -d + di*(z+1), c, c, c, u1, v1, //3
            -w, -h + hi*y,     -d + di*z,     c, c, c, u2, v1 );//4
        }
    }
}

function CreateGeometryUI()
{
    const ew = document.getElementById('w');
    const w = ew ? ew.value : 1.0;
    const eh = document.getElementById('h');
    const h = eh ? eh.value : 1.0;
    const ed = document.getElementById('d');
    const d = ed ? ed.value : 1.0;
    
    const sd = document.getElementById('s');
    const s = sd ? sd.value : 1.0;
    document.getElementById('ui').innerHTML =
    'Width: <input type="number" id="w" value="' + w +'"onchange= "InitShaders();"><br>' + 
    
    'Height: <input type="number" id="h" value="'+ h +'"onchange= "InitShaders();"><br>' +

    'Depth: <input type="number" id="d" value="'+ d +'"onchange= "InitShaders();"><br>' + 

    'subdivision: <input type="number" id="s" value="'+ s +'"onchange= "InitShaders();">';
    let e = document.getElementById('shape');
    switch (e.selectedIndex)
    {
        case 0: CreateTriangle(w,h); break;
        case 1: CreateQuad(w,h); break;
        case 2: Create3DSub(w,h,d, s); break;
        
    }
}

var mouseX = 0, mouseY = 0;
var angle = [ 0.0, 0.0, 0.0, 1.0 ];
var angleGL = 0;
document.getElementById('webgl').addEventListener('mousemove', function(e) {
        if(e.buttons == 1)
        {
            //Left mouse pressed!!!!!
            angle[0] -= (mouseY - e.y) * 0.1;
            angle[1] += (mouseX - e.x) * 0.1;
            gl.uniform4fv(angleGL, new Float32Array(angle));
            Render();
        }
        mouseX = e.x;
        mouseY = e.y;
    });

//Global Variable
var textureGL = 0; //uniform location
var display = [0.0, 0.0, 0.0, 0.0];
var displayGL = 0; //uniform location

function CreateTexture(prog,url)
{
    //load texture to graphic card
    const texture = LoadTexture(url);
    //flip y axis so it fits OpenFL standard
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    //activate texture to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //add uniform location to fragment shader
    textureGL = gl.getUniformLocation(prog, 'Texture');
    //add uniform location to fragment shader
    displayGL = gl.getUniformLocation(prog, 'Display');
}

function LoadTexture(url)
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    const image = new Image();
    image.onload = () => 
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        SetTextureFilters(image);
    };
    image.src = url;
    return texture;
}

function SetTextureFilters(image)
{
    if (IsPow2(image.width) && IsPow2(image.height))
    {
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    }
}

function IsPow2(value)
{
    return (value & (value - 1)) === 0;
}

function Update()
{
    //show texture (boolean) last element
    const t = document.getElementById('t');
    display[3] = t.checked ? 1.0 : 0.0;
    //update array to graphics card and render
    gl.uniform4fv(displayGL, new Float32Array(display));
    Render();
}