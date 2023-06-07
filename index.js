let Coords=[]; 
let polyCoords =[];
//let canvas = document.getElementById("canvasDrawing");
let svg = document.getElementById("svgDrawing");
const polygon= document.createElementNS("http://www.w3.org/2000/svg","polygon");
const fileRatioSelector = document.getElementById("fileRatio");
let xmax=0 ;
let ymax=0 ;
let polyPoints="";
let ratio=0.1;
let fileName="";

//var ctx = canvas.getContext("2d");
//ctx.fillStyle="#fff";


fileRatioSelector.addEventListener("change",function(){
    ratio = fileRatioSelector.value;
})

function SelectFile(){
    svg.innerHTML="";
   xmax=0 ;
     ymax=0 ;
     polyPoints="";
        Coords=[];
        polyCoords=[];
let input = document.createElement("input");
input.type="file";
input.onchange=_=>{
   fileName= input.files[0].name;
    DrawPolies(input.files[0])
};
input.click();
};


function DrawPolies(file){

    var reader = new FileReader();
    var selectedFile= reader.readAsText(file,"UTF-8");
    
    reader.onload=function(evt){
      
       const rawFileContent =evt.target.result;
const fileContent = rawFileContent.replace(/\n/g,"");
      // document.getElementById("fileContent").innerHTML= fileContent.split("*");
       var cutInfo= fileContent.split("*");
       const startIndex = cutInfo.indexOf("N1");
       for (i=startIndex; cutInfo[i]!="M0"; i++) {
        if (cutInfo[i].startsWith("N")) {
            let k=i+1;
            for (k; ((!cutInfo[k].startsWith("N"))&&(cutInfo[k]!="M0")); k++) {
             if (!cutInfo[k].includes("M31")) {
             
                    if (cutInfo[k].startsWith("X")||cutInfo[k].startsWith("Q")) {
                        let x = (cutInfo[k].split("Y")[0]).split("X")[1];
                        let y = (cutInfo[k].split("Y")[1]);
                        let actCoord = [x,y];
                         Coords.push(actCoord);
                     }
                
                
                 }
             }
            
             polyCoords.push(Coords);
          Coords=[];
       
        }
        }

        
      
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


        //const scaleRatio = canvas.height/ymax;
        const scaleRatio = svg.height.animVal.value/ymax;
        
        svg.style.width=xmax*scaleRatio;
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
         
            //ctx.closePath();        
            //ctx.fill();
         }
            
 
       }
      
    reader.onerror=function(evt){
        document.getElementById("fileContent").innerHTML="error reading the file";
    }
  
}


