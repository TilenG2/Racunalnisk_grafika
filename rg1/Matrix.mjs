// Return matrices as 2D arrays in row-major order, e.g.:
// return [
//     [ 1, 2, 3, 4 ],
//     [ 5, 6, 7, 8 ],
//     [ 7, 6, 5, 4 ],
//     [ 3, 2, 1, 0 ],
// ];
import * as Vector from "./Vector.mjs";

export function identity() {
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
}

export function translation(t) {
    let size = t.length;
    let m = [];
    for (let i = 0; i <= size; i++) {
        let row = [];
        for (let j = 0; j <= size; j++) {
            if (i == j) row[j] = 1;
            else if (j == size) row[j] = t[i];
            else row[j] = 0;
        }
        m[i] = row;
    }
    return m;
}

export function scaling(s) {
    let size = s.length;
    let m = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            if (i == j) row[j] = s[i];
            else row[j] = 0;
        }
        m[i] = row;
    }
    return m;
}

export function rotationX(angle) {
    return [
        [1, 0, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle), 0],
        [0, Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 0, 1],
    ];
}

export function rotationY(angle) {
    return [
        [Math.cos(angle), 0, Math.sin(angle), 0],
        [0, 1, 0, 0],
        [-Math.sin(angle), 0, Math.cos(angle), 0],
        [0, 0, 0, 1],
    ];
}

export function rotationZ(angle) {
    return [
        [Math.cos(angle), -Math.sin(angle), 0, 0],
        [Math.sin(angle), Math.cos(angle), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
}

export function negate(m) {
    let a = [];
    for (let i = 0; i < m.length; i++) {
        a[i] = Vector.negate(m[i]);
    }
    return a;
}

export function add(m, n) {
    let a = [];
    for (let i = 0; i < m.length; i++) {
        a[i] = Vector.add(m[i], n[i]);
    }
    return a;
}

export function subtract(m, n) {
    let a = [];
    for (let i = 0; i < m.length; i++) {
        a[i] = Vector.subtract(m[i], n[i]);
    }
    return a;
}

export function transpose(m) {
    let n = [];
    if (m[0].length != null) {
        for (let i = 0; i < m[0].length; i++) {
            n[i] = [];
        }

        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[i].length; j++) {
                n[j][i] = m[i][j];
            }
        }
    } else {
        for (let i = 0; i < m.length; i++) {
            n[i] = [];
        }
        for (let i = 0; i < m.length; i++) {
            n[i][0] = m[i];
        }
    }
    return n;
}

export function multiply(m, n) {
    n = transpose(n);
    let mn = [];
    for (let i = 0; i < m.length; i++) {
        mn[i] = [];
    }
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            mn[i][j] = Vector.dot(m[i], n[j]);
        }
    }
    return mn;
}

export function transform(m, v) {
    let mn = [];
    for (let i = 0; i < m.length; i++) {
        mn[i] = Vector.dot(m[i], v);
    }
    return mn;
}
