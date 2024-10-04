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