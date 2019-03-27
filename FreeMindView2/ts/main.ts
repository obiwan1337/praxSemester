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
  let offsetX: number;
  let offsetY: number;
  let canvasMouseX: number;
  let canvasMouseY: number;
  let isDragging: boolean = false;

  export let middleX: number;
  export let middleY: number;
  let mindmapData: XMLDocument;
  let docNode: Element; // document node is the first node in a xml file
  let rootNode: Element; // first actual node of the mindmap
  let fmvNodes: FMVNode[];

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
        console.log("bin da");
      } else if (params.list == "false" || !params.list) {
        console.log("bin woanders");
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
    mindmapData = StringToXML(xmlText); // Save xml in variable
  }

  // parses a string to XML
  function StringToXML(xString: string): XMLDocument {
    return new DOMParser().parseFromString(xString, "text/xml");
  }

  function createCanvas(): void {
    console.log("create Canvas started");
    canvas = document.getElementsByTagName("canvas")[0];
    /* canvas = document.createElement("canvas");
    canvas.id = "fmcanvas"; */
    canvas.setAttribute("height", "window.innerHeight");
    canvas.setAttribute("width", "window.innerWidth");
    //body.appendChild(canvas);
    console.log("body hat chilednow");
    offsetX = canvas.offsetLeft;
    offsetY = canvas.offsetTop;

    ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

    // match Canvas dimensions to browser window
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    // determine the center of the canvas
    middleX = ctx.canvas.width / 2;
    middleY = ctx.canvas.height / 2;

    // Eventlistener for draggable canvas
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseOut);
    canvas.addEventListener("touchstart", handleTouchstart);
    canvas.addEventListener("touchmove", handleTouchmove);
    canvas.addEventListener("touchend", handleTouchend);
    canvas.addEventListener("keyboardinput", keyboardInput)
    canvas.addEventListener('click', cords);
  }
  function resizecanvas(): void {
    createCanvas();
  }

  function cords(event: MouseEvent): void {
    console.log(event.offsetX, event.offsetY);
    //bullet.
    let x = event.pageX;
    let y = event.pageY;

    createNewEntry(x, y);

  }
  function createNewEntry(_x: number, _y: number) {
    console.log("did i hit something?");
    for (let i: number; i < fmvNodes.length; i++) {
      console.log(`i ${i}`)
      if (ctx.isPointInPath(fmvNodes[i].pfadrect, _x, _y)) {
        console.log(fmvNodes[i].content + " something has been clicked");
      }
    }
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
    console.log(fmvNodes);
    root.calculateVisibleChildren();console.log("calculated");
    root.setPosition(0);
    //root.drawFMVNode();
    console.log("setpositon");
    for (let i: number = 0; i < fmvNodes.length; i++) {
      fmvNodes[i].drawFMVNode();
      console.log(i);
    }
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
          console.log(fmvNodeMapPosition + " 11 position");
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

  // touch drag handlers
  function handleTouchstart(e: TouchEvent): void {
    canvasMouseX = e.touches[0].clientX - offsetX;
    canvasMouseY = e.touches[0].clientY - offsetY;
    isDragging = true;
  }

  function handleTouchend(e: TouchEvent): void {
    canvasMouseX = e.touches[0].clientX - offsetX;
    canvasMouseY = e.touches[0].clientY - offsetY;
    isDragging = true;
  }

  function handleTouchmove(e: TouchEvent): void {
    canvasMouseX = e.touches[0].clientX - offsetX;
    canvasMouseY = e.touches[0].clientY - offsetY;
    // if the drag flag is set, clear the canvas and draw new
    if (isDragging) {
      clearMap();
      middleX = canvasMouseX;
      middleY = canvasMouseY;
      createMindmap();
    }
  }

  // mouse drag handlers
  function handleMouseDown(e: MouseEvent): void {
    canvasMouseX = e.clientX - offsetX;
    canvasMouseY = e.clientY - offsetY;
    isDragging = true;
  }

  function handleMouseUp(e: MouseEvent): void {
    canvasMouseX = e.clientX - offsetX;
    canvasMouseY = e.clientY - offsetY;
    isDragging = false;
  }

  function handleMouseOut(e: MouseEvent): void {
    canvasMouseX = e.clientX - offsetX;
    canvasMouseY = e.clientY - offsetY;
    // user has left the canvas, so clear the drag flag
    isDragging = false;
  }
  function keyboardInput(e: KeyboardEvent): void {
    let type: string = e.type;
    let key: string = e.key;
    let code: string = e.code;

    console.log(` yea boy keyboardinput ${type} ${key} ${code}`);
  }
  function handleMouseMove(e: MouseEvent): void {

    let dragOffsetX = canvas.getBoundingClientRect().left;
    let dragOffsetY = canvas.getBoundingClientRect().top;
    canvasMouseX = e.clientX - dragOffsetX;
    canvasMouseY = e.clientY - dragOffsetY;
    if (isDragging) {
      console.log("is dragging around");
      clearMap();
      middleX = canvasMouseX //+ relX;
      middleY = canvasMouseY //+ relY;
      fmvNodes[0].setPosition(0);
      for (let i: number = 0; i < fmvNodes.length; i++) {
        fmvNodes[i].drawFMVNode();
        console.log(i);
      }
    }
  }
  function clearMap(): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clears the canvas
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