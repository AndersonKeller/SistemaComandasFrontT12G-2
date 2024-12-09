  function navegarPara(pagina) 
    {
     window.location.href = pagina;
    }


    const usuarioSalvo = localStorage.getItem("usuario");

    // Função para esconder o botão "Usuário" caso o e-mail não seja admin@admin.com
    function verificarUsuario() {
        const buttonUsuario = document.querySelector('.buttonusuario');
        
        if (usuarioSalvo !== "admin@admin.com") {
            // Esconde o botão se o usuário não for admin
            buttonUsuario.style.display = "none";
        }
    }
    
    // Chama a função assim que a página carregar
    window.onload = verificarUsuario;
