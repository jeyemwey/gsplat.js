import { Matrix3 } from "./Matrix3";
import { Vector3 } from "./Vector3";

class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        this.normalize();
    }

    set(x: Quaternion): Quaternion;
    set(x: number, y: number, z: number, w: number): Quaternion;
    set(x: Quaternion | number, y: number, z: number, w: number): Quaternion {
        if (typeof x === "number") {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        } else {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        }
        this.normalize();

        return this;
    }

    normalize(): Quaternion {
        const l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        this.x /= l;
        this.y /= l;
        this.z /= l;
        this.w /= l;

        return this;
    }

    multiply(q: Quaternion): Quaternion {
        const w1 = this.w,
            x1 = this.x,
            y1 = this.y,
            z1 = this.z;
        const w2 = q.w,
            x2 = q.x,
            y2 = q.y,
            z2 = q.z;

        return new Quaternion(
            w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
            w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
            w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
            w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
        );
    }

    flat(): number[] {
        return [this.x, this.y, this.z, this.w];
    }

    clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    static FromEuler(e: Vector3): Quaternion {
        const halfX = e.x / 2;
        const halfY = e.y / 2;
        const halfZ = e.z / 2;
        const cy = Math.cos(halfY);
        const sy = Math.sin(halfY);
        const cp = Math.cos(halfX);
        const sp = Math.sin(halfX);
        const cz = Math.cos(halfZ);
        const sz = Math.sin(halfZ);

        const q = new Quaternion(
            cy * sp * cz + sy * cp * sz,
            sy * cp * cz - cy * sp * sz,
            cy * cp * sz - sy * sp * cz,
            cy * cp * cz + sy * sp * sz,
        );
        return q;
    }

    toEuler(): Vector3 {
        const e = new Vector3();

        const sinr_cosp = 2 * (this.w * this.x + this.y * this.z);
        const cosr_cosp = 1 - 2 * (this.x * this.x + this.y * this.y);
        e.x = Math.atan2(sinr_cosp, cosr_cosp);

        const sinp = 2 * (this.w * this.y - this.z * this.x);
        if (Math.abs(sinp) >= 1) {
            e.y = (Math.sign(sinp) * Math.PI) / 2;
        } else {
            e.y = Math.asin(sinp);
        }

        const siny_cosp = 2 * (this.w * this.z + this.x * this.y);
        const cosy_cosp = 1 - 2 * (this.y * this.y + this.z * this.z);
        e.z = Math.atan2(siny_cosp, cosy_cosp);

        return e;
    }

    static FromMatrix3(matrix: Matrix3): Quaternion {
        const m = matrix.buffer;
        const q = new Quaternion();
        const trace = m[0] + m[4] + m[8];
        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);
            q.w = 0.25 / s;
            q.x = (m[7] - m[5]) * s;
            q.y = (m[2] - m[6]) * s;
            q.z = (m[3] - m[1]) * s;
        } else if (m[0] > m[4] && m[0] > m[8]) {
            const s = 2.0 * Math.sqrt(1.0 + m[0] - m[4] - m[8]);
            q.w = (m[7] - m[5]) / s;
            q.x = 0.25 * s;
            q.y = (m[1] + m[3]) / s;
            q.z = (m[2] + m[6]) / s;
        } else if (m[4] > m[8]) {
            const s = 2.0 * Math.sqrt(1.0 + m[4] - m[0] - m[8]);
            q.w = (m[2] - m[6]) / s;
            q.x = (m[1] + m[3]) / s;
            q.y = 0.25 * s;
            q.z = (m[5] + m[7]) / s;
        } else {
            const s = 2.0 * Math.sqrt(1.0 + m[8] - m[0] - m[4]);
            q.w = (m[3] - m[1]) / s;
            q.x = (m[2] + m[6]) / s;
            q.y = (m[5] + m[7]) / s;
            q.z = 0.25 * s;
        }
        return q;
    }
}

export { Quaternion };
