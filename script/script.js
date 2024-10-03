document.addEventListener("DOMContentLoaded", function() {
    const loadingAnimation = document.querySelector(".loading-animation");
    loadingAnimation.style.display = "block";
    setTimeout(function() {
        loadingAnimation.style.display = "none";
    }, 3000);
});