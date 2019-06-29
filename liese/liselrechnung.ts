let huhn: number = 2;
let gans: number = 2;
let schaf: number = 4;
let kaninchen: number = 4;
let noIdea: boolean = true;
let i: number = 0;
let x: number = 0;
let xActivated: boolean = false;

while (noIdea == true) {

    if (((i * huhn) + (i * gans * 2)) == 90 && xActivated == false) {

        console.log("Huhn = " + i + " Gans = " + i * 2);
        xActivated = true;
        i --;

    } else if (((i * huhn) + (i * gans * 2)) < 90 && xActivated == false) {

        i++;

    } else if (((i * huhn) + (i * gans * 2)) > 90 && xActivated == false) {

        i--;
        x++;
        xActivated = true;
        
    } else if (((i * huhn) + (i * gans * 2)) + ((x * schaf) + (x * kaninchen * 3)) == 90 && xActivated == true) {

        console.log("Huhn = " + i + " Gans = " + i * 2 + " Schaf = " + x + " Hase = " + x * 3);
        noIdea = false;

    } else if (((i * huhn) + (i * gans * 2)) + ((x * schaf) + (x * kaninchen * 3)) > 90 && xActivated == true) {

        i--;

    } else if (((i * huhn) + (i * gans * 2)) + ((x * schaf) + (x * kaninchen * 3)) < 90 && xActivated == true) {

        x++;
    }
}