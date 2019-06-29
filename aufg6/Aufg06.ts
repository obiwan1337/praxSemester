namespace aufg6 {

    document.addEventListener("DOMContentLoaded", init);
    document.addEventListener("change", handleChange);
    function init(): void {

        createHTMLElements(Angebot);
        handleChange();
    }
    function createHTMLElements(_Angebotarray: Product): void {
        let form: HTMLFormElement = document.createElement("form");
        form.id = "form1"
        document.getElementsByTagName("body")[0].appendChild(form);
        for (let key in _Angebotarray) {
            let fieldset:HTMLFieldSetElement = document.createElement("fieldset");
            fieldset.id = key;
            form.appendChild(fieldset);
            console.log(Angebot[key].length + "key length");
            for (let i: number = 0; i < Angebot[key].length; i++) {
                let aktuellesProdukt: einzelPosten = Angebot[key][i];
                let label: HTMLLabelElement = document.createElement("label");
                console.log("Lable created");
                label.innerHTML = Angebot[key][i].name + " " + Angebot[key][i].price;
                let childinput: HTMLInputElement = document.createElement("input");
                console.log("input created");
                childinput.setAttribute("type", aktuellesProdukt.input);
                childinput.id = `${key}` + "_" + `${i}`;
                if (aktuellesProdukt.input == "radio") {
                    childinput.name = key + "radio";
                } else {
                    childinput.name = aktuellesProdukt.name;
                }
                if (aktuellesProdukt.input == "number") {
                    childinput.value = "0";
                    childinput.min = "0";
                } else { //
                 }
                label.appendChild(childinput);
                fieldset.appendChild(label);
            }
        }
        let button: HTMLButtonElement = document.createElement("button");
        button.id = "bestellButton";
        button.type = "input";
        form.appendChild(button);
    }
    function handleChange(): void {
        let inputlist: HTMLCollectionOf<HTMLInputElement> = document.getElementsByTagName("input");
        let zwischensumme: number = 0;
        let childnode: string = "";
        for (let i: number = 0; i < inputlist.length; i++) {
            let inputType: string = inputlist[i].type;
            let inpArray: string[] = inputlist[i].id.split("_");
            let inpKey: string = inpArray[0];
            let inpNumb: number = Number(inpArray[1]);

            switch (inputType) {

                case "radio":
                    if (inputlist[i].checked == true) {
                        zwischensumme += Angebot[inpKey][inpNumb].price;
                        childnode += Angebot[inpKey][inpNumb].name + " " + Angebot[inpKey][inpNumb].price + "€\n";
                    }
                    break;

                case "number":
                    if (Number(inputlist[i].value) > 0) {
                        zwischensumme += Angebot[inpKey][inpNumb].price * Number(inputlist[i].value);
                        childnode += Angebot[inpKey][inpNumb].name + " " + Angebot[inpKey][inpNumb].price + "€\n";
                    }
                    break;

                case "checkbox":
                    if (inputlist[i].checked == true) {
                        zwischensumme += Angebot[inpKey][inpNumb].price;
                        childnode += Angebot[inpKey][inpNumb].name + " " + Angebot[inpKey][inpNumb].price + "€\n";
                    }
                    break;
                case "default":
                    console.log("this got you a default!");
                    break;
            }

        }
        let textarea: HTMLElement = document.getElementById("review");
        childnode += "\n" + "Gesamtpreis: " + zwischensumme + " €";
        textarea.innerText = childnode;
    }
}