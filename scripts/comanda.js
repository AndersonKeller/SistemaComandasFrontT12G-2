import { baseUrl, headers } from "./api.js";

// Expondo funções globalmente para que possam ser chamadas em elementos HTML
window.removeComanda = removeComanda;
window.editComanda = editComanda;
window.saveEdit = saveEdit;
window.showClearAllModal = showClearAllModal;
window.clearAll = clearAll;
window.closeModal = closeModal;
window.adicionarItem = adicionarItem;

// Seleciona o botão de adicionar comanda e adiciona um evento de clique
const addBtn = document.querySelector(".add-button");
addBtn.addEventListener("click", showAddComandaModal);

// Variáveis para armazenar o estado da edição da comanda
let currentEditComandaId = null;
let currentEditComanda = null;

// Função para inicializar a aplicação, carregando as comandas
async function initial() {
    try {
        const res = await fetch(`${baseUrl}/Comandas`, { headers: headers });
        
        if (!res.ok) throw new Error("Erro ao carregar Comandas.");
        const resJson = await res.json();
        console.log(resJson)
        loadComandas(resJson);
    }   catch (error) {
        console.error("Erro na inicialização:", error);
        //alert("Erro ao inicializar a aplicação.");
    }
}

// Função para carregar e exibir as comandas na interface
function loadComandas(Comandas) {
    console.log(Comandas)
    const ComandasList = document.getElementById('Comandas-list');
    if (!ComandasList) {
        console.error("Elemento 'Comandas-list' não encontrado.");
        return;
    }

    // Limpa a lista de comandas existente
    ComandasList.innerHTML = '';
    Comandas.forEach(comanda => {
        const comandaElement = document.createElement('div');
        comandaElement.className = 'comanda';
        comandaElement.innerHTML = `
            <span>Mesa ${comanda.numeroMesa} - ${comanda.nomeCliente}</span>
            <p>Total: R$ ${calcularTotalComanda(comanda).toFixed(2)}</p>
            <div>
                <button onclick="window.editComanda(${JSON.stringify(comanda).replace(/"/g, '&quot;')})">✏️</button>
                <button onclick="window.removeComanda('${comanda.id}')">❌</button>
            </div>
        `;
        ComandasList.appendChild(comandaElement);
    });
}

// Função para calcular o total de uma comanda
function calcularTotalComanda(comanda) {
  console.log(comanda,"comanda que chga no calcular")
    comanda.comandaItens.map((item,index,array)=>{
        const itens = array.filter((i)=>i.titulo === item.titulo)
        item.quantidade = itens.length
    })
    if(comanda.comandaItens){

        const res= comanda.comandaItens.reduce((total, item) => total + item.preco * item.quantidade, 0);
        console.log(res,"res do reduce")
        return res
    }
    return 0
}

// Função para criar um modal
function createModal(id, content) {
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);

    // Adiciona funcionalidade para fechar o modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => closeModal(id);

    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal(id);
        }
    };

    return modal;
}

// Função para mostrar o modal de adicionar comanda
function showAddComandaModal() {
    const modalContent = `
        <h3>Adicionar Comanda</h3>
        <input type="text" id="addComandaMesa" placeholder="Número da Mesa" />
        <input type="text" id="addComandaCliente" placeholder="Nome do Cliente" />
        <h4>Itens do Cardápio</h4>
        <div id="itensCardapio"></div>
        <h4>Itens Selecionados</h4>
        <ul id="itensSelecionados"></ul>
        <p>Total: R$ <span id="totalComanda">0.00</span></p>
        <button id="addComanda">Adicionar Comanda</button>
    `;
    const modal = createModal('addComandaModal', modalContent);
    modal.style.display = 'block';
    carregarItensCardapio(); // Carrega os itens do cardápio
    const addComandaBtn = document.querySelector("#addComanda");
    addComandaBtn.addEventListener("click", addComanda); // Adiciona evento para adicionar comanda
}

// Função para carregar os itens do cardápio
async function carregarItensCardapio() {
    try {
        const res = await fetch(`${baseUrl}/CardapioItems`, { headers });
        if (!res.ok) throw new Error("Erro ao carregar itens do cardápio.");
        const itens = await res.json();
        const itensCardapio = document.getElementById('itensCardapio');
        if (!itensCardapio) return;

        itensCardapio.innerHTML = '';
        itens.forEach(item => {
            const btn = document.createElement('button');
            btn.id = item.id
            btn.textContent = `${item.titulo} - R$ ${item.preco.toFixed(2)}`;
            btn.onclick = () => adicionarItem(item); // Adiciona o item ao clicar
            itensCardapio.appendChild(btn);
        });
    } catch (error) {
        console.error('Erro ao carregar itens do cardápio:', error);
    }
}

// Função para adicionar um item selecionado à comanda
function adicionarItem(item) {
    console.log(item,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    const itensSelecionados = document.getElementById('itensSelecionados');
    if (!itensSelecionados) return;

    const li = document.createElement('li');
    li.id = item.id
    li.textContent = `${item.titulo} - R$ ${item.preco.toFixed(2)}`;
    itensSelecionados.appendChild(li);
    atualizarTotal(item.preco); // Atualiza o total da comanda
}

// Função para atualizar o total da comanda
function atualizarTotal(preco) {
    const totalSpan = document.getElementById('totalComanda');
    if (!totalSpan) return;

    const totalAtual = parseFloat(totalSpan.textContent);
    totalSpan.textContent = (totalAtual + preco).toFixed(2); // Adiciona o preço do item ao total
}

// Função para adicionar uma nova comanda
async function addComanda() {
    const mesaInput = document.getElementById('addComandaMesa');
    const clienteInput = document.getElementById('addComandaCliente');
    const itensSelecionados = document.getElementById('itensSelecionados').children;
    const numeroMesa = mesaInput.value.trim();
    const nomeCliente = clienteInput.value.trim();
    console.log(itensSelecionados,"itens selecionados")
    const itens = Array.from(itensSelecionados).map(li => {
        const [titulo, preco] = li.textContent.split(' - R$ '); // Extrai título e preço
        console.log(preco,"li aki")
        return { titulo, preco: parseFloat(preco), quantidade: 1,id:li.id }; // Cria objeto de item
    });

    // Verifica se todos os campos estão preenchidos
    if (numeroMesa && nomeCliente && itens.length > 0) {
        const novaComanda = { numeroMesa, nomeCliente, itens };
        await addComandaApi(novaComanda); // Chama a API para adicionar a comanda
    } else {
        alert('Por favor, preencha todos os campos e adicione pelo menos um item.');
    }
}

// Função para enviar a nova comanda para a API
async function addComandaApi(comanda) {
    console.log(comanda,"comanda na riacao")
    comanda.cardapioItems = comanda.itens.map((item)=>Number(item.id))
    try {
        const res = await fetch(`${baseUrl}/Comandas`, {
            method: "POST",
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comanda)
        });
        if (res.ok) {
            closeModal('addComandaModal'); // Fecha o modal após sucesso
            initial(); // Atualiza a lista de comandas
        } else {
            alert('Erro ao adicionar a comanda.');
        }
    } catch (error) {
        console.error('Erro ao adicionar comanda:', error);
        alert('Erro ao adicionar a comanda.');
    }
}

// Função para remover uma comanda
async function removeComanda(id) {
    try {
        const res = await fetch(`${baseUrl}/Comandas/${id}`, {
            method: "DELETE",
            headers
        });

        if (res.ok) {
            initial(); // Atualiza a lista de comandas após remoção
        } else {
            alert('Erro ao remover a comanda.');
        }
    } catch (error) {
        console.error('Erro ao remover comanda:', error);
        alert('Erro ao remover a comanda.');
    }
}

// Função para abrir o modal de edição de uma comanda
function editComanda(comanda) {
    currentEditComandaId = comanda.id;
    currentEditComanda = comanda;
    const modalContent = `
        <h3>Editar Comanda</h3>
        <input type="text" id="editComandaMesa" value="${comanda.numeroMesa}" />
        <input type="text" id="editComandaCliente" value="${comanda.nomeCliente}" />
        <h4>Itens do Cardápio</h4>
        <div id="itensCardapio"></div>
        <h4>Itens Selecionados</h4>
        <ul id="itensSelecionados"></ul>
        <p>Total: R$ <span id="totalComanda">0.00</span></p>
        <button onclick="window.saveEdit()">Salvar</button>
    `;
    const modal = createModal('editModal', modalContent);
    modal.style.display = 'block';
    carregarItensCardapio(); // Carrega os itens do cardápio
    console.log(comanda,"comanda")
    carregarItensSelecionados(comanda.comandaItens); // Carrega os itens selecionados
}

// Função para carregar os itens selecionados em uma comanda
function carregarItensSelecionados(itens) {
    const itensSelecionados = document.getElementById('itensSelecionados');
    if (!itensSelecionados) return;
    console.log("aqui que ta montando errado")
    itensSelecionados.innerHTML = '';
    let total = 0;
    console.log(itens)
    itens.forEach(item => {
        const li = document.createElement('li');
        li.id = item.idProduto
        console.log(item.id)
        li.textContent = `${item.titulo} - Quantidade: ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}`;
        itensSelecionados.appendChild(li);
        total += item.preco * item.quantidade; // Calcula o total
    });
    document.getElementById('totalComanda').textContent = total.toFixed(2); // Atualiza o total no modal
}

// Função para salvar as edições da comanda
async function saveEdit() {
    const mesaInput = document.getElementById('editComandaMesa');
    const clienteInput = document.getElementById('editComandaCliente');
    const itensSelecionados = document.getElementById('itensSelecionados').children;
   
    const numeroMesa = mesaInput.value.trim();
    const nomeCliente = clienteInput.value.trim();
    const itens = Array.from(itensSelecionados).map((li,index,self) => {
       
        const [titulo, preco] = li.textContent.split(' - ');
        const findItem = self.filter((item)=>item.id===li.id)
        const quantidade = findItem.length
        
        return { 
            titulo, 
            id:li.id,
            quantidade: quantidade, // Extrai quantidade
            preco: parseFloat(preco.split('R$ ')[1]) / parseInt(quantidade) // Calcula o preço unitário
        };
    });

    // Verifica se todos os campos estão preenchidos
    console.log(itens,"itens")
    if (numeroMesa && nomeCliente && itens.length > 0) {
        const comandaAtualizada = {
            id:currentEditComandaId,
            numeroMesa,
            nomeCliente,
            cardapioItems:itens.map((item)=>parseInt(item.id))
        };

        try {
            const res = await fetch(`${baseUrl}/Comandas/${currentEditComandaId}`, {
                method: "PUT",
                headers: {
                  headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comandaAtualizada) // Envia a comanda atualizada
            });

            if (res.ok) {
                closeModal('editModal'); // Fecha o modal após sucesso
                initial(); // Atualiza a lista de comandas
            } else {
                alert('Erro ao atualizar a comanda.');
            }
        } catch (error) {
            console.error('Erro ao atualizar comanda:', error);
            alert('Erro ao atualizar a comanda.');
        }
    } else {
        alert('Por favor, preencha todos os campos e mantenha pelo menos um item.');
    }
}

// Função para mostrar o modal de confirmação para remover todas as comandas
function showClearAllModal() {
    const modalContent = `
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja remover todas as Comandas?</p>
        <div class="modal-buttons">
            <button class="confirm-button" onclick="window.clearAll()">Confirmar</button>
            <button class="cancel-button" onclick="window.closeModal('clearAllModal')">Cancelar</button>
        </div>
    `;
    const modal = createModal('clearAllModal', modalContent);
    modal.style.display = 'block';
}

// Função para remover todas as comandas
async function clearAll() {
    try {
        const res = await fetch(`${baseUrl}/Comandas`, { headers });
        if (!res.ok) throw new Error("Erro ao carregar as Comandas.");
        const Comandas = await res.json();

        // Deleta todas as comandas sequencialmente
        for (const comanda of Comandas) {
            await fetch(`${baseUrl}/Comandas/${comanda.id}`, {
                method: "DELETE",
                headers
            });
        }

        closeModal('clearAllModal'); // Fecha o modal após a exclusão
        initial(); // Atualiza a lista de comandas
    } catch (error) {
        console.error('Erro ao limpar todas as Comandas:', error);
        alert('Erro ao limpar todas as Comandas.');
    }
}

// Função para fechar um modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none'; // Esconde o modal
        document.body.removeChild(modal); // Remove o modal do DOM
    }
}

// Inicializar a aplicação ao carregar a página
initial();
