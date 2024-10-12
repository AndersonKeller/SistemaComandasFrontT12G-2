const header ={
    "Accept":"application/json",
    "Content-Type":"application/json"
}

document.addEventListener("DOMContentLoaded", function() {
    const loading = document.querySelector(".loading");
    loading.style.display = "block";
    const form = document.querySelector(".conteiner")
    form.setAttribute("style","filter: blur(7px);")
    setTimeout(function() {
        loading.style.display = "none";
        form.removeAttribute("style") 
    }, 1500);
});

function loginAdmin(){
   
    const form = document.querySelector("form")
    form.addEventListener("submit",(event)=>{
        console.log(event,"event")
        event.preventDefault()
        loginAdminApi()
        
    })
}
loginAdmin()
async function loginAdminApi() {
    
    const name = document.querySelector("#name")
    console.log(name.value)
    const password = document.querySelector("#password")
    console.log(password.value)
    const email = document.querySelector("#email")
    const usuario = {
        nome: name.value,
        email:email.value,
        senha: password.value
    }
    console.log(usuario,"usuario")
    const res = await fetch("https://localhost:7183/api/Usuarios",{
        headers:header,
        method:"POST",
        body:JSON.stringify(usuario)
    })
    const resJson = await res.json()
    console.log(resJson)
}