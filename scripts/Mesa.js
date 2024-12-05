import { baseUrl, headers } from "./api.js";
let isAdmin = false
const usuarioSalvo = localStorage.getItem("usuario");
        if(usuarioSalvo === "admin@admin.com"){
            isAdmin =true
        }

// Expondo funções globalmente
window.showAddTableModal = showAddTableModal;
window.editTable = editTable;
window.deleteTable = deleteTable;
window.saveEdit = saveEdit;
window.confirmDelete = confirmDelete;
window.closeModal = closeModal;
window.saveNewTable = saveNewTable; // Adicionando saveNewTable ao escopo global

let currentEditTableId = null;

const addBtn = document.querySelector(".add-button")
if(!isAdmin){
    addBtn.setAttribute("style","display:none;")
}else{

    addBtn.addEventListener("click",showAddTableModal)
}

async function initial() {
    try {
        const res = await fetch(`${baseUrl}/Mesas`, {
            headers: headers
        });
        const tables = await res.json();
        loadTables(tables);
    } catch (error) {
        console.error('Erro ao carregar mesas:', error);
        alert('Erro ao carregar as mesas.');
    }
}

function loadTables(tables) {
    const tablesGrid = document.getElementById('tables-grid');
    tablesGrid.innerHTML = '';
    
    tables.forEach(table => {
        const tableElement = document.createElement('div');
        tableElement.className = 'table-card';
        tableElement.innerHTML = `
            <div class="table-header">
                <span class="table-number">Mesa ${table.numeroMesa}</span>
                <span class="table-status ${table.situacaoMesa === 0 ? 'status-free' : 'status-occupied'}">
                    ${table.situacaoMesa === 0 ? 'Vaga' : 'Ocupada'}
                </span>
            </div>
            ${isAdmin?`
            <div class="table-actions">
                <button class="edit-btn" onclick="editTable(${JSON.stringify(table).replace(/"/g, '&quot;')})">
                    Editar
                </button>
                <button class="delete-btn" onclick="deleteTable(${table.id})">
                    Excluir
                </button>
            </div>`:""}
        `;
        
        tablesGrid.appendChild(tableElement);
    });
}

function createModal(id, content) {
    console.log("criou o modal")
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close" onclick="closeModal('${id}')">&times;</button>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);

    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal(id);
        }
    };

    return modal;
}

function showAddTableModal() {
    const modalContent = 
    `<h3>Adicionar Nova Mesa</h3> 
    <input  id="addTableNumber" placeholder="Numero da mesa">
    <select id="addTableStatus">
        <option value="0">Vaga</option>
        <option value="1">Ocupada</option>
    </select>
    <div class="modal-buttons">
        <button class="confirm-button" onclick="saveNewTable()">Adicionar</button>
        <button class="cancel-button" onclick="closeModal('addTableModal')">Cancelar</button>
    </div>`;
    const modal = createModal('addTableModal', modalContent);
    modal.style.display = 'block';
   
}

async function saveNewTable() {
    const tableNumber = document.getElementById('addTableNumber').value;
    const tableStatus = document.getElementById('addTableStatus').value;
    console.log(document.getElementById('addTableNumber'),"input")
 console.log(tableNumber, "numeromesa")

    const newTable = {
        
        numeroMesa: parseInt(tableNumber),
        situacaoMesa: parseInt(tableStatus)
    };

    try {
        const res = await fetch(`${baseUrl}/Mesas`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTable)
        });

        if (res.ok) {
            closeModal('addTableModal');
            initial();
        } else {
            alert('Erro ao adicionar mesa.');
        }
    } catch (error) {
        console.error('Erro ao adicionar mesa:', error);
        alert('Erro ao adicionar mesa.');
    }
}


function editTable(table) {
    currentEditTableId = table.id;
    const modalContent = `
        <h3>Editar Mesa ${table.numeroMesa}</h3>
        <input type="number" id="editTableNumber" value="${table.numeroMesa}" min="1" />
        <select id="editTableStatus">
            <option value="0" ${table.situacaoMesa === 0 ? 'selected' : ''}>Vaga</option>
            <option value="1" ${table.situacaoMesa === 1 ? 'selected' : ''}>Ocupada</option>
        </select>
        <div class="modal-buttons">
            <button class="confirm-button" onclick="saveEdit()">Salvar</button>
            <button class="cancel-button" onclick="closeModal('editModal')">Cancelar</button>
        </div>
    `;
    const modal = createModal('editModal', modalContent);
    modal.style.display = 'block';
}

async function saveEdit() {
    const tableNumber = document.getElementById('editTableNumber').value;
    const tableStatus = document.getElementById('editTableStatus').value;

    if (!tableNumber) {
        alert('Por favor, insira um número de mesa válido.');
        return;
    }

    const updatedTable = {
        id: currentEditTableId,
        numeroMesa: parseInt(tableNumber),
        situacaoMesa: parseInt(tableStatus)
    };

    try {
        const res = await fetch(`${baseUrl}/Mesas/${currentEditTableId}`, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTable)
        });

        if (res.ok) {
            closeModal('editModal');
            initial();
        } else {
            alert('Erro ao atualizar mesa.');
        }
    } catch (error) {
        console.error('Erro ao atualizar mesa:', error);
        alert('Erro ao atualizar mesa.');
    }
}

function deleteTable(id) {
    const modalContent = `
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir esta mesa?</p>
        <div class="modal-buttons">
            <button class="confirm-button" onclick="confirmDelete(${id})">Confirmar</button>
            <button class="cancel-button" onclick="closeModal('deleteModal')">Cancelar</button>
        </div>
    `;
    const modal = createModal('deleteModal', modalContent);
    modal.style.display = 'block';
}

async function confirmDelete(id) {
    try {
        const res = await fetch(`${baseUrl}/Mesas/${id}`, {
            method: 'DELETE',
            headers: headers
        });

        if (res.ok) {
            closeModal('deleteModal');
            initial();
        } else {
            alert('Erro ao excluir mesa.');
        }
    } catch (error) {
        console.error('Erro ao excluir mesa:', error);
        alert('Erro ao excluir mesa.');
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