// Return vectors as arrays, e.g.:
// return [ 1, 2, 3, 4 ];

export function negate(v) {
    let s = [];
    for (let i = 0; i < v.length; i++) {
        s[i] = -v[i];
    }
    return s;
}

export function add(v, w) {
    let s = [];
    for (let i = 0; i < v.length; i++) {
        s[i] = v[i] + w[i];
    }
    return s;
}

export function subtract(v, w) {
    let s = [];
    for (let i = 0; i < v.length; i++) {
        s[i] = v[i] - w[i];
    }
    return s;
}

export function multiply(v, w) {
    let s = [];
    for (let i = 0; i < v.length; i++) {
        s[i] = v[i] * w[i];
    }
    return s;
}

export function divide(v, w) {
    let s = [];
    for (let i = 0; i < v.length; i++) {
        s[i] = v[i] / w[i];
    }
    return s;
}

export function dot(v, w) {
    let skalar = 0;
    for (let i = 0; i < v.length; i++) {
        skalar += v[i] * w[i];
    }
    return skalar;
}

export function cross(v, w) {
    let s = [];
    s[0] = v[1] * w[2] - v[2] * w[1];
    s[1] = v[2] * w[0] - v[0] * w[2];
    s[2] = v[0] * w[1] - v[1] * w[0];
    return s;
}

export function length(v) {
    return Math.sqrt(dot(v, v));
}

export function normalize(v) {
    let dol = length(v);
    let s = [];
    for (let i = 0; i < v.length; i++) {
        s[i] = v[i] / dol;
    }
    return s;
}

export function project(v, w) {
    let s = [];
    let a = dot(v, w) / dot(w, w);
    for (let i = 0; i < w.length; i++) {
        s[i] = a * w[i];
    }
    return s;
}

export function reflect(v, w) {
    let v_Proj_w = project(v, w);
    for (let i = 0; i < v_Proj_w.length; i++) {
        v_Proj_w[i] *= 2;
    }
    return subtract(v, v_Proj_w);
}

export function angle(v, w) {
    return Math.acos(dot(v, w) / (length(v) * length(w)));
}
