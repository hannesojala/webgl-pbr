class VAO {
    constructor(/** @type {WebGL2RenderingContext} */ gl, names, sizes, shader) {
        if (names.length != sizes.length) {
            console.error("Error: Must name each attribute and provide a size (names.length!=sizes.length)\n");
        }
        this.gl = gl;
        this.ID = this.gl.createVertexArray();
        if(!this.ID) {
            console.error("VAO error!\n");
        }
        this.bind();
        this.stride = 0;
        this.offset = 0;

        /* TODO */ this.bytes = 4; // set to size of vertex data type

        // Calculate stride
        for (var i = 0; i < sizes.length; i++) {
            this.stride += sizes[i];
        }
        // Specify attribute properties
        for (var i = 0; i < names.length; i++) {
            var attribute = this.gl.getAttribLocation(shader.ID, names[i]);
            this.gl.vertexAttribPointer(attribute, sizes[i], this.gl.FLOAT, false, this.stride * this.bytes, this.offset * this.bytes);
            this.offset += sizes[i];
            this.gl.enableVertexAttribArray(attribute);
        }
    }
    bind() {
        this.gl.bindVertexArray(this.ID);
    }
    unbind() {
        this.gl.bindVertexArray(null);
    }
}