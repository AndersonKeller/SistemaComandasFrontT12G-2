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
                    <input type="text" id="userNome" value="${usuario.nome}" readonly>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="text" id="userEmail" value="${usuario.email}" readonly>
                </div>
                <div class="form-group">
                    <label>Senha:</label>
                    <div class="senha-container">
                        <input type="password" id="userSenha" value="${usuario.senha}" readonly>
                        <button type="button" id="toggleSenha" class="toggle-senha">
                            <!-- SVG de olho fechado -->
                            <svg id="eye-open"xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path fill="white" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>
                            <!-- SVG de olho fechado (vai ser exibido quando a senha for visível) -->
                            <svg id="eye-closed"  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 620 512"class="bi bi-eye-slash" style="display: none;"><path fill="white" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"></path></svg>
                        </button>
                    </div>
                </div>
                ${usuario.email !== 'admin@admin.com' ? `
                    <div>
                        <button class="btnExcluirUsuario">Excluir Usuario</button>
                        <button class="btnEditarUsuario">Editar Usuario</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `);

    const modal = document.getElementById('userModal');
    const btnClose = modal.querySelector(".close-btn");
    const btnToggleSenha = modal.querySelector("#toggleSenha");
    const inputSenha = modal.querySelector("#userSenha");
    const eyeOpen = modal.querySelector("#eye-open");
    const eyeClosed = modal.querySelector("#eye-closed");

    // Fechar o modal ao clicar no "X"
    btnClose.addEventListener("click", () => {
        modal.remove(); // Fecha o modal
    });

    // Fechar o modal ao clicar fora da área do modal
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Alternar a visibilidade da senha
    btnToggleSenha.addEventListener("click", () => {
        if (inputSenha.type === "password") {
            inputSenha.type = "text"; // Exibe a senha
            eyeOpen.style.display = "none"; // Esconde o olho aberto
            eyeClosed.style.display = "inline"; // Mostra o olho fechado
        } else {
            inputSenha.type = "password"; // Oculta a senha
            eyeOpen.style.display = "inline"; // Mostra o olho aberto
            eyeClosed.style.display = "none"; // Esconde o olho fechado
        }
    });

    // Excluir usuário
    const botaoRemover = document.querySelector(".btnExcluirUsuario");
    if (botaoRemover) {
        botaoRemover.addEventListener("click", () => {
            excluirUsuario(usuario.id);
            modal.remove(); // Fecha o modal imediatamente após excluir
            setTimeout(() => {
                location.reload(); // Recarrega a página após um tempo
            }, 1000);
        });
    }

    // Editar usuário
    const botaoEditar = document.querySelector(".btnEditarUsuario");
    if (botaoEditar) {
        botaoEditar.addEventListener("click", () => {
            document.getElementById('userNome').readOnly = false;
            document.getElementById('userEmail').readOnly = false;
            document.getElementById('userSenha').readOnly = false;

            botaoEditar.textContent = "Salvar"; // Alterar o texto do botão de "Editar" para "Salvar"
            
            // Depois que o usuário clicar em "Salvar", atualizamos os dados via PUT
            botaoEditar.addEventListener("click", async () => {
                const nome = document.getElementById('userNome').value;
                const email = document.getElementById('userEmail').value;
                const senha = document.getElementById('userSenha').value;

                const usuarioAtualizado = {
                    id: usuario.id,
                    nome: nome,
                    email: email,
                    senha: senha
                };

                // Chama a função para fazer o PUT e atualizar o usuário
                await editarUsuario(usuarioAtualizado);

                modal.remove(); // Fecha o modal após a atualização
                setTimeout(() => {
                    location.reload(); // Recarrega a página para refletir as mudanças
                }, 1000);  // Espera 1 segundo para atualizar os usuários
            });
        });
    }
}



// Função para editar o usuário via PUT
async function editarUsuario(usuario) {
    try {
        const res = await fetch(`${baseUrl}/Usuarios/${usuario.id}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(usuario)
        });

        // Verifica se a resposta foi bem-sucedida
        if (!res.ok) {
            throw new Error(`Erro ao editar o usuário. Status: ${res.status}`);
        }

        // Se a resposta não tiver corpo, não chamamos res.json()
        if (res.status !== 204) {
            const resJson = await res.json();  // Aqui você pode tratar a resposta JSON se houver
            console.log('Resposta da API (usuário editado):', resJson);
        } else {
            console.log('Usuário editado com sucesso, mas sem resposta JSON');
        }
    } catch (error) {
        console.error('Erro ao editar o usuário:', error);
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
