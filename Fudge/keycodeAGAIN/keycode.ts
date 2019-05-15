document.addEventListener("DOMContentLoaded", init);
function init() {
    let textarea = document.getElementById("texteing");
    textarea.addEventListener("keydown", keymirror);
}
function keymirror(_event) {
    //_event.preventDefault();
    let span = document.getElementById("okaythen");
    // body.innerHTML += KeyboardEvent
    let keycode = _event;
    span.innerHTML += "Key: " + keycode.key + " >Code: " + keycode.code + "</br>";
}
