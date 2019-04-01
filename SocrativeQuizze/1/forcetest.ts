//window.addEventListener("load", senseForce);

let rebellion: string[] = ["Luke", "Yoda", "Leia", "Obi-Wan Kenobi", "Han Solo"];
let force: string = "none";
function senseForce(): void {

    if (rebellion[1] == "Leia")
        force = "low";
    else if (rebellion[4] == "Yoda")
        force = "yoda";
    else if (rebellion[3] == "Obi-Wan Kenobi")
        force = "high"

console.log(`The forcelevel is ${force}.`)

}
senseForce();