// By the book obj goes here

class OBJmesh {
    name = "";
    faces = [];
    constructor(name) {
        this.name = name;
    }
    // read texture from material file read supplied
    toMesh(gl, shader, translation, orientation, scale, draw_mode, material) {
        let model_verts = new Float32Array(this.faces);
        let model_idx = [];
        for (let i = 0; i < model_verts.length/10; i++) {
            model_idx.push(i);
        }
        return new Mesh(gl, shader, model_verts, new Uint32Array(model_idx), translation, orientation, scale, draw_mode, material);
    }
}

function materialsFromMTL(gl, file_contents) {
    let lines = file_contents.split("\n");
    let materials = [];
    for (let lineNr = 0; lineNr < lines.length; lineNr++) {
        let tokens = lines[lineNr].trim().split(/\s+/);
        switch(tokens[0]) {
            case "#" : break;
            case "newmtl" : materials.push(new Material(tokens[1])); break;
            case "map_Kd" : materials[materials.length-1].albedoMap = new Texture(gl, true, tokens[1], gl.TEXTURE_2D); break;
            case "map_Pr" : materials[materials.length-1].roughMap  = new Texture(gl, false, tokens[1], gl.TEXTURE_2D); break;
            case "map_Pm" : materials[materials.length-1].metalMap  = new Texture(gl, false, tokens[1], gl.TEXTURE_2D); break;
            case "norm"   : materials[materials.length-1].normalMap = new Texture(gl, true, tokens[1], gl.TEXTURE_2D); break;
            default: break;
        }
    }
    return materials;
}

function calcTangent(p1, p2, p3, uv1, uv2, uv3) {
    // returns the tangent vector to the normal of the plane aligned with the UV map
    let edge1 = subv(p2, p1);
    let edge2 = subv(p3, p1);
    let deltaUV1 = subv(uv2, uv1);
    let deltaUV2 = subv(uv3, uv1);  
    let f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);
    let tx = f *  (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
    let ty = f *  (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
    let tz = f *  (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);
    return [tx, ty, tz];
}

function ModelFromOBJ(file_contents) {

    // Dont split by .obj object! Split by material for textures in mtl file, plus obv the material (not yet tho)

    let lines = file_contents.split("\n");
    //let objects = [];
    let material_meshes = [];

    // Vertex Data
    let positions = [];
    let normals = [];
    let texcoords = [];

    for (let lineNr = 0; lineNr < lines.length; lineNr++) {
        let tokens = lines[lineNr].trim().split(/\s+/);
        switch(tokens[0]) {
            case "#" : // Comment
                break;
            case "v" : positions.push([Number(tokens[1]), Number(tokens[2]), Number(tokens[3])]);
                break;
            case "vn" : normals.push([Number(tokens[1]), Number(tokens[2]), Number(tokens[3])]);
                break;
            case "vt" : texcoords.push([Number(tokens[1]), 1.0 - Number(tokens[2])]); // flip v
                break;
            case "f" : // Handle face
                let face = [];
                let pnts = [];
                let texs = [];
                let nmls = [];

                let isgood = true;
                for (let idx = 1; idx < tokens.length; idx++) {
                    let vert_indices = tokens[idx].split("/");
                    if (vert_indices[0]) {
                        let pos = positions[vert_indices[0] - 1]
                        pnts.push(pos);
                    }
                    else {
                        isgood = false;
                    }
                    if (vert_indices[1]) {
                        let uv = texcoords[vert_indices[1] - 1];
                        texs.push(uv);
                    }
                    else {
                        isgood = false;
                    }
                    if (vert_indices[2]) {
                        let nrml = normals[vert_indices[2] - 1];
                        nmls.push(nrml);
                    }
                    else {
                        isgood = false;
                    }
                }
                if (isgood) {
                    for (let v = 0; v < 3; v++) {
                        face.push(...pnts[v]);
                        face.push(1.0); // pos w
                        face.push(...texs[v]);
                        face.push(...nmls[v]);
                        face.push(1.0); // nml w
                        face.push(...calcTangent(pnts[0], pnts[1], pnts[2], texs[0], texs[1], texs[2]));
                    }
                    material_meshes[material_meshes.length-1].faces.push(...face);
                }
                break;
            case "o" : // dont use rn
                break;
            case "usemtl" : material_meshes.push(new OBJmesh(tokens[1]));
                break;
            default : break;
        }
    }
    return material_meshes;
}