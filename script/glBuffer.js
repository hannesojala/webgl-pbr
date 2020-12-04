class glBuffer {
    constructor(/** @type {WebGL2RenderingContext} */ gl, data, usage, type) {
        this.gl = gl;
        this.type = type;
        this.ID = this.gl.createBuffer();
        if(!this.ID) {
            console.error("Buffer error!\n");
        }
        this.gl.bindBuffer(this.type, this.ID);
        this.gl.bufferData(this.type, data, usage);
        this.bytes = data.BYTES_PER_ELEMENT;
        this.size = data.length;
    }
    bind() {
        this.gl.bindBuffer(this.type, this.ID);
    }
    unbind() {
        this.gl.bindBuffer(this.type, null);
    }
}