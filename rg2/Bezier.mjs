import { add, scalarMultiply, subtract } from "./Vector.mjs";
import { Bernstein } from "./Bernstein.mjs";

export class Bezier {
    constructor(points) {
        this.points = points;
        this.n = points.length - 1;
    }
    addPoint(point) {
        this.points.push(point)
        this.n++;
    }
    popPoint() {
        this.points.pop();
        this.n--;
    }
    value(t) {
        var point = Array(this.points[0].length).fill(0);
        for (let i = 0; i <= this.n; i++) {
            var bern = new Bernstein(this.n, i);
            point = add(point, scalarMultiply(bern.value(t), this.points[i]));
        }
        return point;
    }
    derivative(t) {
        var point = Array(this.points[0].length).fill(0);
        for (let i = 0; i <= this.n - 1; i++) {
            var bern = new Bernstein(this.n - 1, i).value(t);
            var P0 = this.points[i];
            var P1 = this.points[i + 1];
            point = add(point, scalarMultiply(bern, subtract(P1, P0)));
            // console.log(P1, P0, bern, subtract(P1, P0), point);
        }
        // return point;
        return scalarMultiply(this.n, point);
    }
    getPoint(i) {
        return this.points[i];
    }
    setPoint(i, point) {
        this.points[i] = point;
    }
}
