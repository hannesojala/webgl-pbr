class Camera {
    constructor() {
        this.fov = 90 * Math.PI / 180;
        this.near = 1;
        this.far = 8;
        this.fwd =      [0,0,-1];
        this.up =       [0,1,0];
        this.right =    [1,0,0];
        this.pos = [0,0,0];
    }
    lookAtMatrix() {
        var z = norm(this.fwd);
        var x = norm(cross(this.up, z));
        var y = norm(cross(z, x));
        let mat = new DOMMatrix([
            x[0], x[1], x[2], 0.0,
            y[0], y[1], y[2], 0.0,
            z[0], z[1], z[2], 0.0,
            this.pos[0], this.pos[1], this.pos[2], 1.0
        ]);
        return mat;
    }
    viewTranslateX(amount) {
        this.pos = addv(this.pos, scalev(this.right, amount));
    }
    viewTranslateY(amount) {
        this.pos = addv(this.pos, scalev(this.up, amount));
    }
    viewTranslateZ(amount) {
        this.pos = addv(this.pos, scalev(this.fwd, amount));
    }
    viewPitch(angle) {
        this.fwd = norm(addv(scalev(this.fwd, Math.cos(angle)), scalev(this.up, Math.sin(angle))));
        this.up = norm(cross(this.right, this.fwd));      
    }
    viewYaw(angle) {
        this.right = norm(addv(scalev(this.right, Math.cos(angle)), scalev(this.fwd, Math.sin(angle))));
        this.fwd = norm(cross(this.up, this.right));
    }
    viewRoll(angle) {
        this.right = norm(addv(scalev(this.right, Math.cos(angle)), scalev(this.up, Math.sin(angle))));
        this.up = norm(cross(this.right, this.fwd));
    }
    viewMatrix() {
        return this.lookAtMatrix().invertSelf();
    }
    worldPitch(angle) {
        // rotate fwd up and right about the world x axis
        let mat = IDMat().rotate(angle * 180 / Math.PI, 0, 0);
        let pfwd = new DOMPoint(this.fwd[0], this.fwd[1], this.fwd[2]);
        let pright = new DOMPoint(this.right[0], this.right[1], this.right[2]);
        let pup = new DOMPoint(this.up[0], this.up[1], this.up[2]);
        pfwd = pfwd.matrixTransform(mat);
        pright = pright.matrixTransform(mat);
        pup = pup.matrixTransform(mat);
        this.fwd = [pfwd.x, pfwd.y, pfwd.z];
        this.right = [pright.x, pright.y, pright.z];
        this.up = [pup.x, pup.y, pup.z];
    }
    worldYaw(angle) {
        // rotate fwd up and right about the world y axis
        let mat = IDMat().rotate(0, angle * 180 / Math.PI, 0);
        let pfwd = new DOMPoint(this.fwd[0], this.fwd[1], this.fwd[2]);
        let pright = new DOMPoint(this.right[0], this.right[1], this.right[2]);
        let pup = new DOMPoint(this.up[0], this.up[1], this.up[2]);
        pfwd = pfwd.matrixTransform(mat);
        pright = pright.matrixTransform(mat);
        pup = pup.matrixTransform(mat);
        this.fwd = [pfwd.x, pfwd.y, pfwd.z];
        this.right = [pright.x, pright.y, pright.z];
        this.up = [pup.x, pup.y, pup.z];
    }
    worldRoll(angle) {
        // rotate fwd up and right about the world z axis
        let mat = IDMat().rotate(0, 0, angle * 180 / Math.PI);
        let pfwd = new DOMPoint(this.fwd[0], this.fwd[1], this.fwd[2]);
        let pright = new DOMPoint(this.right[0], this.right[1], this.right[2]);
        let pup = new DOMPoint(this.up[0], this.up[1], this.up[2]);
        pfwd = pfwd.matrixTransform(mat);
        pright = pright.matrixTransform(mat);
        pup = pup.matrixTransform(mat);
        this.fwd = [pfwd.x, pfwd.y, pfwd.z];
        this.right = [pright.x, pright.y, pright.z];
        this.up = [pup.x, pup.y, pup.z];
    }
    projectionMatrix(aspect) {
        let f = -this.far / (this.far - this.near);
        let fn = -(this.far * this.near) / (this.far - this.near);
        let s = 1 / (this.fov/2);
        return new DOMMatrix ([
            s/aspect, 0, 0, 0,
            0, s, 0, 0,
            0, 0, f, -1,
            0, 0, fn, 0
        ]);
    }
}