document.addEventListener("DOMContentLoaded", init);

let table:HTMLElement;
function init() {
document.addEventListener("keydown", keymirror);

table = <HTMLTableElement>document.getElementById('ultratabelle');

table.innerHTML += "<tr><th> key </th><th> keycode </th><th> code </th>";
table.id ='ultratabelle'
}
function keymirror(_event) {
    _event.preventDefault();
    table.innerHTML += "<tr><td>" + _event.key +"</td><td> "+ _event.keycode + " </td><td> "+ _event.code + " </td>";   
    bottom();
}

function bottom():void {
    document.getElementById( 'bottom' ).scrollIntoView();
    
};