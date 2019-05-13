namespace eventfire {
    window.addEventListener("load", init);
    let clickevent: Event = new Event("mouseup");
    let buttonA: HTMLElement;
    let buttonB: HTMLElement;

    function init(): void {

        buttonA = document.getElementsByTagName("button")[0];
        buttonB = document.getElementsByTagName("button")[1];
        buttonA.addEventListener("mouseup", fireAtB);
        buttonB.addEventListener("mouseup", hitOfB);
    }
    function fireAtB(): void {
        buttonB.dispatchEvent(clickevent);
    }
    function hitOfB(): void {
        console.log("B got molested");
    }
}