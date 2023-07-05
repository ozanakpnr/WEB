const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({extended:true}));
//middleware
app.use(express.static(__dirname+"/public"));
app.use(express.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
});

let port = process.env.PORT;
if (port==null||port=="") {
    port=3000;
}
app.listen(port,()=>{
    console.log("server is running on port: "+port);
})