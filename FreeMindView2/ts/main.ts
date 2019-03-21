namespace freemind {

    interface URLObject {
      path: string;
      map: string;
      list: string;
    }
    window.addEventListener("load", init);
    let params: URLObject;
    let body: HTMLBodyElement = document.getElementsByTagName("body")[0];
    let list: HTMLElement;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let ishidden: boolean = false; // canvas sichtbar bei false
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
          createList();
          console.log("bin da");
        } else if (params.list == "false" || !params.list) {
          console.log("bin woanders");
          createCanvas();
          createMindmap();
  
        }
      });
      document.getElementById('hideit').addEventListener('click', toggleHide);
    }
    async function fetchXML(): Promise<void> {
      const response: Response = await fetch('./mm/README.mm');
  
      const xmlText: string = await response.text();
      mindmapData = StringToXML(xmlText); // Save xml in variable
    }
  
    // parses a string to XML
    function StringToXML(xString: string): XMLDocument {
      return new DOMParser().parseFromString(xString, "text/xml");
    }
  
    function createList(): void {
      let headline: HTMLElement = document.createElement("h1");
      headline.innerHTML = rootNode.getAttribute("TEXT");
      body.appendChild(headline);
      list = document.createElement("div");
  
      createListElements(rootNode, list);
  
      body.appendChild(list);
    }
  
    function createListElements(root: Element, parent: Element): void {
      if (root.hasChildNodes) {
        let ul: HTMLElement = document.createElement("ul");
  
        parent.appendChild(ul);
        let children: Element[] = getChildElements(root);
  
        for (let i: number = 0; i < children.length; i++) {
          let li: HTMLElement = document.createElement("li");
          li.innerHTML = children[i].getAttribute("TEXT");
          ul.appendChild(li);
  
          if (children[i].childElementCount > 0) {
            //li.addEventListener("click", toggleHide);
            createListElements(children[i], li);
          }
        }
      } else {
        return;
      }
    }
  
    // adds hide style class to first child element
    function toggleHide(): void {
      if (ishidden) {
        document.getElementById('fmcanvas').style.display = 'none';
        ishidden = false;
      } else {
        document.getElementById('fmcanvas').style.display = 'visible';
        ishidden = true;
      }
    }
  
    function createCanvas(): void {
      canvas = document.createElement("canvas");
      canvas.id = "fmcanvas";
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      body.appendChild(canvas);
  
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
      ctx.fillStyle = "#443422";
      ctx.fill;
    }
  
    function createMindmap(): void {
      clearMap();
      fmvNodes.length = 0;
  
      // create root FMVNode
      let root: FMVNode = new FMVNode(
        null,
        ctx,
        rootNode.getAttribute("TEXT"),
        "root"
      );
      fmvNodes.push(root);
      root.drawFMVNode();
  
      // Use root FMVNode as starting point and create all subFMVNodes
      createFMVNodes(rootNode, root);
  
      console.log(fmvNodes);
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
  
            let fmvNode: FMVNode = new FMVNode(
              parentFMVNode,
              ctx,
              fmvNodeContent,
              fmvNodeMapPosition
            );
            childFMVNodes.push(fmvNode);
            fmvNodes.push(fmvNode);
  
            // do it all again for all the children of rootNode
            createFMVNodes(children[i], fmvNode);
          }
        }
  
        // set all current FMVNodes as siblings of each other
        for (let i: number = 0; i < childFMVNodes.length; i++) {
          childFMVNodes[i].siblings = childFMVNodes;
          childFMVNodes[i].drawFMVNode();
        }
  
        /* // draw all FMVNodes
        for (let i: number = 0; i < childFMVNodes.length; i++) {
          childFMVNodes[i].drawFMVNode();
        } */
      } else {
        return;
      }
    }
  
    function getChildElements(parent: Element): Element[] {
      let childElementsCollection: HTMLCollectionOf<Element>;
      let childElements: Element[] = new Array();
      // get all children of parent as Element collection. Gets ALL children!
      childElementsCollection = parent.getElementsByTagName("node");
  
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
  
    function handleMouseMove(e: MouseEvent): void {
      canvasMouseX = e.clientX - offsetX;
      canvasMouseY = e.clientY - offsetY;
      // if the drag flag is set, clear the canvas and draw new
      if (isDragging) {
        clearMap();
        middleX = canvasMouseX;
        middleY = canvasMouseY;
        createMindmap();
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