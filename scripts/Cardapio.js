import {baseUrl,headers} from "./api.js"

// Expondo funções globalmente
window.removeItem = removeItem;
window.editItem = editItem;
window.saveEdit = saveEdit;
window.showClearAllModal = showClearAllModal;
window.clearAll = clearAll;
window.closeModal = closeModal;

console.log(window)

const addBtn = document.querySelector(".add-button")
addBtn.addEventListener("click",showAddItemModal)

let currentEditItemIndex = null;
let currentEditItem = null;

async function initial() {
    const res = await fetch(`${baseUrl}/CardapioItems`, {
        headers:headers
    })
    const resJson = await res.json()
    loadItems(resJson);
}

function loadItems(items) {
    console.log(items,"load")
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';
    items.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <span>${item.titulo} - R$ ${item.preco.toFixed(2)}</span>
            <p>${item.descricao}</p>
            <p>Possui preparo: ${item.possuiPreparo ? 'Sim' : 'Não'}</p>
            <div class="columnXandPen">
                <button onclick="window.editItem(${JSON.stringify(item).replace(/"/g, '&quot;')})">✎</button>
                <button onclick="window.removeItem('${item.id}')">✖</button>
            </div>
        `;
        
        itemsList.appendChild(itemElement);
    });
}

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

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => closeModal(id);

    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal(id);
        }
    };

    return modal;
}

function showAddItemModal() {
    const modalContent = `
        <h3>Adicionar Item</h3>
        <input type="text" id="addItemInput" placeholder="Nome do item" />
        <input type="number" id="addItemPrice" placeholder="Preço" step="0.01" />
        <input type="text" id="addItemDescription" placeholder="Descrição" />
        <div class="checkbox-container">
            <input type="checkbox" id="addItemPreparo" />
            <label for="addItemPreparo">Possui preparo</label>
        </div>
        <button id="addItem">Adicionar</button>
    `;
    const modal = createModal('addItemModal', modalContent);
    modal.style.display = 'block';
    const addItemBtn = document.querySelector("#addItem")
    addItemBtn.addEventListener("click",addItem)
}

function addItem() {
    const nameInput = document.getElementById('addItemInput');
    const priceInput = document.getElementById('addItemPrice');
    const descriptionInput = document.getElementById('addItemDescription');
    const preparoInput = document.getElementById('addItemPreparo');
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const description = descriptionInput.value.trim();
    const possuiPreparo = preparoInput.checked;

    if (name && !isNaN(price) && description) {
        const newItem = { 
            titulo: name, 
            preco: price, 
            descricao: description, 
            possuiPreparo: possuiPreparo 
        }
        addCardapioItemApi(newItem)
        nameInput.value = '';
        priceInput.value = '';
        descriptionInput.value = '';
        preparoInput.checked = false;
    } else {
        alert('Por favor, insira um nome, um preço e uma descrição válidos.');
    }
}

async function addCardapioItemApi(item){
    const res = await fetch(`${baseUrl}/CardapioItems`,{
        method:"POST",
        headers:headers,
        body:JSON.stringify(item)
    })
    if(res.ok){
        closeModal('addItemModal');
        initial()
    }
    const resJson = await res.json()
    console.log(resJson)
}

async function removeItem(id) {
    try {
        const res = await fetch(`${baseUrl}/CardapioItems/${id}`, {
            method: "DELETE",
            headers: headers
        });
        
        if(res.ok) {
            initial();
        } else {
            alert('Erro ao remover o item.');
        }
    } catch (error) {
        console.error('Erro ao remover item:', error);
        alert('Erro ao remover o item.');
    }
}

function editItem(item) {
    currentEditItemIndex = item.id;
    currentEditItem = item;
    const modalContent = `
        <h3>Editar Item</h3>
        <input type="text" id="editInput" value="${item.titulo}" />
        <input type="number" id="editPrice" value="${item.preco.toFixed(2)}" step="0.01" />
        <input type="text" id="editDescription" value="${item.descricao}" />
        <div class="checkbox-container">
            <input type="checkbox" id="editItemPreparo" ${item.possuiPreparo ? 'checked' : ''} />
            <label for="editItemPreparo">Possui preparo</label>
        </div>
        <button id="editSaveEdit" onclick="window.saveEdit()">Salvar</button>
    `;
    const modal = createModal('editModal', modalContent);
    modal.style.display = 'block';
}

async function saveEdit() {
    const nameInput = document.getElementById('editInput');
    const priceInput = document.getElementById('editPrice');
    const descriptionInput = document.getElementById('editDescription');
    const preparoInput = document.getElementById('editItemPreparo');
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const description = descriptionInput.value.trim();
    const possuiPreparo = preparoInput.checked;

    if (name && !isNaN(price) && description) {
        const updatedItem = {
            ...currentEditItem,
            titulo: name,
            preco: price,
            descricao: description,
            possuiPreparo: possuiPreparo
        };

        try {
            const res = await fetch(`${baseUrl}/CardapioItems/${currentEditItemIndex}`, {
                method: "PUT",
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });

            if(res.ok) {
                closeModal('editModal');
                initial();
            } else {
                const errorData = await res.json();
                console.error('Erro na resposta:', errorData);
                alert('Erro ao atualizar o item. Verifique o console para mais detalhes.');
            }
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
            alert('Erro ao atualizar o item.');
        }
    } else {
        alert('Por favor, insira um nome, um preço e uma descrição válidos.');
    }
}

function showClearAllModal() {
    const modalContent = `
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja remover todos os itens?</p>
        <div class="modal-buttons">
            <button class="confirm-button" onclick="window.clearAll()">Confirmar</button>
            <button class="cancel-button" onclick="window.closeModal('clearAllModal')">Cancelar</button>
        </div>
    `;
    const modal = createModal('clearAllModal', modalContent);
    modal.style.display = 'block';
}

async function clearAll() {
    try {
        const res = await fetch(`${baseUrl}/CardapioItems`, {
            headers: headers
        });
        const items = await res.json();
        
        // Delete all items sequentially
        for (const item of items) {
            await fetch(`${baseUrl}/CardapioItems/${item.id}`, {
                method: "DELETE",
                headers: headers
            });
        }
        
        closeModal('clearAllModal');
        initial();
    } catch (error) {
        console.error('Erro ao limpar todos os itens:', error);
        alert('Erro ao limpar todos os itens.');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }
}

// Inicializar a aplicação
initial();