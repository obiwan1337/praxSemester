document.addEventListener("DOMContentLoaded", init);
let table;
function init() {
    document.addEventListener("keydown", keymirror);
    table = document.getElementById('ultratabelle');
    table.innerHTML += "<tr><th> key </th><th> keycode </th><th> code </th>";
    table.id = 'ultratabelle';
}
function keymirror(_event) {
    _event.preventDefault();
    table.innerHTML += "<tr><td>" + _event.key + "</td><td> " + _event.keycode + " </td><td> " + _event.code + " </td>";
}
document.getElementById('bottom').scrollIntoView();
//# sourceMappingURL=keycode.js.map