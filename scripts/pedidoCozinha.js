import {baseUrl,headers} from "./api.js"


/**
 * aqui fui eu que fiz
 * @param {recebe a lista de pedidos da cozinha} pedidos 
 * @param {o id da situacao, 1, 2 ou 3} situacaoId 
 */
function atualizarKanban(pedidos,situacaoId) {
    const preparoColumn = document.getElementById('preparo');
    const andamentoColumn = document.getElementById('andamento');
    const finalizadoColumn = document.getElementById('finalizado');
    // Limpar colunas
    pedidos.forEach(pedido => {
        const pedidoElement = criarElementoPedido(pedido);
        switch(situacaoId) {
            case 1: // Pendente/Preparo
            console.log(typeof situacaoId)
         
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
    console.log(pedido,"pedido itens")
    const div = document.createElement('div');
    div.className = 'item';
    div.setAttribute('data-status', getSituacaoNome(pedido.situacaoId));
    div.setAttribute('data-pedido-id', pedido.id);

    let itensHtml = '<ul>';
 
        itensHtml += `<li>${pedido.titulo}</li>`;
   
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
        const response = await fetch(`${baseUrl}/Cardapio/${cardapioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: cardapioId,
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
        const pedidoId = selectedItem.getAttribute('data-cardapio-id');
        await atualizarStatusPedido(pedidoId, 2); // Status 2 = Em Andamento
        fecharModal('modalIniciar');
    }
});

document.getElementById('btnFinalizarComanda').addEventListener('click', async () => {
    if (selectedItem) {
        const pedidoId = selectedItem.getAttribute('data-cardapio-id');
        await atualizarStatusPedido(pedidoId, 3); // Status 3 = Finalizado
        fecharModal('modalFinalizar');
    }
});

// Funções dos modais
function abrirModalIniciar(item) {
    const modal = document.getElementById('modalIniciar');
    const modalContent = document.getElementById('modalCardapioContent');
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

// // Iniciar busca de pedidos quando a página carregar
// document.addEventListener('DOMContentLoaded', () => {
//    buscarPedidosPendentes();
//     // Atualizar a cada 30 segundos
//     setInterval(buscarPedidosPendentes, 30000);
// });
// async function buscarPedidosPendentes() {
//     const res = await fetch(`${baseUrl}/PedidoCozinhas?situacaoId=1`,{
//         headers:headers
//     })
//     const resJson = await res.json()
//     console.log(resJson,"resposta")
    
// }




async function buscarPedidosPendentes() {
    try {
        const res = await fetch(`${baseUrl}/PedidoCozinhas?situacaoId=1`, {
            headers: headers
        });
        const pedidos = await res.json();
        console.log(pedidos, "resposta");
        
        // Verifica se há pedidos e se são diferentes dos atuais
        if (pedidos && Array.isArray(pedidos)) {
            // Atualiza o Kanban com os pedidos recebidos
            atualizarKanban(pedidos,1);
        }
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
    }
}

// Função para buscar todos os status
async function buscarTodosPedidos() {

        // Busca pedidos em preparo (situacaoId=1)
        const preparo = await fetch(`${baseUrl}/PedidoCozinhas?situacaoId=1`, {
            headers: headers
        });
        const pedidosPreparo = await preparo.json();
        // Busca pedidos em andamento (situacaoId=2)
        const andamento = await fetch(`${baseUrl}/PedidoCozinhas?situacaoId=2`, {
            headers: headers
        });
        const pedidosAndamento = await andamento.json();
        // Busca pedidos finalizados (situacaoId=3)
        const finalizado = await fetch(`${baseUrl}/PedidoCozinhas?situacaoId=3`, {
            headers: headers
        });
        const pedidosFinalizados = await finalizado.json();
        // Combina todos os pedidos
        
        atualizarKanban(pedidosPreparo,1)
  
        atualizarKanban(pedidosAndamento,2)
       
        atualizarKanban(pedidosFinalizados,3)
        
     
}

// Atualiza o event listener do DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    buscarTodosPedidos(); // Busca inicial de todos os pedidos
    // Atualiza a cada 5 segundos
    // setInterval(buscarTodosPedidos, 5000);
});