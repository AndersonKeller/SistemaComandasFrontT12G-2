import {baseUrl} from "./api.js"
export const headers ={
    Accept:"application/json",
    "Content-Type":"application/json"
}   
 

function renderizarUsuarios(usuarios) {
    const grid = document.querySelector('#users-grid');
    grid.innerHTML = '';
    const body = document.querySelector("body")
    
    usuarios.forEach(usuario => {
    const card = document.createElement('div');
    card.className = 'user-card';
        card.insertAdjacentHTML("beforeend", `
            <div id=${usuario.id} class="user-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
            </div>
            <div class="user-name">${usuario.nome}</div>
          
        `);
        
        grid.appendChild(card);
        const cardUser = document.getElementById(usuario.id)

        cardUser.addEventListener('click', () => {mostrarModal(usuario)});
    });
}

function mostrarModal(usuario) {
    console.log(usuario, "usuario");

    // Criação do modal no body
    document.body.insertAdjacentHTML("beforeend", `
        <div id="userModal" class="modal">
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>Informações do Usuário</h2>
                <div class="form-group">
                    <label>Nome:</label>
                    <input type="text" id="userNome" readonly>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="text" id="userEmail" readonly>
                </div>
                <div class="form-group">
                    <label>Senha:</label>
                    <input type="password" id="userSenha" readonly>
                </div>
                ${usuario.email !== 'admin@admin.com' ? `
                    <div>
                        <button class="btnExcluirUsuario">Excluir Usuario</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `);

    const modal = document.getElementById('userModal');
    console.log(modal);  // Verifique se o modal está sendo inserido corretamente

    // Preenche os campos do modal com os dados do usuário
    document.getElementById('userNome').value = usuario.nome;
    document.getElementById('userEmail').value = usuario.email;
    document.getElementById('userSenha').value = usuario.senha;

    modal.style.display = 'flex';

    // Fechar o modal ao clicar fora da área do modal
    window.addEventListener('click', (event) => {
        console.log("Clicou no evento de fechar modal");  // Depuração
        if (event.target === modal) {
            console.log("Clicou fora do modal");  // Depuração
            modal.remove(); // Fecha o modal ao clicar fora
        }
    });

    // Fechar o modal ao clicar no "X"
    const btnClose = document.querySelector(".close-btn");
    btnClose.addEventListener("click", () => {
        console.log("Clicou no botão de fechar");  // Depuração
        modal.remove(); // Fecha o modal ao clicar no "X"
    });

    // Só adiciona o evento de excluir se não for admin
    if (usuario.email !== 'admin@admin.com') {
        const botaoRemover = document.querySelector(".btnExcluirUsuario");
        botaoRemover.addEventListener("click", () => {
            excluirUsuario(usuario.id);
            modal.remove(); // Fecha o modal imediatamente após excluir
            setTimeout(() => {
                location.reload(); // Recarrega a página após um tempo
            }, 1000);
        });
    }
}


// Iniciar aplicação
carregarUsuarios();

//Botao de voltar
const botaoDeVoltar = document.querySelector("img")
botaoDeVoltar.addEventListener('click', () => {
 window.location.href = "../admin/index.html"
   
});


function modalNovoUsuario() {
    // Remove any existing modal first
    const existingModal = document.getElementById("userModal");
    if (existingModal) {
        existingModal.remove();
    }

    const body = document.querySelector("body");

    body.insertAdjacentHTML("beforeend", `
        <div id="userModal" class="modal">
            <div class="modal-content-cadastro">
                <span class="close-btn">&times;</span>
                <div class="conteiner-form-cadastro">
                    <h2>Cadastro de Usuário</h2>
                    <form id="formNovoUsuario">
                        <div class="form-group">
                            <label for="userNome">Nome de Usuário
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                </svg>
                            </label>
                            <input type="text" id="userNome" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="userEmail">E-mail
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                                </svg>
                            </label>
                            <input type="email" id="userEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="userSenha">Senha
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>
                                </svg>
                            </label>
                            <input type="password" id="userSenha" name="password" required>
                        </div>
                        <button type="submit" class="submit-btn">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    `);

    const modal = document.getElementById("userModal");
    const btnClose = modal.querySelector(".close-btn");
    const form = document.getElementById("formNovoUsuario");

    // Fechar o modal ao clicar no "X"
    btnClose.addEventListener("click", () => {
        modal.remove(); // Remove o modal
    });

    // Fechar o modal ao clicar fora da área do modal
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Quando o formulário for enviado, criamos o usuário e fechamos o modal
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById("userNome").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const senha = document.getElementById("userSenha").value;

        if (nome && email && senha) {
            const novoUsuario = { nome, email, senha };
            await addUsuario(novoUsuario);  // Função para adicionar usuário via API
            modal.remove();  // Fecha o modal após cadastro

            // Recarrega os usuários para exibir o novo
            setTimeout(() => {
                location.reload();
            }, 1000);  // Espera 1 segundo para atualizar os usuários
        }
    });
}

// Ensure this event listener is added after the DOM is loaded
const btnAddUsuario = document.querySelector(".addUsuario");
btnAddUsuario.addEventListener("click", () => {
    modalNovoUsuario();  // Abre o modal de cadastro
});


document.addEventListener('DOMContentLoaded', () => {
    const btnmodal = document.querySelector(".close-btn");
    if (btnmodal) {
        btnmodal.addEventListener("click", () => {
            console.log("click");
            const modal = document.querySelector(".modal");
            if (modal) {
                modal.remove();
            }
        });
    }
});


function verificaNovoUsuario(){
    console.log("entrou no verifica")
    const nome =  document.getElementById("userNome");
    const email =  document.getElementById("userEmail");
    const senha =  document.getElementById("userSenha");

    let nomeUsuario = nome.value.trim(); //trim retira os espacos no inicio e final do input
    let emailUsuario = email.value.trim(); //trim retira os espacos no inicio e final do input
    let senhaUsuario = senha.value

    if (nomeUsuario && (senhaUsuario) && emailUsuario) {
        const novoUsuario = {nome: nomeUsuario, email: emailUsuario, senha: senhaUsuario}

        addUsuario(novoUsuario)
        nomeUsuario = '';
        emailUsuario = '';
        senhaUsuario = '';
    }
}


async function addUsuario(novoUsuario) {
    const res = await fetch(`${baseUrl}/Usuarios`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(novoUsuario)
    });

    const resJson = await res.json();
    console.log(resJson);
}

async function excluirUsuario(id) { //funcao que exclui Usuario
    const res = await fetch(`${baseUrl}/Usuarios/${id}`, {
        method: "DELETE",
        headers: headers

    })
    console.log(res)
    
}

async function carregarUsuarios() {
    console.log('Logando usuários...');
    try {
        const response = await fetch(`${baseUrl}/Usuarios`);
        const usuarios = await response.json();
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        renderizarUsuarios(usuarios);
    } catch (error) {
    }
}
// Carregar usuários ao iniciar a página
carregarUsuarios();
