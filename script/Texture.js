class Texture {
    // Based off mozilla documentation example
    constructor(gl, mipmap, url, target) {
        let texture = gl.createTexture();
        gl.bindTexture(target, texture);

        if (target = gl.TEXTURE_2D) {
            // pixel while waiting for to download
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 1;
            const height = 1;
            const border = 0;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;
            const pixel = new Uint8Array([255, 0, 255, 255]);  // magenta
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        width, height, border, srcFormat, srcType,
                        pixel);
        
            const image = new Image();
            image.onload = function() {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                                srcFormat, srcType, image);
                if (mipmap) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                }
            };
            image.src = url;
        }
        this.ID = texture;
    }
}

class CubeMap {
    // Based off mozilla documentation example
    constructor(gl, face_urls) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        let sides = [
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: face_urls[0] },
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: face_urls[1] },
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: face_urls[2] },
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: face_urls[3] },
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: face_urls[4] },
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: face_urls[5] }
        ];
        for (let i = 0; i < sides.length; i++) {
            let side = sides[i];
            let target = side.target;
            let url    = side.url;

            // pixel while waiting for to download
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 1;
            const height = 1;
            const border = 0;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;
            // load blank
            gl.texImage2D(target, level, internalFormat,
                        width, height, border, srcFormat, srcType,
                        null);
                        
            const image = new Image();
            image.src = url;
            image.onload = function() {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat,
                                srcFormat, srcType, image);
                // TODO: fix texparams
                if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                } else {
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
            };
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        this.ID = texture;
    }
}