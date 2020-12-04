
class Mesh {
    translation = [0,0,0];
    orientation = [0,0,0];
    scale = [1,1,1];
    constructor(gl, shader, vertices, indices, translation, orientation, scale, draw_mode, material) {
        // Order of object creation matters for binding the buffers to the VAO
        this.vbo = new glBuffer(gl, vertices, gl.DYNAMIC_DRAW, gl.ARRAY_BUFFER);        // TODO: Buffer mode logic?
        this.ebo = new glBuffer(gl, indices, gl.DYNAMIC_DRAW, gl.ELEMENT_ARRAY_BUFFER);
        this.vao = new VAO(gl, ['a_position', 'a_tex_coord', 'a_normal', 'a_tangent'], [4, 2, 4, 3], shader);
        this.shader = shader;
        this.translation = translation;
        this.orientation = orientation;
        this.scale = scale;
        this.draw_mode = draw_mode;
        this.material = material;
    }
    modelMatrix() { // TODO : Kind of bad way to do this. also move to model class
        return IDMat()
            .translateSelf(this.translation[0], this.translation[1], this.translation[2])
            .rotateSelf(this.orientation[0] * 180 / Math.PI, this.orientation[1] * 180 / Math.PI, this.orientation[2] * 180 / Math.PI)
            .scale(this.scale[0],this.scale[1],this.scale[2])
    }
}