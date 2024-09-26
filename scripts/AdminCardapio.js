let currentEditItem;

function removeItem(button) {
    button.closest('.item').remove();
}

function addItem() {
    const itemsList = document.getElementById('items-list');
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.innerHTML = `
        <span>Novo Item</span>
        <div>
            <button onclick="editItem(this)">✏️</button>
            <button onclick="removeItem(this)">❌</button>
        </div>
    `;
    itemsList.appendChild(newItem);
}

function editItem(button) {
    currentEditItem = button.closest('.item').querySelector('span');
    const modal = document.getElementById('editModal');
    const input = document.getElementById('editInput');
    input.value = currentEditItem.textContent;
    modal.style.display = 'block';
}

function saveEdit() {
    const input = document.getElementById('editInput');
    currentEditItem.textContent = input.value;
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
}

function clearAll() {
    if (confirm('Tem certeza que deseja remover todos os itens do cardápio?')) {
        const itemsList = document.getElementById('items-list');
        while (itemsList.firstChild) {
            itemsList.removeChild(itemsList.firstChild);
        }
    }
}

// Fechar o modal quando clicar no X
document.querySelector('.close').onclick = closeModal;

// Fechar o modal quando clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}