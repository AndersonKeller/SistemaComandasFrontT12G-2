// URL base da API
const API_BASE_URL = 'http://localhost:7168/api'; // Ajuste conforme sua porta

// Estado global
let selectedItem = null;

// Função para buscar pedidos pendentes
async function buscarPedidosPendentes() {
    try {
        const response = await fetch(`${API_BASE_URL}/PedidoCozinhas`);
        const pedidos = await response.json();
        atualizarKanban(pedidos);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
    }
}

// Função para atualizar o Kanban com os pedidos
function atualizarKanban(pedidos) {
    const preparoColumn = document.getElementById('preparo');
    const andamentoColumn = document.getElementById('andamento');
    const finalizadoColumn = document.getElementById('finalizado');

    // Limpar colunas
    preparoColumn.innerHTML = '<h2>Em Preparo</h2>';
    andamentoColumn.innerHTML = '<h2>Em Andamento</h2>';
    finalizadoColumn.innerHTML = '<h2>Finalizado</h2>';

    pedidos.forEach(pedido => {
        const pedidoElement = criarElementoPedido(pedido);
        
        switch(pedido.situacaoId) {
            case 1: // Pendente/Preparo
                preparoColumn.appendChild(pedidoElement);
                break;
            case 2: // Em Andamento
                andamentoColumn.appendChild(pedidoElement);
                break;
            case 3: // Finalizado
                finalizadoColumn.appendChild(pedidoElement);
                break;
        }
    });
}

// Função para criar elemento do pedido
function criarElementoPedido(pedido) {
    const div = document.createElement('div');
    div.className = 'item';
    div.setAttribute('data-status', getSituacaoNome(pedido.situacaoId));
    div.setAttribute('data-pedido-id', pedido.id);

    let itensHtml = '<ul>';
    pedido.itens.forEach(item => {
        itensHtml += `<li>${item.titulo}</li>`;
    });
    itensHtml += '</ul>';

    div.innerHTML = `
        Pedido #${pedido.id}
        Mesa: ${pedido.comandaNumeroMesa}
        ${itensHtml}
    `;

    return div;
}

// Função para obter nome da situação
function getSituacaoNome(situacaoId) {
    switch(situacaoId) {
        case 1: return 'preparo';
        case 2: return 'andamento';
        case 3: return 'finalizado';
        default: return 'preparo';
    }
}

// Função para atualizar status do pedido
async function atualizarStatusPedido(pedidoId, novoStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/PedidoCozinhas/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: pedidoId,
                situacaoId: novoStatus
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar status do pedido');
        }

        // Atualizar interface
        await buscarPedidosPendentes();
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Event listeners
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

document.getElementById('btnIniciarComanda').addEventListener('click', async () => {
    if (selectedItem) {
        const pedidoId = selectedItem.getAttribute('data-pedido-id');
        await atualizarStatusPedido(pedidoId, 2); // Status 2 = Em Andamento
        fecharModal('modalIniciar');
    }
});

document.getElementById('btnFinalizarComanda').addEventListener('click', async () => {
    if (selectedItem) {
        const pedidoId = selectedItem.getAttribute('data-pedido-id');
        await atualizarStatusPedido(pedidoId, 3); // Status 3 = Finalizado
        fecharModal('modalFinalizar');
    }
});

// Funções dos modais
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

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    const modais = document.querySelectorAll('.modal');
    modais.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Iniciar busca de pedidos quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    buscarPedidosPendentes();
    // Atualizar a cada 30 segundos
    setInterval(buscarPedidosPendentes, 30000);
});