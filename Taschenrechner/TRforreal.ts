namespace TR {
    document.addEventListener("DOMContentLoaded", init);
    let textarea: HTMLTextAreaElement;
    function init(): void {
        textarea = <HTMLTextAreaElement>document.getElementById("textarea2");
        let button: HTMLButtonElement = <HTMLButtonElement>document.getElementById("calc");
        button.addEventListener("click", analyseString);
    }
    class Operator {
        left: number | Operator;
        right: number | Operator;
        type: string;
        internalString;
        constructor() {

        }
        eval(): number {

            if (typeof this.right != "number") {
                this.right = this.right.eval();
            }
            if (typeof this.left != "number") {
                this.left = this.left.eval();
            }
            return this.calc();

        }
        calc(): number {
            let erg: number = 0;
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

    function analyseString(): void {
        let TextareaValue: string = textarea.value;
        console.log(TextareaValue.length);
        
     

    }
}