//jshint esversion:6

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
//const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
let userLoggedIn = false;
var reqLogin ;
const app = express();
const errorMessage = "";
//dotenv.config({path:"./.env"})
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
//middleware
app.use(express.static(path.join(__dirname+"/public")));
//app.use(express.json());


//SQL DB
const sql = require("msnodesqlv8");

const connectionString = "server=(localdb)\\MSSQLLocalDB;Database=Users;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const query = "SELECT * FROM dbo.users";

sql.query(connectionString, query, (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(rows);
});
/*const btnSignUp = document.getElementById("btnSignUp");
const btnLogIn = document.getElementById("btnLogIn");
const btnForgotPass = document.getElementById("btnForgotPass");
const emailLogIn = document.getElementById("nameLogIn").value;
const passLogIn = document.getElementById("passLogIn").value;
const nameRegister = document.getElementById("nameRegister").value;
const lastNameRegister = document.getElementById("lastNameRegister").value;
const emailRegister = document.getElementById("emailRegister").value;
const passRegister = document.getElementById("passRegister").value;
const passRetypeRegister = document.getElementById("passRetypeRegister").value;*/

//Registration
function registerUser(credentials){
    const insertQuery = "INSERT INTO dbo.users (FirstName,LastName,email,password) VALUES (?,?,?,?)";

    sql.query(connectionString,insertQuery,credentials,(err,result)=>{
        if (err) {
            console.error(err);
            return;
        }else{
            console.log("User registered succesfully!");
            //kayıt sonrası ek işlemler


        }
    })
}

app.post("/register",(req,res)=>{
    const user={

        name:req.body.nameRegister,
        lastname:req.body.lastNameRegister,
        email:req.body.emailRegister,
        pass:req.body.passRegister
    }
    const credentials = [user.name,user.lastname,user.email,user.pass];
    registerUser(credentials);
    res.redirect("/");
})

//login
function loginUser(email, password,res){
    
    const SelectQuery = "SELECT * FROM users WHERE email ='"+email+"' AND password ='"+password+"'";
   
    sql.query(connectionString,SelectQuery,(err,result)=>{
        if (err) {
            console.log(err);
           
                return;
        }else{
 
         if (result.length>0) {
            res.redirect("/");
            console.log("Login Successful");
            userLoggedIn=true;
          }else{
            console.log("Invalid email or password");
            userLoggedIn=false;
          var newerr="Wrong E-mail or Password!";
           res.render("login",{errorMessage:newerr});
            /*return res.status(400).json({
                message:"Wrong E-mail or Password!"
            })*/
        
          }

        }
      
    })
}
app.get("/",(req,res)=>{
    if(userLoggedIn===true){
        res.render("splicer");
    }else{
    res.redirect("/login");
    }
    
});
app.get("/login",(req,res)=>{
    reqLogin=req;
    if(userLoggedIn===true){
        res.redirect("/");
    }else{
    res.render("login",{errorMessage});
    }
})
app.get("/logout",(req,res)=>{
    userLoggedIn=false;
    res.redirect("/login");
})
app.get("/markers",(req,res)=>{
    if(userLoggedIn===true){
        res.render("markers");
    }else{
    res.redirect("/login");
    }
})
app.get("/about",(req,res)=>{
    if(userLoggedIn===true){
        res.render("about");
    }else{
    res.redirect("/login");
    }
})
app.get("/:customRoute",(req,res)=>{
    const requestedRoute = req.params.customRoute;
    if(requestedRoute!="login"||requestedRoute!="markers"||requestedRoute!="logout"||requestedRoute!="splicer"||requestedRoute!="about"){
        res.redirect("/");
    }
})



app.post("/login",(req,res)=>{
    
    const login={
        email:req.body.emailLogIn,
        pass:req.body.passLogIn
    };
    
loginUser(login.email,login.pass,res);

})







let port = process.env.PORT;
if (port==null||port=="") {
    port=3000;
}
app.listen(port,()=>{
    console.log("server is running on port: "+port);
})