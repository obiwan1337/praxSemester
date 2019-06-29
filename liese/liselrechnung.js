let huhn = 2;
let gans = 2;
let schaf = 4;
let kaninchen = 4;
let noIdea = true;
let i = 0;
let x = 0;
let xActivated = false;
while (noIdea == true) {
    if (((i * huhn) + (i * gans * 2)) == 90 && xActivated == false) {
        console.log("Huhn = " + i + " Gans = " + i * 2);
        xActivated = true;
        i--;
    }
    else if (((i * huhn) + (i * gans * 2)) < 90 && xActivated == false) {
        i++;
    }
    else if (((i * huhn) + (i * gans * 2)) > 90 && xActivated == false) {
        i--;
        x++;
        xActivated = true;
    }
    else if (((i * huhn) + (i * gans * 2)) + ((x * schaf) + (x * kaninchen * 3)) == 90 && xActivated == true) {
        console.log("Huhn = " + i + " Gans = " + i * 2 + " Schaf = " + x + " Hase = " + x * 3);
        noIdea = false;
    }
    else if (((i * huhn) + (i * gans * 2)) + ((x * schaf) + (x * kaninchen * 3)) > 90 && xActivated == true) {
        i--;
    }
    else if (((i * huhn) + (i * gans * 2)) + ((x * schaf) + (x * kaninchen * 3)) < 90 && xActivated == true) {
        x++;
    }
}
//# sourceMappingURL=liselrechnung.js.map