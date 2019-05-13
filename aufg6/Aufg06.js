var aufg6;
(function (aufg6) {
    document.addEventListener("DOMContentLoaded", init);
    document.addEventListener("change", handleChange);
    function init() {
        createHTMLElements(aufg6.Angebot);
        handleChange();
    }
    function createHTMLElements(_Angebotarray) {
        let form = document.createElement("form");
        form.id = "form1";
        document.getElementsByTagName("body")[0].appendChild(form);
        for (let key in _Angebotarray) {
            let fieldset = document.createElement("fieldset");
            fieldset.id = key;
            form.appendChild(fieldset);
            console.log(aufg6.Angebot[key].length + "key length");
            for (let i = 0; i < aufg6.Angebot[key].length; i++) {
                let AktuellesProdukt = aufg6.Angebot[key][i];
                let label = document.createElement("label");
                console.log("Lable created");
                label.innerHTML = aufg6.Angebot[key][i].name + " " + aufg6.Angebot[key][i].price;
                let childinput = document.createElement("input");
                console.log("input created");
                childinput.setAttribute("type", AktuellesProdukt.input);
                childinput.id = `${key}` + "_" + `${i}`;
                if (AktuellesProdukt.input == "radio") {
                    childinput.name = key + "radio";
                }
                else {
                    childinput.name = AktuellesProdukt.name;
                }
                if (AktuellesProdukt.input == "number") {
                    childinput.value = "0";
                    childinput.min = "0";
                }
                else { }
                label.appendChild(childinput);
                fieldset.appendChild(label);
            }
        }
        let button = document.createElement("button");
        button.id = "bestellButton";
        button.type = "input";
        form.appendChild(button);
    }
    function handleChange() {
        let inputlist = document.getElementsByTagName("input");
        let zwischensumme = 0;
        let childnode = "";
        for (let i = 0; i < inputlist.length; i++) {
            let inputType = inputlist[i].type;
            let inpArray = inputlist[i].id.split("_");
            let inpKey = inpArray[0];
            let inpNumb = Number(inpArray[1]);
            switch (inputType) {
                case "radio":
                    if (inputlist[i].checked == true) {
                        zwischensumme += aufg6.Angebot[inpKey][inpNumb].price;
                        childnode += aufg6.Angebot[inpKey][inpNumb].name + " " + aufg6.Angebot[inpKey][inpNumb].price + "€\n";
                    }
                    break;
                case "number":
                    if (Number(inputlist[i].value) > 0) {
                        zwischensumme += aufg6.Angebot[inpKey][inpNumb].price * Number(inputlist[i].value);
                        childnode += aufg6.Angebot[inpKey][inpNumb].name + " " + aufg6.Angebot[inpKey][inpNumb].price + "€\n";
                    }
                    break;
                case "checkbox":
                    if (inputlist[i].checked == true) {
                        zwischensumme += aufg6.Angebot[inpKey][inpNumb].price;
                        childnode += aufg6.Angebot[inpKey][inpNumb].name + " " + aufg6.Angebot[inpKey][inpNumb].price + "€\n";
                    }
                    break;
                case "default":
                    console.log("this got you a default!");
                    break;
            }
        }
        let textarea = document.getElementById("review");
        childnode += "\n" + "Gesamtpreis: " + zwischensumme + " €";
        textarea.innerText = childnode;
    }
})(aufg6 || (aufg6 = {}));
//# sourceMappingURL=Aufg06.js.map