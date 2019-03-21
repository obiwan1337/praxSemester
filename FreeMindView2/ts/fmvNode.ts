namespace freemind {

    export class FMVNode {
        public parent: FMVNode;
        public siblings: FMVNode[];
        public ctx: CanvasRenderingContext2D;
        public content: string;
        public radius: number;
        public posX: number;
        public posY: number;
        public leftBorder: number;
        public rightBorder: number;
        public mapPosition: string;

        constructor(
            parent: FMVNode,
            ctx: CanvasRenderingContext2D,
            content: string,
            side: string
        ) {
            this.parent = parent;
            this.siblings = new Array();
            this.ctx = ctx;
            this.content = content;
            this.mapPosition = side;

            this.radius = this.content.length * 3;

            if (this.parent == null) {
                console.log("Choosing '" + this.content + "' as root node");
                this.mapPosition = "root";
            }

            this.setPosition();

            // left and right sides of the FMVNode
            this.leftBorder = this.posX - this.radius;
            this.rightBorder = this.posX + this.radius;
        }

        setPosition = () => {
            // place root node in the center of the canvas
            if (this.mapPosition == "root") {
                this.posX = middleX;
                this.posY = middleY;
            }

            if (this.mapPosition == "left") {
                this.posX = this.parent.posX - this.parent.radius - 150;
                this.posY = this.parent.posY;
            } else if (this.mapPosition == "right") {
                this.posX = this.parent.posX + this.parent.radius + 150;
                this.posY = this.parent.posY;
            }

            // use siblings to set a distance between them
            if (this.siblings.length > 1) {
                let index: number = this.siblings.findIndex(
                    elt => elt.content === this.content
                );
                console.log("has siblings");
                if (index != 0) {
                    this.posY = this.siblings[index - 1].posY + 30;
                } else if (index == 0) {
                    this.posY = this.parent.posY - 30;
                }
            }
        }

        drawFMVNode = () => {
            this.setPosition();

            if (this.parent == null) {
                this.ctx.beginPath();
                this.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
            } else {
                let startX: number;
                let endX: number;
                if (this.mapPosition == "left") {
                    startX = this.rightBorder;
                    endX = this.parent.leftBorder;
                    console.log("left");
                } else if (this.mapPosition == "right") {
                    startX = this.leftBorder;
                    endX = this.parent.rightBorder;
                    console.log("right");
                }
                this.ctx.moveTo(startX, this.posY);
                this.ctx.lineTo(endX, this.parent.posY);
                this.ctx.stroke();
            }

            this.ctx.stroke();
            this.ctx.font = "14px Calibri";
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "center";
            this.ctx.fillText(this.content, this.posX, this.posY);

            console.log("FMVNode '" + this.content + "' created");
        }
    }
}