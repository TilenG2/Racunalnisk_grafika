export class Quadtree {
    constructor({
        bounds = {
            minX: 0,
            minY: 0,
            maxX: 512,
            maxY: 512,
        },
        max_layers = 5,
        max_objects = 4
    } = {}) {
        this.bounds = bounds;
        this.max_layers = max_layers;
        this.max_objects = max_objects;

        this.objects = new Set();
        this.sub_quadtrees = [];
    }

    __insertIntoQuadtree(object) {
        const x = object.x;
        const y = object.y;
        for (const subTree of this.sub_quadtrees) {
            const quadTreeBounds = subTree.bounds;
            if (quadTreeBounds.minX <= x && x < quadTreeBounds.maxX
                && quadTreeBounds.minY <= y && y < quadTreeBounds.maxY) {
                subTree.add(object);
                break;
            }
        }
    }

    draw(ctx) {
        for (const subTree of this.sub_quadtrees) {
            subTree.draw(ctx);
        }
        ctx.strokeStyle = "#aaa";
        ctx.strokeRect(this.bounds.minX, this.bounds.minY, this.bounds.maxX - this.bounds.minX, this.bounds.maxY - this.bounds.minY);
    }

    add(object) {
        if (this.objects == null) {
            this.__insertIntoQuadtree(object);
        } else {
            if (this.objects.size < this.max_objects || this.max_layers == 0)
                this.objects.add(object)
            else {
                // generate subtrees
                //     |
                //  0  |  1
                // ----+----
                //  2  |  3
                //     |
                this.sub_quadtrees[0] =
                    new Quadtree({
                        bounds: {
                            minX: this.bounds.minX,
                            minY: this.bounds.minY,
                            maxX: (this.bounds.maxX - this.bounds.minX) / 2 + this.bounds.minX,
                            maxY: (this.bounds.maxY - this.bounds.minY) / 2 + this.bounds.minY,
                        },
                        max_layers: this.max_layers - 1,
                        max_objects: this.max_objects,
                    });

                this.sub_quadtrees[1] =
                    new Quadtree({
                        bounds: {
                            minX: (this.bounds.maxX - this.bounds.minX) / 2 + this.bounds.minX,
                            minY: this.bounds.minY,
                            maxX: this.bounds.maxX,
                            maxY: (this.bounds.maxY - this.bounds.minY) / 2 + this.bounds.minY,
                        },
                        max_layers: this.max_layers - 1,
                        max_objects: this.max_objects,
                    });

                this.sub_quadtrees[2] =
                    new Quadtree({
                        bounds: {
                            minX: this.bounds.minX,
                            minY: (this.bounds.maxY - this.bounds.minY) / 2 + this.bounds.minY,
                            maxX: (this.bounds.maxX - this.bounds.minX) / 2 + this.bounds.minX,
                            maxY: this.bounds.maxY,
                        },
                        max_layers: this.max_layers - 1,
                        max_objects: this.max_objects,
                    });

                this.sub_quadtrees[3] =
                    new Quadtree({
                        bounds: {
                            minX: (this.bounds.maxX - this.bounds.minX) / 2 + this.bounds.minX,
                            minY: (this.bounds.maxY - this.bounds.minY) / 2 + this.bounds.minY,
                            maxX: this.bounds.maxX,
                            maxY: this.bounds.maxY,
                        },
                        max_layers: this.max_layers - 1,
                        max_objects: this.max_objects,
                    });

                this.objects.add(object);
                for (const object of this.objects) {
                    this.__insertIntoQuadtree(object);
                }
                this.objects = null;
            }
        }
    }

    __getObjectsAtPoint(boundingBox) {
        if (this.objects == null) {
            const feiends = new Set();
            for (const subTree of this.sub_quadtrees) {
                if (subTree.__intersecting(boundingBox)) {
                    for (const object of subTree.__getObjectsAtPoint(boundingBox)) {
                        feiends.add(object);
                    }
                }
            }
            return feiends;
        }
        else return this.objects;

    }

    __intersecting(boundingBox) {
        return this.bounds.maxX >= boundingBox.minX && this.bounds.minX <= boundingBox.maxX && this.bounds.minY <= boundingBox.maxY && this.bounds.maxY >= boundingBox.minY;
    }

    getFriends(object) {
        const boundingBox = {
            minX: object.x - object.radius,
            minY: object.y - object.radius,
            maxX: object.x + object.radius,
            maxY: object.y + object.radius,
        }
        return this.__getObjectsAtPoint(boundingBox);
    }
}