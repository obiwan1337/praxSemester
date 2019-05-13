var rechner;
(function (rechner) {
    document.addEventListener("DOMContentLoaded", init);
    let Rechn;
    let Stringrechnung;
    function init() {
        Rechn = document.getElementById("Buttonrechn");
        Stringrechnung = document.getElementById("textarea2");
        Rechn.addEventListener("click", Rechnung);
    }
    function Rechnung() {
        console.log(Stringrechnung.value);
        let script = document.createElement("script");
        script.innerHTML = "";
        document.body.appendChild(script);
        script.innerText = "console.log(" + Stringrechnung.value + ")";
        let Erg = Number(Stringrechnung.value);
        Stringrechnung.innerHTML += Erg;
        console.log(Erg + " erg");
    }
})(rechner || (rechner = {}));
//# sourceMappingURL=tachsenrechner.js.map