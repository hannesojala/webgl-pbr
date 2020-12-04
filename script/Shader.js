// Wrapper class for webgl2 shader

class Shader {
    constructor(/** @type {WebGL2RenderingContext} */ gl, sources) {
        this.gl = gl;
        var shaders = [];
        for (var i = 0; i < sources.length; i++) {
            var ext = sources[i].split(".").pop();
            var type = null;
            switch (ext) {
                case "vert" :
                    type = this.gl.VERTEX_SHADER;
                    break;
                case "frag" :
                    type = this.gl.FRAGMENT_SHADER;
                    break;
                default :
                    type = null;
            }
            var shader = this.compile(this.gl, document.getElementById(sources[i]).text, type);
            shaders.push(shader);
        }
        this.ID = this.link(this.gl, shaders);
    }
    
    link(/** @type {WebGL2RenderingContext} */ gl, shaders) {
        var program = gl.createProgram();
        for (var i = 0; i < shaders.length; i++) {
            gl.attachShader(program, shaders[i]);
        }
        gl.linkProgram(program);
        if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
            alert("shader program linking failed");
            console.log(gl.getProgramInfoLog(program));
        }
        return program;
    }
    
    compile(/** @type {WebGL2RenderingContext} */ gl, src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
    
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("Shader compilation failed: " + (type==gl.VERTEX_SHADER ? "vertex" : "fragment" + ":\n"));
            console.log(gl.getShaderInfoLog(shader));
            return -1;
        }
        return shader;
    }

    use() {
        this.gl.useProgram(this.ID);
    }

    setUniformMat4(name, value) {
        var uniform = this.gl.getUniformLocation(this.ID, name);
        if (!uniform) {
            //console.error("Could not obtain location of uniform + \"" + name + "\".\n")
            return;
        }
        this.gl.uniformMatrix4fv(uniform, false, value);
    }

    setUniformInt(name, value) {
        var uniform = this.gl.getUniformLocation(this.ID, name);
        if (!uniform) {
            //console.error("Could not obtain location of uniform + \"" + name + "\".\n")
            return;
        }
        this.gl.uniform1i(uniform, value);
    }

    setUniformFloat(name, value) {
        var uniform = this.gl.getUniformLocation(this.ID, name);
        if (!uniform) {
            //console.error("Could not obtain location of uniform + \"" + name + "\".\n")
            return;
        }
        this.gl.uniform1f(uniform, value);
    }

    setUniformFloatArray(name, value) {
        var uniform = this.gl.getUniformLocation(this.ID, name);
        if (!uniform) {
            //console.error("Could not obtain location of uniform + \"" + name + "\".\n")
            return;
        }
        this.gl.uniform1fv(uniform, new Float32Array(value));
    }

    setUniformVec4(name, value) {
        var uniform = this.gl.getUniformLocation(this.ID, name);
        if (!uniform) {
            //console.error("Could not obtain location of uniform + \"" + name + "\".\n")
            return;
        }
        this.gl.uniform4f(uniform, value[0], value[1], value[2], value[3]);
    }

    setUniformVec3(name, value) {
        var uniform = this.gl.getUniformLocation(this.ID, name);
        if (!uniform) {
            //console.error("Could not obtain location of uniform + \"" + name + "\".\n")
            return;
        }
        this.gl.uniform3f(uniform, value[0], value[1], value[2]);
    }

    setUniformVec3Array(name, value) {
        var uniform = this.gl.getUniformLocation(this.ID, name);
        if (!uniform) {
            //console.error("Could not obtain location of uniform + \"" + name + "\".\n")
            return;
        }
        this.gl.uniform3fv(uniform, new Float32Array(value)); // count param not needed in webgl
    }

    setUniformIntArray(name, value) {
        var uniform = this.gl.getUniformLocation(this.ID, name);
        if (!uniform) {
            //console.error("Could not obtain location of uniform + \"" + name + "\".\n")
            return;
        }
        this.gl.uniform1iv(uniform, value); // count param not needed in webgl
    }
}