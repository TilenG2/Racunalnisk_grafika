import { transform } from "./transform.mjs";
import * as Vector from "./Vector.mjs";
import * as Matrix from "./Matrix.mjs";

const input = document.getElementById("input");
const output = document.getElementById("output");

input.addEventListener("change", (e) => {
    const points = JSON.parse(input.value);
    const transformedPoints = transform(points);
    output.value = JSON.stringify(transformedPoints);
});
