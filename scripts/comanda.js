import { baseUrl, headers } from "./api.js";

// Estado global
let currentEditComandaId = null;
let mesasDisponiveis = [];
let cardapioItems = [];

// Inicialização
async function initial() {
    try {
        const [comandasRes, mesasRes, cardapioRes] = await Promise.all([
            fetch(`${baseUrl}/Comandas`, { headers }),
            fetch(`${baseUrl}/Mesas`, { headers }),
            fetch(`${baseUrl}/CardapioItems`, { headers })
        ]);

        if (!comandasRes.ok || !mesasRes.ok || !cardapioRes.ok) 
            throw new Error("Erro ao carregar os dados.");

        const comandas = await comandasRes.json();
        mesasDisponiveis = await mesasRes.json();
        cardapioItems = await cardapioRes.json();

        loadComandas(comandas);
    } catch (error) {
        console.error("Erro na inicialização:", error);
        showNotification("Erro ao inicializar a aplicação.", "error");
    }
}

// Funções de UI
function loadComandas(comandas) {
    const comandasList = document.getElementById('Comandas-list');
    const template = document.getElementById('comanda-template');

    comandasList.innerHTML = '';
    
    comandas.forEach(comanda => {
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('h3').textContent = `Mesa ${comanda.numeroMesa} - ${comanda.nomeCliente}`;
        clone.querySelector('.total').textContent = `Total: R$ ${calcularTotalComanda(comanda).toFixed(2)}`;
        
        const itemsList = clone.querySelector('.items-list');
        comanda.comandaItens?.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${item.titulo}`;
            itemsList.appendChild(itemElement);
        });

        const editBtn = clone.querySelector('.edit-btn');
        const deleteBtn = clone.querySelector('.delete-btn');
        
        editBtn.onclick = () => editComanda(comanda);
        deleteBtn.onclick = () => showDeleteConfirmModal(comanda.id);

        comandasList.appendChild(clone);
    });
}

function calcularTotalComanda(comanda) {
    return comanda.comandaItens?.reduce((total, item) => 
        total + item.preco, 0) || 0;
}

// Funções de Modal
function createModal(id, title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = id;

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${title}</h2>
            ${content}
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => closeModal(id);

    window.onclick = (event) => {
        if (event.target === modal) closeModal(id);
    };

    return modal;
}

function showAddComandaModal() {
    const mesasOptions = mesasDisponiveis
        .map(mesa => `<option value="${mesa.numeroMesa}">Mesa ${mesa.numeroMesa}</option>`)
        .join('');

    const modalContent = `
        <div class="form-group">
            <label for="mesa">Mesa:</label>
            <select id="addComandaMesa" required>${mesasOptions}</select>
        </div>

        <div class="form-group">
            <label for="cliente">Nome do Cliente:</label>
            <input type="text" id="addComandaCliente" required placeholder="Nome do Cliente" />
        </div>

        <div class="items-container">
            <h3>Itens do Cardápio</h3>
            <div id="itensCardapio" class="items-grid"></div>
        </div>

        <div class="items-container">
            <h3>Itens Selecionados</h3>
            <ul id="itensSelecionados" class="selected-items"></ul>
        </div>

        <div class="total-section">
            Total: R$ <span id="totalComanda">0.00</span>
        </div>

        <button id="addComanda" class="add-button">
            <i class="fas fa-check"></i> Adicionar Comanda
        </button>
    `;

    createModal('addComandaModal', 'Nova Comanda', modalContent);
    loadCardapioItems();
    document.getElementById('addComanda').onclick = addComanda;
}

function loadCardapioItems() {
    const itensCardapio = document.getElementById('itensCardapio');
    itensCardapio.innerHTML = '';

    cardapioItems.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'item-button';
        btn.innerHTML = `
            ${item.titulo}<br>
            R$ ${item.preco.toFixed(2)}
        `;
        btn.onclick = () => adicionarItem(item);
        itensCardapio.appendChild(btn);
    });
}

function adicionarItem(item) {
    const itensSelecionados = document.getElementById('itensSelecionados');
    const itemId = `item-${item.id}`;
    let existingItem = document.getElementById(itemId);
  
    if (!existingItem) {
        const li = document.createElement('li');
        li.id = itemId;
        
        li.className = 'selected-item';
        li.innerHTML = `
            <span>${item.titulo} - R$ ${item.preco.toFixed(2)}</span>
            <button class="remove-item" onclick="removerItem('${itemId}', ${item.preco})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        itensSelecionados.appendChild(li);
        atualizarTotal(item.preco);
    }
}

function removerItem(itemId, preco) {
    console.log(itemId,"itemId")
    const id = itemId.includes("-")?itemId.split("-")[1]:itemId
    console.log(id,"id")
    const item =Array.from( document.querySelectorAll(`#item-${id}`))
    const findNone = item.find((li)=>!li.getAttribute("style"))
    console.log(findNone,"item com o id")
    findNone.setAttribute("style","display:none;");
    atualizarTotal(-preco);
}

function atualizarTotal(valor) {
    const totalSpan = document.getElementById('totalComanda');
    const totalSpanEdit = document.getElementById('editTotalComanda');
    
    const totalAtual = totalSpan ? parseFloat(totalSpan.textContent):parseFloat(totalSpanEdit.textContent);
    totalSpan? totalSpan.textContent = (totalAtual + valor).toFixed(2):totalSpanEdit.textContent = (totalAtual + valor).toFixed(2);
}

async function addComanda() {
    const mesaInput = document.getElementById('addComandaMesa').value;
    const clienteInput = document.getElementById('addComandaCliente').value;
    const itensSelecionados = document.getElementById('itensSelecionados').children;

    if (!mesaInput || !clienteInput || itensSelecionados.length === 0) {
        showNotification('Preencha todos os campos e adicione pelo menos um item.', 'error');
        return;
    }

    const itens = Array.from(itensSelecionados).map(li => {
        const id = li.id.replace('item-', '');
        const item = cardapioItems.find(i => i.id === parseInt(id));
        return {
            idProduto: parseInt(id),
            titulo: item.titulo ?? "",
            preco: item.preco
        };
    });

    const novaComanda = {
        numeroMesa: parseInt(mesaInput),
        nomeCliente: clienteInput.trim(),
        cardapioItems: itens.map(item => item.idProduto)
    };

    try {
        const res = await fetch(`${baseUrl}/Comandas`, {
            method: 'POST',
            headers: { headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(novaComanda)
        });

        if (!res.ok) throw new Error('Erro ao adicionar comanda');

        closeModal('addComandaModal');
        showNotification('Comanda adicionada com sucesso!', 'success');
        initial();
    } catch (error) {
        console.error('Erro ao adicionar comanda:', error);
        showNotification('Erro ao adicionar comanda.', 'error');
    }
}

function showDeleteConfirmModal(id) {
    const modalContent = `
        <p>Tem certeza que deseja excluir esta comanda?</p>
        <div class="modal-buttons">
            <button onclick="deleteComanda('${id}')" class="danger-button">
                <i class="fas fa-trash"></i> Confirmar
            </button>
            <button onclick="closeModal('deleteConfirmModal')" class="secondary-button">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </div>
    `;

    createModal('deleteConfirmModal', 'Confirmar Exclusão', modalContent);
}

async function deleteComanda(id) {
    try {
        const res = await fetch(`${baseUrl}/Comandas/${id}`, {
            method: 'DELETE',
            headers
        });

        if (!res.ok) throw new Error('Erro ao excluir comanda');

        closeModal('deleteConfirmModal');
        showNotification('Comanda excluída com sucesso!', 'success');
        initial();
    } catch (error) {
        console.error('Erro ao excluir comanda:', error);
        showNotification('Erro ao excluir comanda.', 'error');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}

function showEditComandaModal(comanda) {
    const mesasOptions = mesasDisponiveis
        .map(mesa => `<option value="${mesa.numeroMesa}" ${mesa.numeroMesa === comanda.numeroMesa ? 'selected' : ''}>Mesa ${mesa.numeroMesa}</option>`)
        .join('');

    const selectedItemsHtml = comanda.comandaItens.map(item => {
        return `
            <li id="item-${item.idProduto}" data-id=${item.id} class="selected-item">
                <span>${item.titulo} - R$ ${item.preco.toFixed(2)}</span>
                <button class="remove-item" onclick="removerItem('${item.idProduto}', ${item.preco})">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `;
    }).join('');

    const modalContent = `
        <div class="form-group">
            <label for="editMesa">Mesa:</label>
            <select id="editComandaMesa" required>${mesasOptions}</select>
        </div>

        <div class="form-group">
            <label for="editCliente">Nome do Cliente:</label>
            <input type="text" id="editComandaCliente" value="${comanda.nomeCliente}" required />
        </div>

        <div class="items-container">
            <h3>Itens do Cardápio</h3>
            <div id="itensCardapioEdit" class="items-grid"></div>
        </div>

        <div class="items-container">
            <h3>Itens Selecionados</h3>
            <ul id="editItensSelecionados" class="selected-items">
                ${selectedItemsHtml}
            </ul>
        </div>

        <div class="total-section">
            Total: R$ <span id="editTotalComanda">${calcularTotalComanda(comanda).toFixed(2)}</span>
        </div>

        <button id="updateComanda" class="add-button">
            <i class="fas fa-check"></i> Atualizar Comanda
        </button>
    `;

    createModal('editComandaModal', 'Editar Comanda', modalContent);
    loadCardapioItemsForEdit();
}

function loadCardapioItemsForEdit() {
    const itensCardapioEdit = document.getElementById('itensCardapioEdit');
    itensCardapioEdit.innerHTML = '';

    cardapioItems.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'item-button';
        btn.innerHTML = `
            ${item.titulo}<br>
            R$ ${item.preco.toFixed(2)}
        `;
        btn.onclick = () => adicionarItemParaEdit(item);
        itensCardapioEdit.appendChild(btn);
    });
}

function adicionarItemParaEdit(item) {
    const itensSelecionados = document.getElementById('editItensSelecionados');
    const itemId = `item-${item.id}`;
    
    const li = document.createElement('li');
    li.id = itemId;
    li.setAttribute("name", "novoitem");
    li.className = 'selected-item';
    li.innerHTML = `
        <span>${item.titulo} - R$ ${item.preco.toFixed(2)}</span>
        <button class="remove-item" onclick="removerItem('${itemId}', ${item.preco})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    itensSelecionados.appendChild(li);
    atualizarTotalParaEdit(item.preco);
}

function atualizarTotalParaEdit(valor) {
    const totalSpan = document.getElementById('editTotalComanda');
    const totalAtual = parseFloat(totalSpan.textContent);
    totalSpan.textContent = (totalAtual + valor).toFixed(2);
}

async function editComanda(comanda) {
    try {
        showEditComandaModal(comanda);

        const updateBtn = document.getElementById('updateComanda');
        updateBtn.onclick = async () => {
            const mesaInput = document.getElementById('editComandaMesa').value;
            const clienteInput = document.getElementById('editComandaCliente').value;
            const itensSelecionados = document.getElementById('editItensSelecionados').children;

            if (!mesaInput || !clienteInput || itensSelecionados.length === 0) {
                showNotification('Preencha todos os campos e adicione pelo menos um item.', 'error');
                return;
            }

            const updatedItems = Array.from(itensSelecionados).map(li => {
                const id = li.id.replace('item-', '');
                const item = cardapioItems.find(i => i.id === parseInt(id));
                return {
                    id: li.getAttribute("style") ? parseInt(li.getAttribute("data-id")) : 0,
                    incluir: li.getAttribute("name") ? true : false,
                    cardapioItemId: parseInt(item.id),
                    excluir: li.getAttribute("style") ? true : false                    
                };
            });

            const updatedComanda = {
                id: comanda.id,
                numeroMesa: 0,
                nomeCliente: clienteInput.trim(),
                comandaItens: updatedItems
            };

            const res = await fetch(`${baseUrl}/Comandas/${comanda.id}`, {
                method: 'PUT',
                headers: { headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedComanda)
            });

            if (!res.ok) throw new Error('Erro ao atualizar a comanda');

            closeModal('editComandaModal');
            showNotification('Comanda atualizada com sucesso!', 'success');
            initial();
        };
    } catch (error) {
        console.error('Erro ao editar a comanda:', error);
    }
}

// Funções Window
window.removerItem = removerItem;
window.deleteComanda = deleteComanda;
window.showDeleteConfirmModal = showDeleteConfirmModal;
window.closeModal = closeModal;
window.editComanda = editComanda;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initial();
    document.querySelector('.add-button').addEventListener('click', showAddComandaModal);
});