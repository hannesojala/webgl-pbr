class Light {
    constructor(position, color, shader) {
        this.pos = position;
        this.color = color;
        this.shader = shader;

    }
}

class Renderer {
    constructor(width, height, canvas) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl = canvas.getContext("webgl2");
        if (!this.gl) { console.error("Renderer could not get webgl2 context from canvas!\n"); }
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND); 
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.render_queue = [];
        this.clear_color = [0.0,0.0,0.0,1.0];
        this.env = null;
        this.envIrr = null;
        this.lightShader = new Shader(this.gl, ["light.vert", "light.frag"]);
        this.drawNormals = false;
    }
    clear() {
        this.gl.clearColor(this.clear_color[0],this.clear_color[1],this.clear_color[2],this.clear_color[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    render(camera, time) {
        this.clear();
        let projection_matrix = camera.projectionMatrix(this.canvas.width/this.canvas.height);
        let gamma = 2.2;

        let lightsPos = [
            0 + -6 * Math.sin(time/4096), 4, 0 + -6 * Math.cos(time/4096),
            4 + 3 * Math.sin(time/1024), 6, -5 + 3 * Math.cos(time/1024),
            -4 + 4 * Math.sin(time/1024), 5, 3 + 4 * Math.cos(time/1024),
            6 + 8 * Math.sin(time/2048), 7, 7 + 8 * Math.cos(time/2048)
        ];
        let lightsCol = [
            600, 220, 30,
            40, 210, 800,
            10, 4, 60,
            30, 10, 1
        ];

        for (var i = 0; i < this.render_queue.length; i++) {
            let ob = this.render_queue[i];
            //ob.orientation[1] = Math.sin(time/1024);
            let mvp_matrix = projection_matrix
                .multiply(camera.viewMatrix())
                .multiply(ob.modelMatrix());

            ob.shader.use();

            // Had to comment out shader error prints when ob.shader doesnt use uniforms.
            // TODO: Don't do this.
            ob.shader.setUniformMat4("u_mvp_matrix", mvp_matrix.toFloat32Array());
            ob.shader.setUniformMat4("u_view_matrix", camera.viewMatrix().toFloat32Array());
            ob.shader.setUniformMat4("u_model_matrix", ob.modelMatrix().toFloat32Array());
            
            ob.shader.setUniformVec3("u_viewPos", camera.pos);

            ob.shader.setUniformVec3Array("u_lightPositions", lightsPos);
            ob.shader.setUniformVec3Array("u_lightColors", lightsCol);
            ob.shader.setUniformFloat("u_lightSize", 0.0);
            ob.shader.setUniformInt("u_lightCount", lightsPos.length);

            ob.shader.setUniformVec3("u_base_reflectivity", [0.07,0.07,0.07]);

            ob.shader.setUniformFloat("u_gamma", gamma);
            ob.shader.setUniformInt("u_drawNormals", this.drawNormals);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, ob.material.albedoMap.ID);
            ob.shader.setUniformInt("u_albedoMap", 0);

            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, ob.material.metalMap.ID);
            ob.shader.setUniformInt("u_metalMap", 1);

            this.gl.activeTexture(this.gl.TEXTURE2);
            this.gl.bindTexture(this.gl.TEXTURE_2D, ob.material.roughMap.ID);
            ob.shader.setUniformInt("u_roughMap", 2);

            this.gl.activeTexture(this.gl.TEXTURE3);
            this.gl.bindTexture(this.gl.TEXTURE_2D, ob.material.normalMap.ID);
            ob.shader.setUniformInt("u_normalMap", 3);

            // not used
            this.gl.activeTexture(this.gl.TEXTURE4);
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.env.ID);
            ob.shader.setUniformInt("u_envMap", 4);
            
            this.gl.activeTexture(this.gl.TEXTURE5);
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.envIrr.ID);
            ob.shader.setUniformInt("u_envIrrMap", 5);

            ob.vao.bind();
            ob.ebo.bind();
            this.gl.drawElements(ob.draw_mode, ob.ebo.size, this.gl.UNSIGNED_INT, 0);
        }

        //lights last for transparency, TODO: SOrt by distance
        this.lightShader.use();
        let vpmat = projection_matrix.multiply(camera.viewMatrix());
        for (let i = 0; i < lightsPos.length; i += 3) {
            this.lightShader.setUniformMat4("u_mvp_matrix", vpmat.toFloat32Array());
            this.lightShader.setUniformVec3("u_position", lightsPos.slice(i, i+3));
            this.lightShader.setUniformVec3("u_color", lightsCol.slice(i, i+3));
            this.lightShader.setUniformVec3("u_viewPos", camera.pos);
            this.lightShader.setUniformFloat("u_lightSize", 0.0);
            this.lightShader.setUniformFloat("u_gamma", gamma);
            this.gl.drawArrays(this.gl.POINTS, 0, 1);
        }


    }
    // Probably shouldnt be in the render class. Oh well, it made async easier for my dumbass.
    addModel(modelname, shader, location, orientation, scale) {
        let renderer = this;
        let fobj = "models/" + modelname + ".obj";
        let fmtl = "models/" + modelname + ".mtl";

        // get obj
        console.log("Starting download of " + fobj);
        let request_obj = new XMLHttpRequest();
        request_obj.onreadystatechange = function() {
            if (request_obj.readyState === 4 && request_obj.status !== 404) {
                console.log("Finished download of " + fobj);

                // get mtl
                console.log("Starting download of " + fmtl);
                let request_mtl = new XMLHttpRequest();
                request_mtl.onreadystatechange = function() {
                    if (request_mtl.readyState === 4 && request_mtl.status !== 404) {
                        console.log("Finished download of " + fmtl);

                        let materials = materialsFromMTL(renderer.gl, request_mtl.responseText); // maps material names to Material class objects, which hold a texture
                        console.log(materials);

                        // Process model and material
                        let model = ModelFromOBJ(request_obj.responseText);
                        for (let i = 0; i < Math.min(model.length, 160); i++) {
                            let material = materials.find(mat => mat.name == model[i].name);
                            if (!material) {
                                material = new Material("none");
                            }
                            renderer.render_queue
                                .push(model[i].toMesh(renderer.gl, shader, location, orientation, scale, renderer.gl.TRIANGLES, material));
                        }

                    }
                }
                request_mtl.open('GET', fmtl, true); // Create a request to get file
                request_mtl.send();
            }
        }
        request_obj.open('GET', fobj, true); // Create a request to get file
        request_obj.send();
    }
}