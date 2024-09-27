let items = [];
let currentEditItemIndex = null;

function loadItems() {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
            <p>${item.descricao}</p>
            <div>
                <button onclick="editItem(${index})">✏️</button>
                <button onclick="removeItem(${index})">❌</button>
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
        <button onclick="addItem()">Adicionar</button>
    `;
    const modal = createModal('addItemModal', modalContent);
    modal.style.display = 'block';
}

function addItem() {
    const nameInput = document.getElementById('addItemInput');
    const priceInput = document.getElementById('addItemPrice');
    const descriptionInput = document.getElementById('addItemDescription');
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const description = descriptionInput.value.trim();

    if (name && !isNaN(price) && description) {
        items.push({ nome: name, preco: price, descricao: description });
        nameInput.value = '';
        priceInput.value = '';
        descriptionInput.value = '';
        closeModal('addItemModal');
        loadItems();
    } else {
        alert('Por favor, insira um nome, um preço e uma descrição válidos.');
    }
}

function removeItem(index) {
    items.splice(index, 1);
    loadItems();
}

function editItem(index) {
    currentEditItemIndex = index;
    const item = items[index];
    const modalContent = `
        <h3>Editar Item</h3>
        <input type="text" id="editInput" value="${item.nome}" />
        <input type="number" id="editPrice" value="${item.preco.toFixed(2)}" />
        <input type="text" id="editDescription" value="${item.descricao}" />
        <button onclick="saveEdit()">Salvar</button>
    `;
    const modal = createModal('editModal', modalContent);
    modal.style.display = 'block';
}

function saveEdit() {
    const nameInput = document.getElementById('editInput');
    const priceInput = document.getElementById('editPrice');
    const descriptionInput = document.getElementById('editDescription');
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const description = descriptionInput.value.trim();

    if (name && !isNaN(price) && description) {
        items[currentEditItemIndex] = { nome: name, preco: price, descricao: description };
        closeModal('editModal');
        loadItems();
    } else {
        alert('Por favor, insira um nome, um preço e uma descrição válidos.');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }
}

function showClearAllModal() {
    const modalContent = `
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja remover todos os itens?</p>
        <div class="modal-buttons">
            <button class="confirm-button" onclick="clearAll()">Confirmar</button>
            <button class="cancel-button" onclick="closeModal('clearAllModal')">Cancelar</button>
        </div>
    `;
    const modal = createModal('clearAllModal', modalContent);
    modal.style.display = 'block';
}

function clearAll() {
    items = [];
    loadItems();
    closeModal('clearAllModal');
}

// Carregar itens ao iniciar
loadItems();