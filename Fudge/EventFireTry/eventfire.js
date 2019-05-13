var eventfire;
(function (eventfire) {
    window.addEventListener("load", init);
    let clickevent = new Event("mouseup");
    let buttonA;
    let buttonB;
    function init() {
        buttonA = document.getElementsByTagName("button")[0];
        buttonB = document.getElementsByTagName("button")[1];
        buttonA.addEventListener("mouseup", fireAtB);
        buttonB.addEventListener("mouseup", hitOfB);
    }
    function fireAtB() {
        buttonB.dispatchEvent(clickevent);
    }
    function hitOfB() {
        console.log("B got molested");
    }
})(eventfire || (eventfire = {}));
//# sourceMappingURL=eventfire.js.map