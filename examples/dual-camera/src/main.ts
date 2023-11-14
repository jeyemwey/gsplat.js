import * as SPLAT from "gsplat";

const canvasPrimary = document.getElementById("canvas-left") as HTMLCanvasElement;
const canvasSecondary = document.getElementById("canvas-right") as HTMLCanvasElement;
const progressDialog = document.getElementById("progress-dialog") as HTMLDialogElement;
const progressIndicator = document.getElementById("progress-indicator") as HTMLProgressElement;
const fpsElement = document.getElementById("fps") as HTMLSpanElement;
const splatsCountElement = document.getElementById("splats") as HTMLSpanElement;

const rendererPrimary = new SPLAT.WebGLRenderer(canvasPrimary);
const rendererSecondary = new SPLAT.WebGLRenderer(canvasSecondary);
const scene = new SPLAT.Scene();
const cameraPrimary = new SPLAT.Camera();
const cameraSecondary = new SPLAT.Camera();

const controls = new SPLAT.DualCameraControls(
    cameraPrimary,
    canvasPrimary,
    cameraSecondary,
    new SPLAT.Vector3(0.1, 0, 0),
);

async function main() {
    await SPLAT.Loader.LoadAsync(
        "./bonsai-7k-raw.splat",
        scene,
        (progress) => (progressIndicator.value = progress * 100),
    );
    progressDialog.close();
    splatsCountElement.textContent = String(new Intl.NumberFormat().format(scene.vertexCount))
        .replaceAll(",", "_");

    const handleResize = () => {
        rendererPrimary.setSize(canvasPrimary.clientWidth, canvasPrimary.clientHeight);
        rendererSecondary.setSize(canvasSecondary.clientWidth, canvasSecondary.clientHeight);
    };

    let tlast = performance.now();

    async function updateFpsCount() {
        const tnow = performance.now();
        fpsElement.textContent = String(Math.floor(1000 / (tnow - tlast)));
        tlast = tnow;
    }

    const frame = () => {
        controls.update();
        rendererPrimary.render(scene, cameraPrimary);
        rendererSecondary.render(scene, cameraSecondary);

        updateFpsCount();

        requestAnimationFrame(frame);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    requestAnimationFrame(frame);
}

main();
