var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Freemind;
(function (Freemind) {
    window.addEventListener("load", init);
    let params;
    //let body: HTMLBodyElement = document.getElementsByTagName("body")[0];
    //let list: HTMLElement;
    let canvas;
    let ctx;
    let mindmapData;
    let docNode; // document node is the first node in a xml file
    let rootNode; // first actual node of the mindmap
    let fmvNodes;
    let hasMouseBeenMoved = false;
    //let url: string;
    function init() {
        fmvNodes = [];
        params = getUrlSearchJson();
        if (params.list == undefined) {
            params.list = "false";
        }
        if (params.path == undefined || params.path == "") {
            params.path = "/Public/mm";
            params.map = "README.mm";
            params.list = "false";
        }
        //url = params.path + "/" + params.map;
        fetchXML().then(() => {
            docNode = mindmapData.documentElement;
            rootNode = docNode.firstElementChild;
            if (params.list == "true") {
                //createList();
            }
            else if (params.list == "false" || !params.list) {
                createCanvas();
                createMindmap();
            }
        });
        //document.getElementById('hideit').addEventListener('click', toggleHide);
        window.addEventListener('resize', resizecanvas, false);
    }
    function fetchXML() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('./mm/EIA2.mm');
            const xmlText = yield response.text();
            mindmapData = StringToXML(xmlText); // Save xml in letiable
        });
    }
    // parses a string to XML
    function StringToXML(xString) {
        return new DOMParser().parseFromString(xString, "text/xml");
    }
    function createCanvas() {
        canvas = document.getElementsByTagName("canvas")[0];
        /* canvas = document.createElement("canvas");
        canvas.id = "fmcanvas"; */
        canvas.setAttribute("height", "window.innerHeight");
        canvas.setAttribute("width", "window.innerWidth");
        //body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        // match Canvas dimensions to browser window
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        // determine the center of the canvas
        Freemind.rootNodeX = ctx.canvas.width / 2;
        Freemind.rootNodeY = ctx.canvas.height / 2;
        // Eventlistener for draggable canvas
        //canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", onPointerMove);
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("keyboardinput", keyboardInput);
        canvas.addEventListener("touchstart", handleStart, false);
        canvas.addEventListener("touchend", handleEnd, false);
        canvas.addEventListener("touchcancel", handleCancel, false);
        canvas.addEventListener("touchmove", handleMove, false);
        //  canvas.addEventListener("touchend",)
    }
    function resizecanvas() {
        createCanvas();
        fmvNodes[0].drawFMVNode();
    }
    function createMindmap() {
        clearMap();
        fmvNodes.length = 0;
        // create root FMVNode
        let root = new Freemind.FMVNode(null, ctx, rootNode.getAttribute("TEXT"), "root", false);
        fmvNodes.push(root);
        // Use root FMVNode as starting point and create all subFMVNodes
        createFMVNodes(rootNode, root);
        root.calculateVisibleChildren();
        root.setPosition(0);
        root.drawFMVNode();
        console.log(fmvNodes, " fmvNodes");
    }
    function createFMVNodes(rootNode, parentFMVNode) {
        // only continue if current root has children
        if (rootNode.hasChildNodes()) {
            let children = getChildElements(rootNode);
            // FMVNodes array used for sibling relations
            let childFMVNodes = new Array();
            for (let i = 0; i < children.length; i++) {
                // use only children with rootNode as parent
                if (children[i].parentElement == rootNode) {
                    let fmvNodeContent = children[i].getAttribute("TEXT");
                    let fmvNodeMapPosition = children[i].getAttribute("POSITION");
                    if (fmvNodeMapPosition == null) {
                        fmvNodeMapPosition = parentFMVNode.mapPosition;
                    }
                    let fmvNodeFolded = children[i].getAttribute("FOLDED");
                    let fmvNodeFoldedBool = fmvNodeFolded == "true" ? true : false;
                    let fmvNode = new Freemind.FMVNode(parentFMVNode, ctx, fmvNodeContent, fmvNodeMapPosition, fmvNodeFoldedBool);
                    childFMVNodes.push(fmvNode);
                    fmvNodes.push(fmvNode);
                    parentFMVNode.children = childFMVNodes;
                    // do it all again for all the children of rootNode
                    createFMVNodes(children[i], fmvNode);
                }
            }
        }
        else {
            return;
        }
    }
    function getChildElements(parent) {
        let childElementsCollection;
        let childElements = new Array();
        // get all children of parent as Element collection. Gets ALL children!
        childElementsCollection = parent.getElementsByTagName("node");
        console.log(childElementsCollection.length + "child elementcollection length");
        for (let i = 0; i < childElementsCollection.length; i++) {
            if (childElementsCollection[i].parentElement == parent) {
                // save only the children with correct parent element
                childElements.push(childElementsCollection[i]);
            }
        }
        return childElements;
    }
    function redrawWithoutChildren() {
        clearMap();
        fmvNodes[0].setPosition(0);
        fmvNodes[0].drawFMVNode();
    }
    /*  function createNewEntry(_x: number, _y: number) {
   
       for (let i: number; i < fmvNodes.length; i++) {
         console.log(fmvNodes[i].pfadrect);
         if (ctx.isPointInPath(fmvNodes[i].pfadrect, _x, _y)) {
           console.log("new entry possible");
         }
       }
     } */
    function keyboardInput(e) {
        let type = e.type;
        let key = e.key;
        let code = e.code;
        console.log(` yea boy keyboardinput ${type} ${key} ${code}`);
    }
    function onMouseDown(_event) {
        hasMouseBeenMoved = false;
    }
    function onMouseUp(_event) {
        if (hasMouseBeenMoved) {
            return;
        }
        console.log("mausnichtbewegt");
        if (ctx.isPointInPath(fmvNodes[0].pfadrect, _event.clientX, _event.clientY) && fmvNodes[0].folded) {
            for (let i = 0; i < fmvNodes.length; i++) {
                fmvNodes[i].folded = false;
                fmvNodes[0].calculateVisibleChildren();
                redrawWithoutChildren();
            }
        }
        else {
            for (let i = 0; i < fmvNodes.length; i++) {
                console.log(fmvNodes[i].pfadrect + " pfadrect " + _event.clientX, _event.clientY, i + " i");
                if (ctx.isPointInPath(fmvNodes[i].pfadrect, _event.clientX, _event.clientY)) {
                    fmvNodes[i].folded = !fmvNodes[i].folded;
                    fmvNodes[0].calculateVisibleChildren();
                    redrawWithoutChildren();
                }
            }
        }
    }
    function onPointerMove(_event) {
        hasMouseBeenMoved = true;
        if (_event.buttons == 1) {
            Freemind.rootNodeY += _event.movementY;
            Freemind.rootNodeX += _event.movementX;
            redrawWithoutChildren();
        }
    }
    let ongoingTouches = [];
    let cordX;
    let cordY;
    function handleStart(_event) {
        _event.preventDefault();
        console.log(" touchstart");
        let theTouchlist = _event.touches;
        for (let i = 0; i < theTouchlist.length; i++) {
            console.log("touchstart:" + i + "...");
            ongoingTouches.push(copyTouch(theTouchlist[i]));
            cordX = theTouchlist[i].clientX;
            cordY = theTouchlist[i].clientY;
            console.log("touchstart:" + i + ".");
        }
    }
    function handleMove(_event) {
        let touches = _event.changedTouches;
        console.log(touches.length);
        for (let i = 0; i < touches.length; i++) {
            let idx = ongoingTouchIndexById(touches[i].identifier);
            console.log(idx + " idx");
            let deltaX;
            let deltaY;
            let xStrich = touches[i].clientX;
            let yStrich = touches[i].clientY;
            deltaX = xStrich - cordX;
            deltaY = yStrich - cordY;
            Freemind.rootNodeX += deltaX;
            Freemind.rootNodeY += deltaY;
            console.log(deltaX, deltaY, cordX, cordY, xStrich, yStrich);
            cordX = xStrich;
            cordY = yStrich;
            redrawWithoutChildren();
            if (idx >= 0) {
                ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
            }
            else {
                console.log("can't figure out which touch to continue");
            }
        }
    }
    function handleEnd(_event) {
        _event.preventDefault();
        let theTouchlist = _event.changedTouches;
        for (var i = 0; i < theTouchlist.length; i++) {
            var idx = ongoingTouchIndexById(theTouchlist[i].identifier);
            if (idx >= 0) {
                console.log(" end of touch");
                ongoingTouches.splice(idx, 1); // remove it; we're done
            }
            else {
                console.log("can't figure out which touch to end");
            }
        }
    }
    function handleCancel(_event) {
        _event.preventDefault();
        console.log("touchcancel.");
        let touches = _event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);
            ongoingTouches.splice(idx, 1); // remove it; we're done
        }
    }
    function copyTouch(touch) {
        return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
    }
    function clearMap() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clears the canvas
    }
    function ongoingTouchIndexById(idToFind) {
        for (let i = 0; i < ongoingTouches.length; i++) {
            let id = ongoingTouches[i].identifier;
            console.log(id + " id");
            if (id == idToFind) {
                return i;
            }
        }
        return -1; // not found
    }
    // parses URL parameters to object
    function getUrlSearchJson() {
        try {
            let j = decodeURI(location.search);
            j = j
                .substring(1)
                .split("&")
                .join("\",\"")
                .split("=")
                .join("\":\"");
            return JSON.parse("{\"" + j + "\"}");
        }
        catch (_e) {
            console.log("Error in URL-Parameters: " + _e);
            return JSON.parse("{}");
        }
    }
})(Freemind || (Freemind = {}));
//# sourceMappingURL=main.js.map