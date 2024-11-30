import {baseUrl,headers} from "./api.js"

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
       
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const messageDiv = document.getElementById('message');
        
       
        if (!email || !senha) {
            messageDiv.textContent = 'Preencha todos os campos!';
            messageDiv.style.color = 'red';
            return;
        }
        
       try {
        var response = await fetch(`${baseUrl}/Usuarios`, {
            headers: headers
        });
   
            
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da API');
            }
            
          
            const usuarios = await response.json();
            
       
            const usuarioEncontrado = usuarios.find(usuario => 
                usuario.email === email && usuario.senha === senha
            );
            
           
            if (usuarioEncontrado) {
              
                messageDiv.textContent = 'Login bem-sucedido!';
                messageDiv.style.color = 'green';
                localStorage.setItem("usuario",usuarioEncontrado.email)
               
                setTimeout(() => {
               
                    if (usuarioEncontrado.nome.toLowerCase() === 'admin') {
                       
                        window.location.href = '/admin';
                    } else {
                       
                        window.location.href = '/admin';
                    }
                }, 1000);
            } else {
               
                messageDiv.textContent = 'Nome ou senha incorretos!';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            
            console.error('Erro de autenticação:', error);
            messageDiv.textContent = 'Ocorreu um erro. Tente novamente mais tarde.';
            messageDiv.style.color = 'red';
        }
    });
}
