// helper functions to get shape data

function cubeVerts(size) {   // BROKEN NORMALS!
    return new Float32Array([
        -size[0],  size[1],  size[2],  1.0,     0.0, 1.0,   0.0, 0.0, 1.0 ,1.0,
        -size[0], -size[1],  size[2],  1.0,     0.0, 0.0,   0.0, 0.0, 1.0 ,1.0,
         size[0],  size[1],  size[2],  1.0,     1.0, 1.0,   0.0, 0.0, 1.0 ,1.0,
         size[0], -size[1],  size[2],  1.0,     1.0, 0.0,   0.0, 0.0, 1.0 ,1.0,
         size[0],  size[1],  size[2],  1.0,     1.0, 1.0,   0.0, 0.0, 1.0 ,1.0,
        -size[0], -size[1],  size[2],  1.0,     0.0, 0.0,   0.0, 0.0, 1.0 ,1.0,

        -size[0],  size[1], -size[2],  1.0,     0.0, 1.0,  -1.0, 0.0, 0.0 ,1.0,
        -size[0], -size[1], -size[2],  1.0,     0.0, 0.0,  -1.0, 0.0, 0.0 ,1.0,
        -size[0],  size[1],  size[2],  1.0,     1.0, 1.0,  -1.0, 0.0, 0.0 ,1.0,
        -size[0], -size[1],  size[2],  1.0,     1.0, 0.0,  -1.0, 0.0, 0.0 ,1.0,
        -size[0],  size[1],  size[2],  1.0,     1.0, 1.0,  -1.0, 0.0, 0.0 ,1.0,
        -size[0], -size[1], -size[2],  1.0,     0.0, 0.0,  -1.0, 0.0, 0.0 ,1.0,
        
         size[0],  size[1], -size[2],  1.0,     0.0, 1.0,  0.0, 0.0, -1.0 ,1.0,
         size[0], -size[1], -size[2],  1.0,     0.0, 0.0,  0.0, 0.0, -1.0 ,1.0,
        -size[0],  size[1], -size[2],  1.0,     1.0, 1.0,  0.0, 0.0, -1.0 ,1.0,
        -size[0], -size[1], -size[2],  1.0,     1.0, 0.0,  0.0, 0.0, -1.0 ,1.0,
        -size[0],  size[1], -size[2],  1.0,     1.0, 1.0,  0.0, 0.0, -1.0 ,1.0,
         size[0], -size[1], -size[2],  1.0,     0.0, 0.0,  0.0, 0.0, -1.0 ,1.0,
        
         size[0], -size[1],  size[2],  1.0,     0.0, 1.0,  1.0, 0.0, 0.0 ,1.0,
         size[0], -size[1], -size[2],  1.0,     1.0, 1.0,  1.0, 0.0, 0.0 ,1.0,
         size[0],  size[1],  size[2],  1.0,     0.0, 0.0,  1.0, 0.0, 0.0 ,1.0,
         size[0],  size[1], -size[2],  1.0,     1.0, 0.0,  1.0, 0.0, 0.0 ,1.0,
         size[0],  size[1],  size[2],  1.0,     0.0, 0.0,  1.0, 0.0, 0.0 ,1.0,
         size[0], -size[1], -size[2],  1.0,     1.0, 1.0,  1.0, 0.0, 0.0 ,1.0,
        
        -size[0], size[1], -size[2],  1.0,     0.0, 1.0,   0.0, 1.0, 0.0, 1.0,
        -size[0], size[1],  size[2],  1.0,     0.0, 0.0,   0.0, 1.0, 0.0, 1.0,
         size[0], size[1], -size[2],  1.0,     1.0, 1.0,   0.0, 1.0, 0.0, 1.0,
         size[0], size[1],  size[2],  1.0,     1.0, 0.0,   0.0, 1.0, 0.0, 1.0,
         size[0], size[1], -size[2],  1.0,     1.0, 1.0,   0.0, 1.0, 0.0, 1.0,
        -size[0], size[1],  size[2],  1.0,     0.0, 0.0,   0.0, 1.0, 0.0, 1.0,
        
         size[0], -size[1],  size[2],  1.0,     0.0, 1.0,   0.0, -1.0, 0.0, 1.0,
        -size[0], -size[1],  size[2],  1.0,     1.0, 1.0,   0.0, -1.0, 0.0, 1.0,
         size[0], -size[1], -size[2],  1.0,     0.0, 0.0,   0.0, -1.0, 0.0, 1.0,
        -size[0], -size[1], -size[2],  1.0,     1.0, 0.0,   0.0, -1.0, 0.0, 1.0,
         size[0], -size[1], -size[2],  1.0,     0.0, 0.0,   0.0, -1.0, 0.0, 1.0,
        -size[0], -size[1],  size[2],  1.0,     1.0, 1.0,   0.0, -1.0, 0.0, 1.0,
    ]);
}

function cubeIndices() {    // indices for a cube with seperate vertices for hard edges
    return new Uint32Array([
            0, 1, 2,
            3, 4, 5, 
            6, 7, 8, 
            9, 10, 11,
            12, 13, 14, 
            15, 16, 17,
            18, 19, 20, 
            21, 22, 23,
            24, 25, 26, 
            27, 28, 29,
            30, 31, 32, 
            33, 34, 35
        ]);
}

function elementCubeVerts(size) {    // verts for cube faces sharing vertices, random texcoords idk NEEDS NORMALS
    return new Float32Array([
        -size[0], -size[1],  size[2],  1.0,     0.0, 0.0,
         size[0], -size[1],  size[2],  1.0,     1.0, 0.0,
        -size[0], -size[1], -size[2],  1.0,     1.0, 1.0,
         size[0], -size[1], -size[2],  1.0,     1.0, 0.0,
        -size[0],  size[1],  size[2],  1.0,     0.0, 1.0,
         size[0],  size[1],  size[2],  1.0,     1.0, 1.0,
        -size[0],  size[1], -size[2],  1.0,     1.0, 0.0,
         size[0],  size[1], -size[2],  1.0,     0.0, 0.0,
    ]);
}

function elementCubeIndices() {
    return new Uint32Array([
        // Top
        4, 5, 6,
        5, 7, 6,
        // Bot
        0, 2, 1,
        1, 2, 3,
        // Left
        4, 2, 0,
        4, 6, 2,
        // Right
        1, 3, 5, 
        3, 7, 5,
        // Front
        0, 1, 4,
        1, 5, 4,
        // Back
        2, 6, 3,
        7, 3, 6
    ]);
}

function gridVerts(scale, resolution) {
    let verts = [];
    for (var x = -resolution/2; x <= resolution/2; x++) {
        for (var z = -resolution/2; z <= resolution/2; z++) {
            verts.push(...[scale * (x/resolution), 0, scale * (z/resolution), 1.0,
                (x*scale)/resolution, (z*scale)/resolution,
                0.0, 1.0, 0.0, 1.0]);
        }
    }
    return new Float32Array(verts);
}

function gridIndicesPoints(resolution) {
    let idxs = [];
    let n = (resolution+1) * (resolution+1);
    for (var i = 0; i < n; i++) {
        idxs.push(i);
    }
    return  new Uint32Array(idxs);
}

function gridIndicesTris(resolution) {
    let idxs = [];
    let n = resolution;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            let indices = [
                ((n+1) * (i)  ) + (j),
                ((n+1) * (i)  ) + (j+1),
                ((n+1) * (i+1)) + (j),

                ((n+1) * (i+1)) + (j),
                ((n+1) * (i)  ) + (j+1),
                ((n+1) * (i+1)) + (j+1),
            ];
            idxs.push(...indices);
        }
    }
    return  new Uint32Array(idxs);
}

