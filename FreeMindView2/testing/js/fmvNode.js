var Freemind;
(function (Freemind) {
    class FMVNode {
        constructor(parent, ctx, content, side, folded) {
            this.bezPtX1 = 30;
            this.bezPtX2 = 30;
            this.bezPtY1 = 0;
            this.bezPtY2 = 0;
            this.childHight = 30;
            this.parent = parent;
            this.children = new Array();
            this.ctx = ctx;
            this.content = content;
            this.mapPosition = side;
            this.folded = folded;
            if (this.parent == null) {
                this.mapPosition = "root";
            }
        }
        setPosition(_previousSiblingsWeight) {
            if (this.mapPosition == "right") {
                this.posX = this.parent.posX + this.parent.content.length * 7 + 70;
                this.posY = this.calculateHighestPoint(this.parent.posY, this.parent.weightVisibleChildrenRight, this.childHight, _previousSiblingsWeight, this.weightVisibleChildrenRight);
            }
            if (this.mapPosition == "left") {
                this.posX = this.parent.posX - this.parent.content.length * 7 - 70;
                this.posY = this.calculateHighestPoint(this.parent.posY, this.parent.weightVisibleChildrenLeft, this.childHight, _previousSiblingsWeight, this.weightVisibleChildrenLeft);
            }
            let weightPreviousSiblingsRight = 0;
            let weightPreviousSiblingsLeft = 0;
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i].mapPosition == "right") {
                    this.children[i].setPosition(weightPreviousSiblingsRight);
                    weightPreviousSiblingsRight += this.children[i].weightVisibleChildrenRight;
                }
                else {
                    this.children[i].setPosition(weightPreviousSiblingsLeft);
                    weightPreviousSiblingsLeft += this.children[i].weightVisibleChildrenLeft;
                }
            }
        }
        calculateHighestPoint(_parentPositionY, _parentWeightVisibleChildren, _childHight, _previousSiblingsWeight, _weightVisibleChildren) {
            let highestPoint = _parentPositionY - _parentWeightVisibleChildren * _childHight / 2 + (_childHight / 2);
            let yPx = highestPoint + _previousSiblingsWeight * _childHight + (_weightVisibleChildren * _childHight) / 2 - (_childHight / 2);
            this.posY = yPx;
            return yPx;
        }
        calculateVisibleChildren() {
            if (this.children.length <= 0 || this.folded) {
                if (this.mapPosition == "right")
                    this.weightVisibleChildrenRight = 1;
                else
                    this.weightVisibleChildrenLeft = 1;
                return 1;
            }
            this.weightVisibleChildrenRight = 0;
            this.weightVisibleChildrenLeft = 0;
            for (let child of this.children) {
                if (child.mapPosition == "right")
                    this.weightVisibleChildrenRight += child.calculateVisibleChildren();
                else
                    this.weightVisibleChildrenLeft += child.calculateVisibleChildren();
            }
            if (this.mapPosition == "right")
                return this.weightVisibleChildrenRight;
            return this.weightVisibleChildrenLeft;
        }
        drawFMVNode() {
            let startX;
            //rectangles um den text
            if (this.mapPosition == "left") {
                startX = this.posX;
                this.pfadrect = new Path2D();
                this.pfadrect.rect(startX, this.posY + 5, this.content.length * -7.2, -25);
                //this.ctx.stroke(this.pfadrect);
            }
            else if (this.mapPosition == "right") {
                startX = this.posX;
                this.pfadrect = new Path2D();
                this.pfadrect.rect(startX, this.posY + 5, this.content.length * 7.2, -25);
                //this.ctx.stroke(this.pfadrect);
            }
            // verbindungslinie von kasten zu kasten
            this.ctx.beginPath();
            this.ctx.moveTo(this.posX, this.posY);
            if (this.parent.mapPosition == "root" && this.mapPosition == "right") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.posX, this.posY);
                this.ctx.bezierCurveTo(this.posX - this.bezPtX1, this.posY, this.parent.posX + this.parent.content.length * 5 + this.bezPtX2, this.parent.posY, this.parent.posX + this.parent.content.length * 5, this.parent.posY);
            }
            else if (this.parent.mapPosition == "root" && this.mapPosition == "left") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.posX, this.posY);
                this.ctx.bezierCurveTo(this.posX + this.bezPtX1, this.posY, this.parent.posX + this.parent.content.length * -5 - this.bezPtX2, this.parent.posY, this.parent.posX + this.parent.content.length * -5, this.parent.posY);
            }
            else if (this.mapPosition == "right") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.posX, this.posY);
                this.ctx.bezierCurveTo(this.posX - this.bezPtX1, this.posY, this.parent.posX + this.parent.content.length * 7 + this.bezPtX2, this.parent.posY, this.parent.posX + this.parent.content.length * 7, this.parent.posY);
            }
            else {
                //this.ctx.lineTo(this.parent.posX + this.parent.content.length * -7, this.parent.posY);
                this.ctx.beginPath();
                this.ctx.moveTo(this.posX, this.posY);
                this.ctx.bezierCurveTo(this.posX + this.bezPtX1, this.posY, this.parent.posX + this.parent.content.length * -7 - this.bezPtX2, this.parent.posY, this.parent.posX + this.parent.content.length * -7, this.parent.posY);
            }
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.font = "14px sans-serif";
            this.ctx.fillStyle = "black";
            if (this.mapPosition == "root") {
                this.ctx.textAlign = "center";
            }
            else if (this.mapPosition == "right") {
                this.ctx.textAlign = "left";
            }
            else {
                this.ctx.textAlign = "right";
            }
            this.ctx.fillText(this.content, this.posX, this.posY);
            this.ctx.closePath();
            for (let i = 0; this.children.length > i && !this.folded; i++) {
                this.children[i].drawFMVNode();
            }
        }
    }
    Freemind.FMVNode = FMVNode;
    class FMVRootNode extends FMVNode {
        constructor(ctx, content) {
            super(null, ctx, content, "root", false);
        }
        drawFMVNode() {
            this.ctx.beginPath();
            this.ctx.ellipse(this.posX, this.posY, this.content.length * 5, this.content.length, 0, 0, 2 * Math.PI);
            this.pfadrect = new Path2D();
            this.pfadrect.rect(Freemind.rootNodeX + this.content.length * 7.2 / 2, Freemind.rootNodeY + 5, this.content.length * -7.2, -25);
            this.ctx.stroke();
            this.ctx.closePath();
        }
        setPosition(_previousSiblingsWeight) {
            if (this.mapPosition == "root") {
                this.posX = Freemind.rootNodeX;
                this.posY = Freemind.rootNodeY;
            }
            super.setPosition(_previousSiblingsWeight);
        }
    }
    Freemind.FMVRootNode = FMVRootNode;
})(Freemind || (Freemind = {}));
//# sourceMappingURL=fmvNode.js.map