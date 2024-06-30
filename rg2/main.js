import { Bezier } from "./Bezier.mjs";
import { Spline } from "./Spline.mjs";
import { length, scalarMultiply, subtract } from "./Vector.mjs";

const markerSizeSquere = 6;
const markerSizeCircle = 5;
const markerColor = "#FF7700";


const canvas = document.getElementById("myCanvas");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let precision = 1
let isPainting = false;
var lineColor = "#000000";
let startPoint;
let endPoint;
let splineIndex = 0;

let lines = [];

function Spline_Array() {
    this.lines = []
    this.bezier_curves = [];
    this.spline = new Spline([]);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Curve(bezier, color) {
    this.bezier = bezier;
    this.color = color;
}

let bezier = new Bezier([]);
let bezier_curves = [];
let spline = new Spline([]);
let splines = [new Spline_Array()]

toolbar.addEventListener("click", e => {
    if (e.target.id === "clear") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        splines[splineIndex].bezier_curves = [];
        splines[splineIndex].lines = [];
        bezier = new Bezier([]);
        splines[splineIndex].spline = new Spline([]);
    }
    if (e.target.id === "remove") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        splineIndex = splineIndex - 1 < 0 ? 0 : splineIndex - 1;

        splines[splineIndex].bezier_curves.forEach(b => {
            drawBezier(b);
        });
        drawLines();
        document.getElementById("splineNo").innerHTML = "Spline no: " + (splineIndex + 1);
    }

    if (e.target.id === "add") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        splineIndex++;
        if (splines[splineIndex] == undefined) {
            splines[splineIndex] = new Spline_Array();
        }
        splines[splineIndex].bezier_curves.forEach(b => {
            drawBezier(b);
        });
        drawLines();
        document.getElementById("splineNo").innerHTML = "Spline no: " + (splineIndex + 1);

    }
});
toolbar.addEventListener("click", e => {
    if (e.target.id === "continuous") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var array = [];
        splines[splineIndex].bezier_curves.forEach(bc => {
            array.push(bc.bezier);
        });
        splines[splineIndex].spline = new Spline(array);
        splines[splineIndex].spline.makeContinuous();
        let i = 0, j = 0;
        splines[splineIndex].spline.curves.forEach(b => {
            splines[splineIndex].bezier_curves[j].bezier = b;
            drawBezier(splines[splineIndex].bezier_curves[j++]);
            splines[splineIndex].lines[i++][0] = new Point(b.getPoint(0)[0], b.getPoint(0)[1]);
            splines[splineIndex].lines[i++][0] = new Point(b.getPoint(3)[0], b.getPoint(3)[1]);
        });

        drawLines();
    }

    if (e.target.id === "smooth") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        splines[splineIndex].spline.makeSmooth();
        let i = 0, j = 0;
        splines[splineIndex].spline.curves.forEach(b => {
            splines[splineIndex].bezier_curves[j].bezier = b;
            drawBezier(splines[splineIndex].bezier_curves[j++]);
            splines[splineIndex].lines[i++][1] = new Point(b.getPoint(1)[0], b.getPoint(1)[1]);
            splines[splineIndex].lines[i++][1] = new Point(b.getPoint(2)[0], b.getPoint(2)[1]);
        });
        drawLines();
    }
});

toolbar.addEventListener("change", e => {
    if (e.target.id === "stroke") {
        lineColor = e.target.value;
    }
});

toolbar.addEventListener("input", e => {
    if (e.target.id === "precision") {
        precision = 101 - e.target.value;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        splines[splineIndex].bezier_curves.forEach(b => {
            drawBezier(b);
        });
        drawLines();
    }
});

const draw = (e) => {
    if (!isPainting)
        return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    splines[splineIndex].bezier_curves.forEach(b => {
        drawBezier(b);
    });

    if (bezier.n != -1) {
        drawFinal(e);
    }

    drawLines();
    ctx.setLineDash([1, 4]);
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = markerColor;
    ctx.arc(startPoint.x, startPoint.y, markerSizeCircle, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.fillRect(e.clientX - canvasOffsetX - markerSizeSquere / 2, e.clientY - markerSizeSquere / 2, markerSizeSquere, markerSizeSquere);

}

canvas.addEventListener("mousedown", (e) => {
    isPainting = true;
    startPoint = new Point(e.clientX - canvasOffsetX, e.clientY); //start point
    ctx.fillStyle = markerColor;


    splines[splineIndex].bezier_curves.forEach(b => {
        drawBezier(b);
    });

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, markerSizeCircle, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();

    drawLines();
});

canvas.addEventListener("mouseup", (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    isPainting = false;
    endPoint = new Point(e.clientX - canvasOffsetX, e.clientY);
    splines[splineIndex].lines.push([startPoint, endPoint]);

    if (bezier.n == -1) {
        bezier.addPoint([startPoint.x, startPoint.y]);
        bezier.addPoint([endPoint.x, endPoint.y]);
    } else {
        bezier.addPoint([endPoint.x, endPoint.y]);
        bezier.addPoint([startPoint.x, startPoint.y]);
        splines[splineIndex].bezier_curves.push(new Curve(bezier, lineColor));
        bezier = new Bezier([]);

    }

    splines[splineIndex].bezier_curves.forEach(b => {
        drawBezier(b);
    });
    drawLines();
});

canvas.addEventListener("mousemove", draw);

function drawFinal(e) {
    bezier.addPoint([e.clientX - canvasOffsetX, e.clientY]);
    bezier.addPoint([startPoint.x, startPoint.y]);
    drawBezier(new Curve(bezier, lineColor));
    bezier.popPoint();
    bezier.popPoint();
}

function drawLines() {
    var startP;
    var endP;
    ctx.strokeStyle = "#000";
    splines[splineIndex].lines.forEach(point => {
        startP = point[0];
        endP = point[1];

        ctx.setLineDash([1, 4]);
        ctx.beginPath();

        ctx.moveTo(startP.x, startP.y);
        ctx.lineTo(endP.x, endP.y);
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = markerColor;
        ctx.arc(startP.x, startP.y, markerSizeCircle, 0, 2 * Math.PI, false);

        ctx.fillRect(endP.x - markerSizeSquere / 2, endP.y - markerSizeSquere / 2, markerSizeSquere, markerSizeSquere);
        ctx.fill();

    });
}

function drawBezier(bez) {
    ctx.strokeStyle = bez.color;
    bez = bez.bezier;
    var point = bez.value(0);
    var deriv;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(point[0], point[1]);
    for (let i = 0; i <= 1;) {
        point = bez.value(i);
        deriv = bez.derivative(i);
        ctx.lineTo(point[0], point[1]);
        i += precision / length(deriv);
    }
    point = bez.value(1);
    ctx.lineTo(point[0], point[1]);
    ctx.stroke();
    ctx.closePath();
}
