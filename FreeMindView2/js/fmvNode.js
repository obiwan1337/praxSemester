var Freemind;
(function (Freemind) {
    class FMVNode {
        constructor(parent, ctx, content, side, folded) {
            this.parent = parent;
            this.children = new Array();
            this.ctx = ctx;
            this.content = content;
            this.mapPosition = side;
            this.folded = folded;
            if (this.parent == null) {
                console.log("Choosing '" + this.content + "' as root node");
                this.mapPosition = "root";
            }
            // left and right sides of the FMVNode
            this.leftBorder = this.content.length - 20;
            this.rightBorder = this.content.length + 20;
        }
        setPosition(_previousSiblingsWeight) {
            // place root node in the center of the canvas
            if (this.mapPosition == "root") {
                this.posX = Freemind.middleX;
                this.posY = Freemind.middleY;
            }
            if (this.mapPosition == "right") {
                this.posX = this.parent.posX + this.parent.content.length * 10;
                let gesamtHoehe = this.weightVisibleChildren * 30;
                let obersterPunkt = this.parent.posY - (gesamtHoehe / 2) + (30 / 2);
                let yPx = obersterPunkt + _previousSiblingsWeight * 30 + this.weightVisibleChildren * 30 / 2 - 30 / 2;
                this.posY = yPx;
            }
            let weightPreviousSiblings = 0;
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].setPosition(weightPreviousSiblings);
                weightPreviousSiblings += this.children[i].weightVisibleChildren;
            }
        }
        calculateVisibleChildren() {
            if (this.children.length <= 0 || this.folded) {
                this.weightVisibleChildren = 1;
                return 1;
            }
            this.weightVisibleChildren = 0;
            for (let child of this.children) {
                this.weightVisibleChildren += child.calculateVisibleChildren();
            }
            return this.weightVisibleChildren;
        }
        drawFMVNode() {
            if (this.mapPosition == "root") {
                this.ctx.beginPath();
                this.ctx.ellipse(this.posX, this.posY, this.content.length * 5, this.content.length, 0, 0, 2 * Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else {
                let startX;
                let endX;
                if (this.mapPosition == "left") {
                    startX = this.posX;
                    endX = this.parent.leftBorder;
                    console.log("left");
                    console.log("drawing rect");
                    this.pfadrect = new Path2D;
                    this.pfadrect.rect(startX, this.posY + 5, this.content.length * -7, -25);
                    this.ctx.stroke(this.pfadrect);
                }
                else if (this.mapPosition == "right") {
                    startX = this.posX;
                    endX = this.parent.posX;
                    console.log("right");
                    console.log("drawing rect");
                    this.pfadrect = new Path2D();
                    this.pfadrect.rect(startX, this.posY + 5, this.content.length * 9, -25);
                    this.ctx.stroke(this.pfadrect);
                }
                this.ctx.beginPath();
                this.ctx.moveTo(this.posX, this.posY);
                if (this.parent.mapPosition == "root") {
                    this.ctx.lineTo(this.parent.posX + this.parent.content.length * 5, this.parent.posY);
                }
                else {
                    this.ctx.lineTo(this.parent.posX + this.parent.content.length * 9, this.parent.posY);
                }
                this.ctx.stroke();
                this.ctx.closePath();
            }
            this.ctx.beginPath();
            this.ctx.font = "14px sans-serif";
            this.ctx.fillStyle = "black";
            if (this.mapPosition == "root") {
                this.ctx.textAlign = "center";
            }
            else {
                this.ctx.textAlign = "left";
            }
            this.ctx.fillText(this.content, this.posX, this.posY);
            this.ctx.closePath();
            console.log("FMVNode '" + this.content + "' created");
        }
    }
    Freemind.FMVNode = FMVNode;
})(Freemind || (Freemind = {}));
//# sourceMappingURL=fmvNode.js.map