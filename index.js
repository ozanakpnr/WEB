//SVG DEĞİLDE PİKSEL OLARAK CANVAS ÇİZİM KODLARI
//let canvas = document.getElementById("canvasDrawing");
//var ctx = canvas.getContext("2d");
//ctx.fillStyle="#fff";

//HTML ELEMENT TANIMLAMALARI
const polygon = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "polygon"
);
var pLabel = document.createElement("p");

//HTML MEVCUT ELEMENTLER
const svg = document.getElementById("svgDrawing");
const svgSplices = document.getElementById("svgSplices");
const canvas = document.getElementById("canvasDiv");
const subDiv = document.getElementById("subDiv");
const fileRatioSelector = document.getElementById("fileRatio");
const cboxLabel = document.getElementById("cboxLabel");
const cboxFlipX = document.getElementById("cboxFlipX");
const cboxFlipY = document.getElementById("cboxFlipY");




//VARIABLES
let filecontent = "";
let xmax = 0;
let ymax = 0;
let ratio = 0.1;
let polyPoints = "";
let lblPoints = "";
let fileName = "";
let cutInfo = []; //CUT FILE SPLITTED
let Coords = [];
let polyCoords = [];
let lblInfo = [];
let rects = [];


//DOSYA ORANI DEĞİŞTİ BİLGİSİ
fileRatioSelector.addEventListener("change", function () {
  ratio = fileRatioSelector.value;
});
// X DÖNDÜR
cboxFlipX.addEventListener("change", () => {

  if (cboxFlipX.checked && !cboxFlipY.checked) {
      svg.style.transform = "scaleX(-1) scaleY(1)";
  } else if (!cboxFlipX.checked && cboxFlipY.checked) {
      svg.style.transform = "scaleX(1) scaleY(-1)";
  } else if (!cboxFlipX.checked && !cboxFlipY.checked) {
      svg.style.transform = "scaleX(1) scaleY(1)";
  } else if (cboxFlipX.checked && cboxFlipY.checked) {
      svg.style.transform = "scaleX(-1) scaleY(-1)";
  }
});
//Y Döndür
cboxFlipY.addEventListener("change", () => {
 
  if (cboxFlipX.checked && !cboxFlipY.checked) {
      svg.style.transform = "scaleX(-1) scaleY(1)";
  } else if (!cboxFlipX.checked && cboxFlipY.checked) {
      svg.style.transform = "scaleX(1) scaleY(-1)";
  } else if (!cboxFlipX.checked && !cboxFlipY.checked) {
      svg.style.transform = "scaleX(1) scaleY(1)";
  } else if (cboxFlipX.checked && cboxFlipY.checked) {
      svg.style.transform = "scaleX(-1) scaleY(-1)";
  }
});
//ETİKET BİLGİSİ SWITCH
cboxLabel.addEventListener("change", function () {
  let lblDivs = document.querySelectorAll(".lblElement");
  if (cboxLabel.checked) {
    lblDivs.forEach(function (element) {
      element.style.display = "inline";
    });
  } else {
    lblDivs.forEach(function (element) {
      element.style.display = "none";
    });
  }
});

//PASTAL FARE TEKERLEĞİ İLE YAKINLAŞMA
var scale = 1;
subDiv.style.scale = 1;
canvas.addEventListener("mousewheel", function (event) {
  event.preventDefault();
  var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
  var mouseX = event.clientX - this.offsetLeft;
  var mouseY = event.clientY - this.offsetTop;
  scale += delta * 0.1;
  scale = Math.max(1, Math.min(4, scale));
  var offsetX = (mouseX - this.clientWidth / 2) * (scale - 1);
  var offsetY = (mouseY - this.clientHeight / 2) * (scale - 1);
  subDiv.style.transformOrigin = mouseX + "px " + mouseY + "px";
  subDiv.style.transform = "scale(" + scale + ")";
});


function SelectFile() {
  //SVG CHILD ELEMENTLERI SIFIRLA
  let lblDivs = document.querySelectorAll(".lblElement");
  lblDivs.forEach(function (element) {
    element.remove();
  });
  svg.innerHTML = "";
  subDiv.style.scale = 1;

  //DEĞİŞKENLERİ SIFIRLA
  filecontent = "";
  xmax = 0;
  ymax = 0;
  polyPoints = "";
  lblPoints = "";
fileName = "";
  cutInfo = [];
  Coords = [];
  lblCoords = [];
  polyCoords = [];
  lblInfo = [];
  rects = [];


  //SANAL INTPUT OLUŞTUR VE ONCHANGE EVENTİ İLE DOSYAYI YAKALA
  let input = document.createElement("input");
  input.type = "file";
  input.onchange = (_) => {
    fileName = input.files[0].name;

    //PASTAL ÇİZİM
    DrawPolies(input.files[0]);
  };
  input.click();
}

function DrawPolies(file) {
  var reader = new FileReader();
  var selectedFile = reader.readAsText(file);

  reader.onload = function (evt) {
    const rawFileContent = evt.target.result;
    const fileContent = rawFileContent.replace(/[\r\n]/g, "");
    cutInfo = fileContent.split("*");
    filecontent = fileContent;
    ProcessCutFile();
    createSplicePoints();

    //xmax ve ymax bul
    polyCoords.forEach((element) => {
      for (let index = 0; index < element.length; index++) {
        if (ymax < parseInt(element[index][1])) {
          ymax = parseInt(element[index][1]);
        }
        if (xmax < parseInt(element[index][0])) {
          xmax = parseInt(element[index][0]);
        }
      }
    });

    document.getElementById("markerName").innerHTML = "Name: " + fileName;
    document.getElementById("markerLength").innerHTML =
      "Length: " + (xmax * ratio).toFixed(2) + " mm";
    document.getElementById("markerWidth").innerHTML =
      "Width: " + (ymax * ratio).toFixed(2) + " mm";

    //Boyutlandırma oranı
    //const scaleRatio = canvas.height/ymax;
    const scaleRatio = svg.height.animVal.value / ymax;
    svg.style.width = xmax * scaleRatio;

    //Scaled
    const unscaledPolyCoords=polyCoords;
    polyCoords.forEach((element) => {
      for (let index = 0; index < element.length; index++) {
        const x = parseInt(element[index][0]);
        const y = parseInt(element[index][1]);
        const scaledX = x * scaleRatio;
        const scaledY = y * scaleRatio;
        element[index] = [scaledX, scaledY];
        //canvas.style.width=scaledX;
      }
    });
   
    for (let i = 0; i < polyCoords.length; i++) {
      const element = polyCoords[i];
      polyPoints = "";
      // moveTo(element[0][0],element[0][1]);
      //ctx.beginPath();
      for (let index = 0; index < element.length; index++) {
        let xCoord = element[index][0];
        let yCoord = element[index][1];
        //ctx.lineTo(xCoord,yCoord);
        polyPoints += xCoord + "," + yCoord + " ";
      }
      const poly = polygon.cloneNode(true);
      svg.appendChild(poly);
      poly.setAttribute("points", polyPoints);

      poly.addEventListener("click", function (evt) {
        const selectedPoly = evt.target;
        if (selectedPoly.style.fill === "green") {
          selectedPoly.style.fill = "lightgray";
        } else {
          selectedPoly.style.fill = "green";
        }
      });
      //ETIKET BİLGİSİ VAR İSE KARELERI OLUŞTUR
      if (lblCoords.length != 0) {
        const p = pLabel.cloneNode(true);
        subDiv.appendChild(p);
        p.classList.add("lblElement");
        p.innerHTML = "<pre>" + lblInfo[i].replace(/ /g, "\n") + "</pre>";
        p.style.zIndex = 2;
        p.style.top = lblCoords[i][1] * scaleRatio + "px";
        p.style.left = lblCoords[i][0] * scaleRatio + "px";
        if (cboxLabel.checked) {
          p.style.display = "inline";
        } else {
          p.style.display = "none";
        }
      }

      //ctx.closePath();
      //ctx.fill();
    }
    addRectangles();
  };

  reader.onerror = function (evt) {
    document.getElementById("fileContent").innerHTML = "error reading the file";
  };
}

function addRectangles() {    
    var svgns = "http://www.w3.org/2000/svg";
    const scaleRatio = svg.height.animVal.value / ymax;
    for (let i = 0; i <spreadingPoints.length; i++) {
        var rect = document.createElementNS(svgns, 'rect');
        rect.setAttribute('x', spreadingPoints[i]*scaleRatio*10);
        rect.setAttribute('y', 0);
        rect.setAttribute('height', ymax*scaleRatio);
        rect.setAttribute('width', 2);
        rect.setAttribute('fill', '#59ADFF');

        var rect2 = document.createElementNS(svgns, 'rect');
        rect2.setAttribute('x', cutPoints[i]*scaleRatio*10);
        rect2.setAttribute('y', 0);
        rect2.setAttribute('height', ymax*scaleRatio);
        rect2.setAttribute('width', 2);
        rect2.setAttribute('fill', '#FC4850');
        
        rect.style.zIndex = 12;
        rect2.style.zIndex = 12;
        svg.appendChild(rect);
        svg.appendChild(rect2);
    }
    
  }

function ParseCutFile() {
  let piececount = 0;
  let nwords = cutInfo.filter((a) => a.startsWith("N"));
  cutInfo = [];
  let pieceindex = 0;
  for (let i = 1; i < nwords.length + 1; i++) {
    var result = nwords.find((a) => a === "N" + i.toString());
    if (result != null) {
      piececount = i;
    }
  }

  let coordinates = [];

  for (let i = 1; i < piececount; i++) {
    var coords1 = filecontent.split("*N" + i.toString() + "*");
    var coords2 = coords1[1].split("*N" + (i + 1).toString() + "*");
    var coords = coords2[0];
    coordinates.push(coords);
  }

  for (let i = 0; i < coordinates.length; i++) {
    var parsedcoords = coordinates[i].split("*");
    var indexes = [];
    var d2count = parsedcoords.filter((a) => a === "D2").length;
    if (d2count > 1) {
      for (let j = 0; j < parsedcoords.length; j++) {
        if (parsedcoords[j] === "D2") {
          indexes.push(j);
        }
      }
      parsedcoords.splice(indexes[0], indexes[1]);
    }

    cutInfo.push("N" + (pieceindex + 1));
    for (let index = 0; index < parsedcoords.length; index++) {
      cutInfo.push(parsedcoords[index]);
    }
    pieceindex++;
  }
}

function ProcessCutFile() {
  //const startIndex = cutInfo.indexOf("N1");

  for (i = 0; cutInfo[i] != "M0"; i++) {
    if (cutInfo[i].startsWith("N") && cutInfo[i].length < 6) {
      for (
        let k = i + 1;
        !cutInfo[k].startsWith("N") && cutInfo[k] != "M0";
        k++
      ) {
        //POLYGON KOORDİNATLARI
        if (cutInfo[k] === "M14") {
          let j = k + 1;
          while (cutInfo[j] !== "M15") {
            if (
              (cutInfo[j].startsWith("X") || cutInfo[j].startsWith("Q")) &&
              !cutInfo[j].includes("M31")
            ) {
              let x = cutInfo[j].split("Y")[0].split("X")[1];
              let y = cutInfo[j].split("Y")[1];
              let actCoord = [x, y];
              Coords.push(actCoord);
            }

            if (cutInfo[j] === "M0") {
              break;
            }
            j++;
          }
        }
      }
      polyCoords.push(Coords);
      Coords = [];
    }

    //ETIKET BILGISI VAR
    if (cutInfo[i].includes("M31")) {
      lblInfo.push(cutInfo[i + 1]);
      if (cutInfo[i].includes("X") && cutInfo[i].includes("Y")) {
        let lblx = cutInfo[i].split("Y")[0].split("X")[1];
        let lbly = cutInfo[i].split("Y")[1].split("M")[0];
        let lblCoord = [lblx, lbly];
        lblCoords.push(lblCoord);
      }
    }
  }
}

function getRectangles(){
    for (let i = 0; i < polyCoords.length; i++) {
        var xmaxRect = 0;
        var ymaxRect= 0;
        var xminRect = Number.MAX_VALUE;
        var yminRect=Number.MAX_VALUE;
        var indexedPoly = polyCoords[i];
        for (let j = 0; j < indexedPoly.length; j++) {
            var item = indexedPoly[j];

          
                if(parseFloat(item[0])<xminRect)
              {
                  xminRect = parseFloat(item[0]);
              }
              
  
                    if(parseFloat(item[1])<yminRect){
                      yminRect=parseFloat(item[1]);
                  }
                  
          
            if(parseFloat(item[0])>xmaxRect)
            {
                xmaxRect = parseFloat(item[0]);
            }

            if(parseFloat(item[1])>ymaxRect){
                ymaxRect= parseFloat(item[1]);
            }
            
        }
        var rect = new Rect(Math.round(xminRect*ratio),Math.round(yminRect*ratio),Math.round(xmaxRect*ratio),Math.round(ymaxRect*ratio));
        rects.push(rect);
    }
}



function createSplicePoints(){
    var offsetreff = 0;
    var bionceki = 0;
    getRectangles();
   // var maxx = Math.max(...rects.map(a=>a.right));
   // var maxy = Math.max(...rects.map(a=>a.bottom));
    var prevoffsetref = 0;
    var offset = 10;
    var spreadingpoints= [];
    var cutpoints= [];

    for (let i = 0; i < rects.length*100;) {
        var firstrecs = rects.filter(a=>a.left <= offsetreff && a.left >= prevoffsetref);
        var maxwidthfirstrecs = Math.max(...firstrecs.map(a=>a.width));
        var rec = firstrecs.find(a=>a.width == maxwidthfirstrecs);
        if(rec ==null){
            offsetreff += offset;
            prevoffsetref =0;
        }
        else{
            var krec = new Rect(rec.right+offset,0,rec.right+offset,Number.MAX_VALUE);
             var srecs = rects.filter(a=>intersectRect(a,krec));
           if(srecs.length === 0){
                offsetreff += offset;
            }
          
            else{
                var srecsminleft = Math.min(...srecs.map(a=>a.left));
                var srec = srecs.find(a=>a.left == srecsminleft);
                if(bionceki>srec.left){
                    offsetreff += offset;
                }
                else{
                    if(cutpoints.includes(rec.right)||spreadingpoints.includes(srec.left)){
                        bionceki = offsetreff;
                        offsetreff = srec.left+1;
                        prevoffsetref = bionceki;
                    }
                    else{
                        cutpoints.push(rec.right);
                        spreadingpoints.push(srec.left);
                        bionceki = offsetreff;
                        offsetreff = srec.left;
                        prevoffsetref = bionceki;
                    }
                }
            }
            
        }
        i++;
    }

    var serimatilacaklar = [];
    var kesimatilacaklar = [];
    var tempx = [];
    var tempy=[];

    for (let i = 1; i < spreadingpoints.length; i++) {
        if (spreadingpoints[i]<cutpoints[i-1]) {
            if (cutpoints[i - 1] - spreadingpoints[i - 1] >= cutpoints[i] - spreadingpoints[i])
            {
                tempx.push(cutpoints[i - 1]);
                tempy.push(spreadingpoints[i - 1]);

            }
            else
            {
                tempx.push(cutpoints[i]);
                tempy.push(spreadingpoints[i]);
            }
            
        }
        
    }
    spreadingpoints = spreadingpoints.filter(item=>!tempy.includes(item));
    cutpoints = cutpoints.filter(item=>!tempx.includes(item));
 
   /*tempy.forEach(element => {
        var index = spreadingpoints.indexOf(element);
        spreadingpoints.splice(index,1);
    });
    tempx.forEach(element=>{
        var index = cutpoints.indexOf(element);
        cutpoints.splice(index,1);
    }); */

    var rawspreadingpoints = spreadingpoints;
    var rawcutpoints = cutpoints;

    for (let i = 0; i < spreadingpoints.length; i++) {
        if(cutpoints[i]-spreadingpoints[i]<0 || cutpoints[i]-spreadingpoints[i]>=7000){
            serimatilacaklar.push(spreadingpoints[i]);
            kesimatilacaklar.push(cutpoints[i]);
        }
        
    }
    serimatilacaklar.forEach(element => {
        var index = spreadingpoints.indexOf(element);
        spreadingpoints.splice(index,1);
    });
    kesimatilacaklar.forEach(element=>{
        var index = cutpoints.indexOf(element);
        cutpoints.splice(index,1);
    }); 
    spreadingPoints = spreadingpoints;
    cutPoints = cutpoints;
}


class Rect{
    constructor(xStart,yStart,xEnd,yEnd)
    {
        this.left = xStart;
        this.top = yStart;
        this.width = xEnd-xStart;
        this.height = yEnd-yStart;
        this.right = xEnd;
        this.bottom = yEnd;

    }
}
function intersectRect(r1, r2) {
    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top > r1.bottom ||
             r2.bottom < r1.top);
  }

 