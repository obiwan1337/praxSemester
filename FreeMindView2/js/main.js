var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var freemind;
(function (freemind) {
    window.addEventListener("load", init);
    let params;
    let body = document.getElementsByTagName("body")[0];
    let list;
    let canvas;
    let ctx;
    let ishidden = false; // canvas sichtbar bei false
    let offsetX;
    let offsetY;
    let canvasMouseX;
    let canvasMouseY;
    let isDragging = false;
    let mindmapData;
    let docNode; // document node is the first node in a xml file
    let rootNode; // first actual node of the mindmap
    let fmvNodes;
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
                createList();
                console.log("bin da");
            }
            else if (params.list == "false" || !params.list) {
                console.log("bin woanders");
                createCanvas();
                createMindmap();
            }
        });
        document.getElementById('hideit').addEventListener('click', toggleHide);
    }
    function fetchXML() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('./mm/README.mm');
            const xmlText = yield response.text();
            mindmapData = StringToXML(xmlText); // Save xml in variable
        });
    }
    // parses a string to XML
    function StringToXML(xString) {
        return new DOMParser().parseFromString(xString, "text/xml");
    }
    function createList() {
        let headline = document.createElement("h1");
        headline.innerHTML = rootNode.getAttribute("TEXT");
        body.appendChild(headline);
        list = document.createElement("div");
        createListElements(rootNode, list);
        body.appendChild(list);
    }
    function createListElements(root, parent) {
        if (root.hasChildNodes) {
            let ul = document.createElement("ul");
            parent.appendChild(ul);
            let children = getChildElements(root);
            for (let i = 0; i < children.length; i++) {
                let li = document.createElement("li");
                li.innerHTML = children[i].getAttribute("TEXT");
                ul.appendChild(li);
                if (children[i].childElementCount > 0) {
                    //li.addEventListener("click", toggleHide);
                    createListElements(children[i], li);
                }
            }
        }
        else {
            return;
        }
    }
    // adds hide style class to first child element
    function toggleHide() {
        if (ishidden) {
            document.getElementById('fmcanvas').style.display = 'none';
            ishidden = false;
        }
        else {
            document.getElementById('fmcanvas').style.display = 'visible';
            ishidden = true;
        }
    }
    function createCanvas() {
        canvas = document.createElement("canvas");
        canvas.id = "fmcanvas";
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        body.appendChild(canvas);
        offsetX = canvas.offsetLeft;
        offsetY = canvas.offsetTop;
        ctx = canvas.getContext("2d");
        // match Canvas dimensions to browser window
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        // determine the center of the canvas
        freemind.middleX = ctx.canvas.width / 2;
        freemind.middleY = ctx.canvas.height / 2;
        // Eventlistener for draggable canvas
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseout", handleMouseOut);
        canvas.addEventListener("touchstart", handleTouchstart);
        canvas.addEventListener("touchmove", handleTouchmove);
        canvas.addEventListener("touchend", handleTouchend);
        ctx.fillStyle = "#443422";
        ctx.fill;
    }
    function createMindmap() {
        clearMap();
        fmvNodes.length = 0;
        // create root FMVNode
        let root = new freemind.FMVNode(null, ctx, rootNode.getAttribute("TEXT"), "root");
        fmvNodes.push(root);
        root.drawFMVNode();
        // Use root FMVNode as starting point and create all subFMVNodes
        createFMVNodes(rootNode, root);
        console.log(fmvNodes);
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
                    let fmvNode = new freemind.FMVNode(parentFMVNode, ctx, fmvNodeContent, fmvNodeMapPosition);
                    childFMVNodes.push(fmvNode);
                    fmvNodes.push(fmvNode);
                    // do it all again for all the children of rootNode
                    createFMVNodes(children[i], fmvNode);
                }
            }
            // set all current FMVNodes as siblings of each other
            for (let i = 0; i < childFMVNodes.length; i++) {
                childFMVNodes[i].siblings = childFMVNodes;
                childFMVNodes[i].drawFMVNode();
            }
            /* // draw all FMVNodes
            for (let i: number = 0; i < childFMVNodes.length; i++) {
              childFMVNodes[i].drawFMVNode();
            } */
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
        for (let i = 0; i < childElementsCollection.length; i++) {
            if (childElementsCollection[i].parentElement == parent) {
                // save only the children with correct parent element
                childElements.push(childElementsCollection[i]);
            }
        }
        return childElements;
    }
    // touch drag handlers
    function handleTouchstart(e) {
        canvasMouseX = e.touches[0].clientX - offsetX;
        canvasMouseY = e.touches[0].clientY - offsetY;
        isDragging = true;
    }
    function handleTouchend(e) {
        canvasMouseX = e.touches[0].clientX - offsetX;
        canvasMouseY = e.touches[0].clientY - offsetY;
        isDragging = true;
    }
    function handleTouchmove(e) {
        canvasMouseX = e.touches[0].clientX - offsetX;
        canvasMouseY = e.touches[0].clientY - offsetY;
        // if the drag flag is set, clear the canvas and draw new
        if (isDragging) {
            clearMap();
            freemind.middleX = canvasMouseX;
            freemind.middleY = canvasMouseY;
            createMindmap();
        }
    }
    // mouse drag handlers
    function handleMouseDown(e) {
        canvasMouseX = e.clientX - offsetX;
        canvasMouseY = e.clientY - offsetY;
        isDragging = true;
    }
    function handleMouseUp(e) {
        canvasMouseX = e.clientX - offsetX;
        canvasMouseY = e.clientY - offsetY;
        isDragging = false;
    }
    function handleMouseOut(e) {
        canvasMouseX = e.clientX - offsetX;
        canvasMouseY = e.clientY - offsetY;
        // user has left the canvas, so clear the drag flag
        isDragging = false;
    }
    function handleMouseMove(e) {
        canvasMouseX = e.clientX - offsetX;
        canvasMouseY = e.clientY - offsetY;
        // if the drag flag is set, clear the canvas and draw new
        if (isDragging) {
            clearMap();
            freemind.middleX = canvasMouseX;
            freemind.middleY = canvasMouseY;
            createMindmap();
        }
    }
    function clearMap() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clears the canvas
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
})(freemind || (freemind = {}));
//# sourceMappingURL=main.js.map