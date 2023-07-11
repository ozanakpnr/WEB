const btnLogIn = document.getElementById("btnLogIn");
const formDiv = document.getElementById("formDiv");
const divLoginBg = document.getElementById("divLoginBg");
const btnToggleLogin = document.getElementById("btnToggleLogin");
const divLogIn = document.getElementById("divLogIn");
const divSignUp = document.getElementById("divSignUp");
const navbarToggle = document.getElementById("navbarToggle");


//Login Button

  //close loginpopup when navbartoggle clicked
  /*navbarToggle.addEventListener("click",()=>{
    if (navbarToggle.ariaExpanded==="false"&& formDiv.style.display==="flex") {
      formDiv.style.display="none";
    }
  });*/
  //login switch slide effect
  btnToggleLogin.addEventListener("click",()=>{
    const computedStyle = getComputedStyle(divLoginBg);
    const leftValue = computedStyle.getPropertyValue("left");
    const rightValue = computedStyle.getPropertyValue("right");
    if (leftValue === "0px") {
      divLoginBg.style.right = "0px";
      divLoginBg.style.left = "";
      divSignUp.style.display = "block";
      divLogIn.style.display = "none";
  
    } else if (rightValue === "0px") {
      divLoginBg.style.left = "0px";
      divLoginBg.style.right = "";
      divSignUp.style.display = "none";
      divLogIn.style.display = "block";
  
    }
  });
  