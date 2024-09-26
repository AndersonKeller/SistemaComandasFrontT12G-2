const backgroundContainer = document.querySelector('.background-container');
const button = document.getElementById('btn-cadastro');

button.addEventListener('mouseover', () => {
    backgroundContainer.style.transform = 'translateY(-200px)';
});

button.addEventListener('mouseout', () => {
    backgroundContainer.style.transform = 'translateY()';
});