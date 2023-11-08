import { OrbitControls } from "./OrbitControls";
import { Vector3 } from "../math/Vector3";
import { Camera } from "../cameras/Camera";

class DualCameraControls {
    private update: () => void;
    private primaryControls: OrbitControls;

    constructor(cameraPrimary: Camera, canvasPrimary: HTMLCanvasElement, cameraSecondary: Camera, vr_offset: Vector3) {
        this.primaryControls = new OrbitControls(cameraPrimary, canvasPrimary);

        this.update = () => {
            this.primaryControls.update();

            const leftCameraPosition = cameraPrimary.position.add(vr_offset);
            cameraSecondary.position.set(leftCameraPosition);
            cameraSecondary.rotation.set(cameraPrimary.rotation);
        };
    }
}

export { DualCameraControls };
