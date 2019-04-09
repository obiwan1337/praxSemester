namespace Freemind {

  interface URLObject {
    path: string;
    map: string;
    list: string;
  }
  window.addEventListener("load", init);

  let params: URLObject;
  //let body: HTMLBodyElement = document.getElementsByTagName("body")[0];
  //let list: HTMLElement;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  //let ishidden: boolean = true; // canvas sichtbar bei false

  export let rootNodeX: number;
  export let rootNodeY: number;
  let mindmapData: XMLDocument;
  let docNode: Element; // document node is the first node in a xml file
  let rootNode: Element; // first actual node of the mindmap
  let fmvNodes: FMVNode[];
  let hasMouseBeenMoved: boolean = false;

  //let url: string;

  function init(): void {
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

      } else if (params.list == "false" || !params.list) {

        createCanvas();
        createMindmap();

      }
    });
    //document.getElementById('hideit').addEventListener('click', toggleHide);
    window.addEventListener('resize', resizecanvas, false);


  }
  async function fetchXML(): Promise<void> {
    const response: Response = await fetch('./mm/test.mm');

    const xmlText: string = await response.text();
    mindmapData = StringToXML(xmlText); // Save xml in letiable
  }

  // parses a string to XML
  function StringToXML(xString: string): XMLDocument {
    return new DOMParser().parseFromString(xString, "text/xml");
  }

  function createCanvas(): void {

    canvas = document.getElementsByTagName("canvas")[0];
    /* canvas = document.createElement("canvas");
    canvas.id = "fmcanvas"; */
    canvas.setAttribute("height", "window.innerHeight");
    canvas.setAttribute("width", "window.innerWidth");
    //body.appendChild(canvas);

    ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

    // match Canvas dimensions to browser window
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    // determine the center of the canvas
    rootNodeX = ctx.canvas.width / 2;
    rootNodeY = ctx.canvas.height / 2;

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
  function resizecanvas(): void {
    createCanvas();

    fmvNodes[0].drawFMVNode();

  }

  function createMindmap(): void {
    clearMap();
    fmvNodes.length = 0;

    // create root FMVNode
    let root: FMVNode = new FMVNode(
      null,
      ctx,
      rootNode.getAttribute("TEXT"),
      "root",
      false
    );
    fmvNodes.push(root);

    // Use root FMVNode as starting point and create all subFMVNodes
    createFMVNodes(rootNode, root);
    root.calculateVisibleChildren();
    root.setPosition(0);
    root.drawFMVNode();
    console.log(fmvNodes, " fmvNodes");


  }

  function createFMVNodes(rootNode: Element, parentFMVNode: FMVNode): void {
    // only continue if current root has children
    if (rootNode.hasChildNodes()) {
      let children: Element[] = getChildElements(rootNode);
      // FMVNodes array used for sibling relations
      let childFMVNodes: FMVNode[] = new Array();

      for (let i: number = 0; i < children.length; i++) {
        // use only children with rootNode as parent
        if (children[i].parentElement == rootNode) {
          let fmvNodeContent: string = children[i].getAttribute("TEXT");
          let fmvNodeMapPosition: string = children[i].getAttribute("POSITION");

          if (fmvNodeMapPosition == null) {
            fmvNodeMapPosition = parentFMVNode.mapPosition;
          }

          let fmvNodeFolded: string = children[i].getAttribute("FOLDED");
          let fmvNodeFoldedBool: boolean = fmvNodeFolded == "true" ? true : false;
          let fmvNode: FMVNode = new FMVNode(
            parentFMVNode,
            ctx,
            fmvNodeContent,
            fmvNodeMapPosition,
            fmvNodeFoldedBool
          );
          childFMVNodes.push(fmvNode);
          fmvNodes.push(fmvNode);
          parentFMVNode.children = childFMVNodes;

          // do it all again for all the children of rootNode
          createFMVNodes(children[i], fmvNode);
        }
      }
    } else {
      return;
    }
  }

  function getChildElements(parent: Element): Element[] {
    let childElementsCollection: HTMLCollectionOf<Element>;
    let childElements: Element[] = new Array();
    // get all children of parent as Element collection. Gets ALL children!
    childElementsCollection = parent.getElementsByTagName("node");
    console.log(childElementsCollection.length + "child elementcollection length");
    for (let i: number = 0; i < childElementsCollection.length; i++) {
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

  function keyboardInput(e: KeyboardEvent): void {
    let type: string = e.type;
    let key: string = e.key;
    let code: string = e.code;

    console.log(` yea boy keyboardinput ${type} ${key} ${code}`);
  }
  function onMouseDown(_event: MouseEvent): void {
    hasMouseBeenMoved = false;
  }
  function onMouseUp(_event: MouseEvent): void {
    if (hasMouseBeenMoved) {
      return;
    }
    console.log("mausnichtbewegt");
    if (ctx.isPointInPath(fmvNodes[0].pfadrect, _event.clientX, _event.clientY) && fmvNodes[0].folded) {
      for (let i: number = 0; i < fmvNodes.length; i++) {
        fmvNodes[i].folded = false;
        fmvNodes[0].calculateVisibleChildren();
        redrawWithoutChildren();
      }
    } else {
      for (let i: number = 0; i < fmvNodes.length; i++) {
        if (ctx.isPointInPath(fmvNodes[i].pfadrect, _event.clientX, _event.clientY)) {
          fmvNodes[i].folded = !fmvNodes[i].folded;
          fmvNodes[0].calculateVisibleChildren();
          redrawWithoutChildren();
        }
      }
    }
  }
  function onPointerMove(_event: MouseEvent): void {
    hasMouseBeenMoved = true;
    console.log(_event.buttons);
    console.log(_event.type);
    if (_event.buttons == 1) {
      rootNodeY += _event.movementY;
      rootNodeX += _event.movementX;
      redrawWithoutChildren();
    }
  }
  let ongoingTouches: any[] = [];
  let touchprogress: boolean = false;

  function handleStart(_event: TouchEvent) {
    _event.preventDefault();
    console.log(" touchstart");
    let theTouchlist: TouchList = _event.touches;

    for (let i = 0; i < theTouchlist.length; i++) {
      console.log("touchstart:" + i + "...");
      ongoingTouches.push(copyTouch(theTouchlist[i]));
      console.log(theTouchlist[i].clientX + " touchlistx");
      console.log(theTouchlist[i].clientY + " touchlisty");
      console.log("touchstart:" + i + ".");
    }
  }
  function handleMove(_event: TouchEvent) {
    let touches = _event.changedTouches;
    console.log(touches.length);
    for (let i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);
      console.log(idx + " idx");
      let differenceOfX: number;
      let differenceOfY: number;
      if (touches[i].clientX < rootNodeX && touches[i].clientY < rootNodeY && touchprogress == false) {// X und Y kleiner als rootNode
        differenceOfX = touches[i].clientX - rootNodeX;
        differenceOfY = touches[i].clientY - rootNodeY;
        touchprogress = true;
        console.log(differenceOfX + " difx" + differenceOfY);
      } if (touches[i].clientX > rootNodeX && touches[i].clientY > rootNodeY && touchprogress == false) {// X und Y groesser als rootNode
        differenceOfX = touches[i].clientX - rootNodeX;
        differenceOfY = touches[i].clientY - rootNodeY;
        touchprogress = true;
        console.log(differenceOfX + " difx" + differenceOfY);
      } if (touches[i].clientX > rootNodeX && touches[i].clientY < rootNodeY && touchprogress == false) {// x groesser und Y kleiner als rootNode
        differenceOfX = touches[i].clientX - rootNodeX;
        differenceOfY = touches[i].clientY - rootNodeY;
        touchprogress = true;
        console.log(differenceOfX + " difx" + differenceOfY);
      }
      if (touches[i].clientX < rootNodeX && touches[i].clientY > rootNodeY && touchprogress == false) {// Y groesser und X kleiner als rootNode
        differenceOfX = touches[i].clientX - rootNodeX;
        differenceOfY = touches[i].clientY - rootNodeY;
        touchprogress = true;
        console.log(differenceOfX + " difx" + differenceOfY);
      }
      console.log(differenceOfX + " difx outside of anything" + differenceOfY);
      rootNodeX = differenceOfX + touches[i].clientX;
      rootNodeY = differenceOfY + touches[i].clientY;
      
      if (idx >= 0) {
        console.log(idx + " >= 0 ");

        ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        console.log(".");
      } else {
        console.log("can't figure out which touch to continue");
      }
    }

  }

  function handleEnd(_event: TouchEvent) {
    _event.preventDefault();
    let theTouchlist = _event.changedTouches;
    for (var i = 0; i < theTouchlist.length; i++) {

      var idx = ongoingTouchIndexById(theTouchlist[i].identifier);

      if (idx >= 0) {
        console.log(" end of touch");
        console.log(theTouchlist[i].clientX + " touchlistx");
      console.log(theTouchlist[i].clientY + " touchlisty");console.log()
        ongoingTouches.splice(idx, 1);  // remove it; we're done
        touchprogress = false;
      } else {
        console.log("can't figure out which touch to end");
      }

    }
  }
  function handleCancel(_event: TouchEvent) {
    _event.preventDefault();
    console.log("touchcancel.");
    let touches: TouchList = _event.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      var idx = ongoingTouchIndexById(touches[i].identifier);
      ongoingTouches.splice(idx, 1);  // remove it; we're done
      touchprogress = false;
    }
  }
  function copyTouch(touch: Touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
  }
  function clearMap(): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clears the canvas
  }
  function ongoingTouchIndexById(idToFind: any) {
    for (let i = 0; i < ongoingTouches.length; i++) {
      let id = ongoingTouches[i].identifier;
      console.log(id + " id");
      if (id == idToFind) {
        return i;
      }
    }
    return -1;    // not found
  }
  // parses URL parameters to object
  function getUrlSearchJson(): URLObject {
    try {
      let j: string = decodeURI(location.search);
      j = j
        .substring(1)
        .split("&")
        .join("\",\"")
        .split("=")
        .join("\":\"");
      return JSON.parse("{\"" + j + "\"}");
    } catch (_e) {
      console.log("Error in URL-Parameters: " + _e);
      return JSON.parse("{}");
    }
  }
}