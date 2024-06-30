import { Quadtree } from "./QuadTree.mjs";

//simulation parameters
const minBall_radius = 5;
const maxBall_radius = 30;

const minBall_speed = 0.5;
const maxBall_speed = 2;

const maxQuadtree_depth = 8;
const maxQuadtree_objects = 4;

const startBall_count = 420;

const canvas = document.getElementById("myCanvas");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let drawQuadTree = false;


const quadtree_template = {
    bounds: {
        minX: 0,
        minY: 0,
        maxX: canvas.width,
        maxY: canvas.height,
    },
    max_layers: maxQuadtree_depth,
    max_objects: maxQuadtree_objects,

};

let quadtree;

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

function Ball(x, y, direction, radius, color = "#000") {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.radius = radius;
    this.color = color;

    this.intersect = (ball) => {
        let productX = this.x - ball.x;
        let productY = this.y - ball.y;
        let distance = Math.sqrt(productX * productX + productY * productY);
        if (distance <= (this.radius + ball.radius)) {
            return true;
        } else {
            return false;
        }
    };
}

const ball_array = [];

toolbar.addEventListener("click", e => {
    if (e.target.id === "clear") {
        while (ball_array.length != 0) {
            ball_array.pop();
        }
        updateToolbar();
    }
});

toolbar.addEventListener("change", e => {
    if (e.target.id === "checkbox") {
        drawQuadTree = !drawQuadTree;
    }
});


toolbar.addEventListener("input", e => {
    if (e.target.id === "number") {
        const nob = document.getElementById("number").value;
        if (nob < ball_array.length) {
            let n = ball_array.length;
            for (let i = 0; i < n - nob; i++) {
                ball_array.pop();
            }
        }
        else {
            let n = ball_array.length;
            for (let i = 0; i < nob - n; i++) {
                addBall(Math.random() * canvas.width, Math.random() * canvas.height);
            }
        }
        updateToolbar();
    }
});

canvas.addEventListener("mousedown", (e) => {
    isPainting = true;
    addBall(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY)
});

canvas.addEventListener("mousemove", (e) => {
    if (isPainting)
        addBall(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY)
});

canvas.addEventListener("mouseup", (e) => {
    isPainting = false;
});

const addBall = (x, y) => {
    const radius = Math.random() * (maxBall_radius - minBall_radius) + minBall_radius;
    const angle = Math.random() * 2 * Math.PI - Math.PI;
    const speed = Math.random() * (maxBall_speed - minBall_speed) + minBall_speed;
    const direction = new Vector(Math.cos(angle) * speed, Math.sin(angle) * speed);

    ball_array.push(new Ball(x, y, direction, radius));
    updateToolbar();
}

const updateToolbar = () => {
    document.getElementById("ballNo").innerHTML = "Ball no: " + ball_array.length;
    document.getElementById("number").value = ball_array.length;
}


const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    buildQuadTree();

    if (drawQuadTree)
        quadtree.draw(ctx, canvas);

    move();

    colorItersectingBalls();

    drawBalls();

    window.requestAnimationFrame(draw);
}

const buildQuadTree = () => {
    quadtree = new Quadtree(quadtree_template);

    for (const ball of ball_array) {
        quadtree.add(ball);
    }
}

const colorItersectingBalls = () => {
    for (const ball1 of ball_array) {
        // if (ball1.color == "red") continue;
        for (const ball2 of quadtree.getFriends(ball1)) {
            if (ball1 == ball2) continue;
            if (ball1.intersect(ball2)) {
                ball1.color = "red";
                ball2.color = "red";
            }
        }
    }

}

const drawBalls = () => {
    for (const ball of ball_array) {
        ctx.beginPath();

        ctx.strokeStyle = ball.color;
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);

        ctx.stroke();
        ball.color = "#000";
    }
}

const move = () => {
    for (const ball of ball_array) {
        ball.x += ball.direction.x;
        ball.y += ball.direction.y;

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.direction.y = -ball.direction.y;
            if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
            }
            else if (ball.y + ball.radius > canvas.height) {
                ball.y = canvas.height - ball.radius;
            }
        }

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.direction.x = -ball.direction.x;
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
            }
            else if (ball.x + ball.radius > canvas.width) {
                ball.x = canvas.width - ball.radius;
            }
        }

    }
}

function init() {
    for (let i = 0; i < startBall_count; i++) {
        addBall(Math.random() * canvas.width, Math.random() * canvas.height);
    }
    window.requestAnimationFrame(draw);
}

init();