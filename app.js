//jshint esversion:6

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const req = require("express/lib/request");
const res = require("express/lib/response");

const app = express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
//middleware
app.use(express.static("public"));
//app.use(express.json());

app.get("/",(req,res)=>{
    res.render("splicer");
});
app.get("/markers",(req,res)=>{
    res.render("markers");
})
app.get("/about",(req,res)=>{
    res.render("about");
})
let port = process.env.PORT;
if (port==null||port=="") {
    port=3000;
}
app.listen(port,()=>{
    console.log("server is running on port: "+port);
})