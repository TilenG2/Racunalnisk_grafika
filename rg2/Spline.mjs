import { add, scalarMultiply, subtract } from "./Vector.mjs";

export class Spline {
    constructor(curves) { //<Array<Bezier>>
        this.curves = curves;
        this.length = curves.length;
    }
    addBezier(bezier) {
        this.curves.push(bezier);
        this.length = this.curves.length;
    }

    value(t) {
        var curve = Math.floor(t) == t && t != 0 ? t - 1 : Math.floor(t);
        var time = t - curve;
        return this.curves[curve].value(time);
    }

    derivative(t) {
        var curve = Math.floor(t);
        var time = t - curve;
        return this.curves[curve].derivative(time);
    }

    makeContinuous() {
        for (let i = 0; i < this.curves.length - 1; i++) {
            var B0 = this.curves[i];
            var B1 = this.curves[i + 1];
            var P0 = B0.getPoint(B0.n);
            var P1 = B1.getPoint(0);
            var lerp1 = lerp(P0, P1);
            this.curves[i].setPoint(B0.n, lerp1);
            this.curves[i + 1].setPoint(0, lerp1);
        }
    }
    makeSmooth() {
        for (let i = 1; i < this.curves.length; i++) {
            var B0 = this.curves[i - 1];
            var B1 = this.curves[i];
            var P0 = B0.getPoint(B0.n - 1);
            var P1 = B1.getPoint(1);
            var P2 = B1.getPoint(0);
            var vec = subtract(P2, lerp(P0, P1));
            this.curves[i - 1].setPoint(B0.n - 1, add(P0, vec));
            this.curves[i].setPoint(1, add(P1, vec));
        }
    }
}

function lerp(P0, P1) { // Linear Interpolation
    return add(scalarMultiply(0.5, P0), scalarMultiply(0.5, P1));
}