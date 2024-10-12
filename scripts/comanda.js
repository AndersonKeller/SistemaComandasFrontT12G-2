import { baseUrl, headers } from "./api.js";

let currentEditItem = null;

// Funções principais
async function initialize() {
    try {
        const response = await fetch(`${baseUrl}/Comandas`, {
            headers: headers
        });
        const items = await response.json();
        loadItems(items);
    } catch (error) {
        showError('Erro ao carregar itens');
    }
}

function loadItems(items) {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <div>
                <h3>Mesa: ${item.numeroMesa}</h3>
                <p>Cliente: ${item.nomeCliente}</p>
            </div>
            <div>
                <button onclick="editItem(${JSON.stringify(item)})">✏️</button>
                <button onclick="removeItem('${item.id}')">❌</button>
            </div>
        `;
        itemsList.appendChild(itemElement);
    });
}

// Funções de Modal
function openModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Adicionar eventos de fechar
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.remove();
    }
}

// Funções de manipulação de itens
function showAddItemModal() {
    const content = `
        <h2>Adicionar Comanda</h2>
        <input type="text" id="itemNumeroMesa" placeholder="Número da Mesa">
        <input type="text" id="itemNomeCliente" placeholder="Nome do Cliente">
        <button onclick="addItem()">Adicionar</button>
    `;
    openModal(content);
}

async function addItem() {
    const numeroMesa = document.getElementById('itemNumeroMesa').value;
    const nomeCliente = document.getElementById('itemNomeCliente').value;

    if (!numeroMesa || !nomeCliente) {
        showError('Preencha todos os campos corretamente');
        return;
    }

    try {
        // Adicionar a mesa
        const mesaResponse = await fetch(`${baseUrl}/Mesas`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                numeroMesa: numeroMesa
            })
        });

        if (!mesaResponse.ok) throw new Error('Erro ao adicionar mesa');

        // Agora adicionar a comanda
        const comandaResponse = await fetch(`${baseUrl}/Comandas`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                numeroMesa: numeroMesa,
                nomeCliente: nomeCliente
            })
        });

        if (!comandaResponse.ok) throw new Error('Erro ao adicionar comanda');
        
        closeModal();
        initialize();
    } catch (error) {
        showError('Erro ao adicionar comanda');
    }
}

function editItem(item) {
    currentEditItem = item;
    const content = `
        <h2>Editar Comanda</h2>
        <input type="text" id="editNumeroMesa" value="${item.numeroMesa}">
        <input type="text" id="editNomeCliente" value="${item.nomeCliente}">
        <button onclick="saveEdit()">Salvar</button>
    `;
    openModal(content);
}

async function saveEdit() {
    const numeroMesa = document.getElementById('editNumeroMesa').value;
    const nomeCliente = document.getElementById('editNomeCliente').value;

    if (!numeroMesa || !nomeCliente) {
        showError('Preencha todos os campos corretamente');
        return;
    }

    try {
        // Atualizar a mesa
        const mesaResponse = await fetch(`${baseUrl}/Mesas/${currentEditItem.numeroMesa}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                numeroMesa: numeroMesa
            })
        });

        if (!mesaResponse.ok) throw new Error('Erro ao atualizar mesa');

        // Atualizar a comanda
        const comandaResponse = await fetch(`${baseUrl}/Comandas/${currentEditItem.id}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                ...currentEditItem,
                numeroMesa: numeroMesa,
                nomeCliente: nomeCliente
            })
        });

        if (!comandaResponse.ok) throw new Error('Erro ao atualizar comanda');
        
        closeModal();
        initialize();
    } catch (error) {
        showError('Erro ao atualizar comanda');
    }
}

async function removeItem(id) {
    if (!confirm('Tem certeza que deseja remover esta comanda?')) return;

    try {
        const response = await fetch(`${baseUrl}/Comandas/${id}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) throw new Error('Erro ao remover item');
        
        initialize();
    } catch (error) {
        showError('Erro ao remover item');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.modal-content').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Event Listeners
document.getElementById('addButton').addEventListener('click', showAddItemModal);
document.getElementById('clearButton').addEventListener('click', async () => {
    if (confirm('Tem certeza que deseja remover todas as comandas?')) {
        try {
            const response = await fetch(`${baseUrl}/Comandas`, {
                headers: headers
            });
            const items = await response.json();
            
            for (const item of items) {
                await fetch(`${baseUrl}/Comandas/${item.id}`, {
                    method: 'DELETE',
                    headers: headers
                });
            }
            
            initialize();
        } catch (error) {
            showError('Erro ao limpar todas as comandas');
        }
    }
});

// Inicialização
initialize();

// Expor funções necessárias globalmente
window.editItem = editItem;
window.removeItem = removeItem;
window.addItem = addItem;
window.saveEdit = saveEdit;
