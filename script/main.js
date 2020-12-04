const CAMERA_SENSITIVITY = 512; // Higher is lower
const MOUSE_SENSITIVITY = 128; // Higher is lower
const SPEED = 512; // Higher is lower

/**
 * TODO
 * Transparency/alpha with discard/blend
 *      ALPHA DISCARD:                          DONE
 *      BLEND/TRANSPARENCY:
 * Shadow mapping
 * Energy conservation proof
 * Lighting
 *      RENDER LIGHTS:
 *      POINT:                                  DONE
 *      DIR:                                    DONE
 *      LIGHT AREA:
 *      IBL:
 * framebuffer kernel post process effects
 * instancing
 * HDR Tonemapping
 * 
 * STEPS TO PBR FLEXING
 * 1. Fix normal mapping specularity bug
 * 2. HDR and tonemapping
 * 3. IBL using hdrpng.js
 * 4. A pretty scene
 * 
 */

function main() {

    let canvas = document.getElementById('canvas');
    let renderer = new Renderer(window.innerWidth, window.innerHeight, canvas);
    let camera = new Camera();
    camera.pos = [0, 1, 4];
    camera.viewYaw(Math.PI);
    camera.near = 0.01;
    camera.far = 64;

    let litTexShader    = new Shader(renderer.gl, ["pbrmat.vert", "pbrmat.frag"]);
    //these suck
    let envurls = [
        "textures/env/px.png",
        "textures/env/nx.png",
        "textures/env/py.png",
        "textures/env/ny.png",
        "textures/env/pz.png",
        "textures/env/nz.png"
    ];
    renderer.env = new CubeMap(renderer.gl, envurls);
    let envIrrurls = [
        "textures/env/ipx.png",
        "textures/env/inx.png",
        "textures/env/ipy.png",
        "textures/env/iny.png",
        "textures/env/ipz.png",
        "textures/env/inz.png"
    ];
    renderer.envIrr = new CubeMap(renderer.gl, envIrrurls);

    //renderer.addModel("ciri", litTexShader, [1,0,0], [0,0,0], [0.025, 0.025, 0.025]);
    renderer.addModel("GoldBall", litTexShader, [0,1,-6], [0,0,0], [1,1,1]);
    renderer.addModel("LeatherBall", litTexShader, [-2,1,-6], [0,0,0], [1,1,1]);
    renderer.addModel("MetalBall", litTexShader, [-4,1,-6], [0,0,0], [1,1,1]);
    renderer.addModel("BrickBall", litTexShader, [2,1,-6], [0,0,0], [1,1,1]);
    renderer.addModel("CoffeeCart", litTexShader, [-1,0,0], [0,0,0], [.8,.8,.8]);
    renderer.addModel("Armour", litTexShader, [1,0,0], [0,0,0], [1,1,1]);

    alert("Models and textures will take some time to download. Controls: Move: WASD, Look: QE UDLR, Normal visuals: N. Models and textures credit cc0textures.com, texturehavencom, and soi on cgtrader.com");

    let mx = 0; let my = 0;
    let incanvas = false;
    let looking = false;

    canvas.addEventListener("mousedown", function (event) {
        if (incanvas) looking = true;
        mx = event.offsetX;
        my = event.offsetY;
    });

    canvas.addEventListener("mouseup", function (event) {
        looking = false;
    });

    canvas.addEventListener("mouseenter", function (event) {
        mx = event.offsetX;
        my = event.offsetY;
        incanvas = true;
    });

    canvas.addEventListener("mouseleave", function (event) {
        incanvas = false;
    });

    canvas.addEventListener("mousemove", function (event) {
        if (looking) {
            camera.viewPitch(-(my - event.offsetY)/MOUSE_SENSITIVITY);
            camera.viewYaw((mx - event.offsetX)/MOUSE_SENSITIVITY)
        }
        mx = event.offsetX;
        my = event.offsetY;
    });

    var keys = new Array(8);

    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "w": keys[0] = true;
                break;
            case "a": keys[1] = true;
                break;
            case "s": keys[2] = true;
                break;
            case "d": keys[3] = true;
                break;
            case "ArrowUp"      : keys[4] = true;
                break;
            case "ArrowDown"    : keys[5] = true;
                break;
            case "ArrowLeft"    : keys[6] = true;
                break;
            case "ArrowRight"   : keys[7] = true;
                break;
            case "q"    : keys[8] = true;
                break;
            case "e"   : keys[9] = true;
                break;
            default:
                return;
        }
    }, true);

    window.addEventListener("keyup", function (event) {
        switch (event.key) {
            case "w": keys[0] = false;
                break;
            case "a": keys[1] = false;
                break;
            case "s": keys[2] = false;
                break;
            case "d": keys[3] = false;
                break;
            case "ArrowUp"      : keys[4] = false;
                break;
            case "ArrowDown"    : keys[5] = false;
                break;
            case "ArrowLeft"    : keys[6] = false;
                break;
            case "ArrowRight"   : keys[7] = false;
                break;
            case "q"    : keys[8] = false;
                break;
            case "e"   : keys[9] = false;
                break;
            case "n" : renderer.drawNormals = !renderer.drawNormals;
            default:
                return;
        }
    }, true);

    function update(dt, time) {
        document.title = "Webgl2: " + Math.round(1000 / dt) + "fps";
        if (keys[0]) {
            camera.viewTranslateZ(-dt/SPEED);
        }
        if (keys[1]) {
            camera.viewTranslateX(dt/SPEED);
        }
        if (keys[2]) {
            camera.viewTranslateZ(dt/SPEED);
        }
        if (keys[3]) {
            camera.viewTranslateX(-dt/SPEED);
        }
        if (keys[4]) {
            camera.viewPitch(-dt/CAMERA_SENSITIVITY);
        }
        if (keys[5]) {
            camera.viewPitch(dt/CAMERA_SENSITIVITY);
        }
        if (keys[6]) {
            camera.viewYaw(dt/CAMERA_SENSITIVITY);
        }
        if (keys[7]) {
            camera.viewYaw(-dt/CAMERA_SENSITIVITY);
        }
        if (keys[8]) {
            camera.viewRoll(-dt/CAMERA_SENSITIVITY);
        }
        if (keys[9]) {
            camera.viewRoll(dt/CAMERA_SENSITIVITY);
        }
    }

    let last = 0;
    window.requestAnimationFrame(loop);

    function loop(time) {
        dt = time - last;
        update(dt, time);
        renderer.render(camera, time);
        last = time;
        window.requestAnimationFrame(loop);
    }
}