var TR;
(function (TR) {
    document.addEventListener("DOMContentLoaded", init);
    function init() { }
    class Operator {
        constructor() {
        }
        eval() {
            if (typeof this.right != "number") {
                this.right = this.right.eval();
            }
            if (typeof this.left != "number") {
                this.left = this.left.eval();
            }
            return this.calc();
        }
        calc() {
            let erg = 0;
            if (typeof this.right == "number" && typeof this.left == "number") {
                switch (this.type) {
                    case "+": {
                        erg = this.right + this.left;
                        break;
                    }
                    case "-": {
                        erg = this.left - this.right;
                        break;
                    }
                    case "/": {
                        erg = this.left / this.right;
                        break;
                    }
                    case "*": {
                        erg = this.right * this.left;
                        break;
                    }
                    default: {
                        break;
                    }
                }
                return erg;
            }
        }
    }
    function analyseString() {
        let textarea = document.getElementById("textarea2");
        let TextareaValue = textarea.value;
    }
})(TR || (TR = {}));
//# sourceMappingURL=TRforreal.js.map