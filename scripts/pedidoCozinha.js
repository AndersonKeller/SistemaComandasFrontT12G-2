let selectedItem = null;

// Event listeners para cliques nos cards
document.addEventListener('click', (e) => {
    const clickedItem = e.target.closest('.item');
    if (!clickedItem) return;

    const status = clickedItem.getAttribute('data-status');
    selectedItem = clickedItem;

    if (status === 'preparo') {
        abrirModalIniciar(clickedItem);
    } else if (status === 'andamento') {
        abrirModalFinalizar(clickedItem);
    }
});

// Funções para manipular os modais
function abrirModalIniciar(item) {
    const modal = document.getElementById('modalIniciar');
    const modalContent = document.getElementById('modalPedidoContent');
    modalContent.innerHTML = item.innerHTML;
    modal.style.display = 'block';
}

function abrirModalFinalizar(item) {
    const modal = document.getElementById('modalFinalizar');
    const modalContent = document.getElementById('modalFinalizarContent');
    modalContent.innerHTML = item.innerHTML;
    modal.style.display = 'block';
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Event listeners para os botões dos modais
document.getElementById('btnIniciarComanda').addEventListener('click', () => {
    if (selectedItem) {
        const andamentoColumn = document.getElementById('andamento');
        selectedItem.setAttribute('data-status', 'andamento');
        andamentoColumn.appendChild(selectedItem);
        fecharModal('modalIniciar');
    }
});

document.getElementById('btnFinalizarComanda').addEventListener('click', () => {
    if (selectedItem) {
        const finalizadoColumn = document.getElementById('finalizado');
        selectedItem.setAttribute('data-status', 'finalizado');
        finalizadoColumn.appendChild(selectedItem);
        fecharModal('modalFinalizar');
    }
});

// Fechar modal ao clicar fora dele
window.addEventListener('click', (e) => {
    const modais = document.querySelectorAll('.modal');
    modais.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});