//SVG DEĞİLDE PİKSEL OLARAK CANVAS ÇİZİM KODLARI
//let canvas = document.getElementById("canvasDrawing");
//var ctx = canvas.getContext("2d");
//ctx.fillStyle="#fff";

//HTML ELEMENT TANIMLAMALARI
const polygon= document.createElementNS("http://www.w3.org/2000/svg","polygon");
var pLabel = document.createElement('p');

//HTML MEVCUT ELEMENTLER
const svg = document.getElementById("svgDrawing");
const canvas = document.getElementById("canvasDiv");
const subDiv = document.getElementById("subDiv");
const fileRatioSelector = document.getElementById("fileRatio");
const cboxLabel=document.getElementById("cboxLabel");

//VARIABLES

let xmax=0 ;
let ymax=0 ;
let ratio=0.1;
let polyPoints="";
let lblPoints="";
let fileName="";
let cutInfo=[]; //CUT FILE SPLITTED 
let Coords=[]; 
let polyCoords =[];
let lblInfo = [];

//DOSYA ORANI DEĞİŞTİ BİLGİSİ
fileRatioSelector.addEventListener("change",function(){
    ratio = fileRatioSelector.value;
})

//ETİKET BİLGİSİ SWITCH
cboxLabel.addEventListener("change",function(){
    let lblDivs=document.querySelectorAll(".lblElement");
    if (cboxLabel.checked) {
        lblDivs.forEach(function(element){
            element.style.display="inline";
        })
    }else{
        lblDivs.forEach(function(element){
            element.style.display="none";
        })
    }
    

   
});

//PASTAL FARE TEKERLEĞİ İLE YAKINLAŞMA
let scale =1;
subDiv.style.scale=1;
canvas.addEventListener("mousewheel",function(event){
event.preventDefault();
var delta =Math.max(-1,Math.min(1,event.wheelDelta || -event.detail));
var mouseX = event.clientX - this.offsetLeft;
  var mouseY = event.clientY - this.offsetTop;
    scale+=delta*0.1;
    scale = Math.max(1,Math.min(4,scale));
    var offsetX = (mouseX - this.clientWidth / 2) * (scale - 1);
    var offsetY = (mouseY - this.clientHeight / 2) * (scale - 1);
    subDiv.style.transformOrigin = mouseX + 'px ' + mouseY + 'px';
    subDiv.style.transform = 'scale(' + scale + ')';

});

function SelectFile(){
    //SVG CHILD ELEMENTLERI SIFIRLA
   let lblDivs=document.querySelectorAll(".lblElement");
   lblDivs.forEach(function(element){
    element.remove();
   })
    svg.innerHTML="";
    subDiv.style.scale=1;
    
    //DEĞİŞKENLERİ SIFIRLA
    xmax=0 ;
    ymax=0 ;
    polyPoints="";
    lblPoints="";
    cutInfo=[];
    Coords=[];
    lblCoords=[];
    polyCoords=[];
    lblInfo = [];

    
    //SANAL INTPUT OLUŞTUR VE ONCHANGE EVENTİ İLE DOSYAYI YAKALA
    let input = document.createElement("input");
    input.type="file";
    input.onchange=_=>{
        fileName= input.files[0].name;

    //PASTAL ÇİZİM    
    DrawPolies(input.files[0])
};
input.click();
};

function DrawPolies(file){

    var reader = new FileReader();
    var selectedFile= reader.readAsText(file,"UTF-8");
    
    reader.onload=function(evt){
       const rawFileContent =evt.target.result;
       const fileContent = rawFileContent.replace(/[\r\n]/g,"");
       cutInfo= fileContent.split("*");
        processCutFile();

        
      //xmax ve ymax bul
      polyCoords.forEach(element => {
        for (let index = 0; index < element.length; index++) {
            if (ymax<parseInt(element[index][1])) {
                ymax = parseInt(element[index][1]);                
            }
            if (xmax<parseInt(element[index][0])) {
                xmax=parseInt(element[index][0]);
            }
        }
      });

      document.getElementById("markerName").innerHTML="Name: "+fileName;
      document.getElementById("markerLength").innerHTML="Length: "+(xmax*ratio).toFixed(2)+" mm";
      document.getElementById("markerWidth").innerHTML="Width: "+(ymax*ratio).toFixed(2)+" mm";

        //Boyutlandırma oranı
        //const scaleRatio = canvas.height/ymax;
        const scaleRatio = svg.height.animVal.value/ymax;
        svg.style.width=xmax*scaleRatio;

        //Scaled 
       polyCoords.forEach(element => {
    for (let index = 0; index < element.length; index++) {
        const x = parseInt(element[index][0]);
        const y = parseInt(element[index][1]);
        const scaledX=x*scaleRatio;
        const scaledY=y*scaleRatio;
        element[index]=[scaledX,scaledY];
        //canvas.style.width=scaledX;
 
    }
});
     
       
         for (let i= 0; i < polyCoords.length; i++) {
            const element = polyCoords[i];
            polyPoints ="";
           // moveTo(element[0][0],element[0][1]);
            //ctx.beginPath();
            for (let index = 0; index < element.length; index++) {
                let xCoord = (element[index][0]);
                let yCoord = (element[index][1]);           
                //ctx.lineTo(xCoord,yCoord);
                polyPoints+=xCoord+","+yCoord+" ";
            }
            const poly = polygon.cloneNode(true);
            svg.appendChild(poly);
            poly.setAttribute("points",polyPoints);
            poly.addEventListener("click",function(evt){
                const selectedPoly = evt.target;
                if (selectedPoly.style.fill==="green") {
                    selectedPoly.style.fill="lightgray";
                }else{
                    selectedPoly.style.fill="green";
                }
    
            })
            //ETIKET BİLGİSİ VAR İSE KARELERI OLUŞTUR
            if (lblCoords.length!=0) {
                const p = pLabel.cloneNode(true);
            subDiv.appendChild(p);
            p.classList.add("lblElement");
            p.innerHTML="<pre>" + lblInfo[i].replace(/ /g, "\n") + "</pre>";
            p.style.zIndex=2;
            p.style.top=lblCoords[i][1]*scaleRatio+"px";
            p.style.left=lblCoords[i][0]*scaleRatio+"px";
            if (cboxLabel.checked) {
                p.style.display="inline";
            }else{p.style.display="none";}
            }
            
            //ctx.closePath();        
            //ctx.fill();
         }
        
       }
      
    reader.onerror=function(evt){
        document.getElementById("fileContent").innerHTML="error reading the file";
    }
  
}

function processCutFile()
{
    const startIndex = cutInfo.indexOf("N1");
    for (i=startIndex; (cutInfo[i]!="M0")&&(i<cutInfo.length); i++) {
     if (cutInfo[i].startsWith("N")) {
         let k=i+1;
         for (k; ((!cutInfo[k].startsWith("N"))&&(cutInfo[k]!="M0")&&(k+1<cutInfo.length)); k++) {
             //ETIKET BİLGİSİ YOK
             if (!cutInfo[k].includes("M31")) {
          
                 if (cutInfo[k].startsWith("X")||cutInfo[k].startsWith("Q")) {
                     if ((!cutInfo[k-1].startsWith("M"))||(!cutInfo[k+1].startsWith("M"))) {
                         let x = (cutInfo[k].split("Y")[0]).split("X")[1];
                         let y = (cutInfo[k].split("Y")[1]);
                         let actCoord = [x,y];
                          Coords.push(actCoord);
                     }
                   
                  } 
              } 
              //ETIKET BILGISI VAR
              else{
                   lblInfo.push(cutInfo[k+1]);
                 if (cutInfo[k].includes("X")&&cutInfo[k].includes("Y")) {
                    let lblx=(cutInfo[k].split("Y")[0]).split("X")[1];
                    let lbly=(cutInfo[k].split("Y")[1].split("M")[0]);
                    let lblCoord = [lblx,lbly];
                    lblCoords.push(lblCoord);
                 }
             
              }
          }
         
          polyCoords.push(Coords);
       Coords=[];
    
     }
     }
}


