import * as Matrix from "./Matrix.mjs";

export function transform(points) {
    let transformMatrix = Matrix.identity();

    // premik vzdolž osi X za 1.8
    transformMatrix = Matrix.multiply(
        transformMatrix,
        Matrix.translation([1.8, 0, 0])
    );

    // vrtenje okrog osi Y za kot 2*pi/4
    transformMatrix = Matrix.multiply(
        Matrix.rotationY((2 * Math.PI) / 4),
        transformMatrix
    );

    // premik vzdolž osi Z za 3.15
    // premik vzdolž osi Y za 4.45
    transformMatrix = Matrix.multiply(
        Matrix.translation([0, 4.45, 3.15]),
        transformMatrix
    );

    // razteg vzdolž osi X in Y za faktor 5.8
    transformMatrix = Matrix.multiply(
        Matrix.scaling([5.8, 5.8, 1, 1]),
        transformMatrix
    );

    // premik vzdolž osi X za 6.28
    transformMatrix = Matrix.multiply(
        Matrix.translation([6.28, 0, 0]),
        transformMatrix
    );

    // razteg vzdolž osi Z za 7.77
    transformMatrix = Matrix.multiply(
        Matrix.scaling([1, 1, 7.77, 1]),
        transformMatrix
    );

    // vrtenje okrog osi X za kot 8*pi/11
    transformMatrix = Matrix.multiply(
        Matrix.rotationX((8 * Math.PI) / 11),
        transformMatrix
    );

    // vrtenje okrog osi Z za kot 9*pi/11
    transformMatrix = Matrix.multiply(
        Matrix.rotationZ((9 * Math.PI) / 11),
        transformMatrix
    );

    let transformedPoints = [];
    let i = 0;

    points.forEach((point) => {
        point[3] = 1;
        point = Matrix.transform(transformMatrix, point);
        let w = point[3];
        transformedPoints[i++] = [point[0] / w, point[1] / w, point[2] / w];
    });

    return transformedPoints;
}
