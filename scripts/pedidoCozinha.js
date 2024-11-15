import {baseUrl,headers} from "./api.js"

let selectedItem = null;

async function verificarConexaoAPI() {
    try {
        const response = await fetch(`${baseUrl}/PedidoCozinhas?situacaoId=0`, { headers });
        
        if (!response.ok) {
            throw new Error(`Erro de conexão: ${response.status}`);
        }
        
        const data = await response.json();
    
        console.log('Conexão com API estabelecida. Dados recebidos:', data);
        return true;
    } catch (error) {
        mostrarErro('Não foi possível conectar ao servidor. Verifique se a API está em funcionamento.');
        return false;
    }
}

async function get0(params) {
    const response0 = await fetch(`${baseUrl}/PedidoCozinhas?situacaoId=1`, {
        method: 'GET',
        headers: headers
    });
    
    if (response0.ok) {
        const pedidos0 = await response0.json();
        // Se encontrar pedidos com situação 0, atualiza cada um para situação 1
        for (const pedido of pedidos0) {
          
            await fetch(`${baseUrl}/PedidoCozinhas/${pedido.id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({
                    
                    novoStatusId: 1
                })
            });
       
        }
    }
}
async function buscarTodosPedidos() {
    try {
        // Mudando para buscar apenas situações 1, 2 e 3
        const situacoes = [1, 2, 3];
        
        // Agora busca as situações regulares (1, 2, 3)
        for (const situacaoId of situacoes) {
            console.log(`Buscando pedidos - Situação ${situacaoId}`);
            const response = await fetch(`${baseUrl}/PedidoCozinhas?situacaoId=${situacaoId}`, {
                method: 'GET',
                headers: headers
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const pedidos = await response.json();
            console.log(`Pedidos recebidos (Situação ${situacaoId}):`, pedidos);
            atualizarKanban(pedidos, situacaoId);
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        mostrarErro('Erro ao carregar pedidos. Verifique a conexão.');
        return false;
    }
}


async function atualizarStatusPedido(pedidoId, novoStatus,elemento) {
    console.log(elemento,"elemento",novoStatus,"novo status")
    try {
        console.log(`Atualizando status do pedido ${pedidoId} para ${novoStatus}`);
        const response = await fetch(`${baseUrl}/PedidoCozinhas/${pedidoId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                id: pedidoId,
                novoStatusId: novoStatus
            })
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar status: ${response.status}`);
        }
        elemento.setAttribute('data-status', getSituacaoNome(novoStatus));
        console.log(elemento,"elemento atualizado?")
        await buscarTodosPedidos(false);
        mostrarSucesso('Status atualizado com sucesso!');
    } catch (error) {
        console.error('Erro na atualização:', error);
        mostrarErro('Erro ao atualizar status do pedido.');
    }
}

async function excluirPedido(pedidoId) {
    try {
        console.log(`Excluindo pedido ${pedidoId}`);
        const response = await fetch(`${baseUrl}/PedidoCozinhas/${pedidoId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir pedido: ${response.status}`);
        }

        await buscarTodosPedidos();
        mostrarSucesso('Pedido excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir:', error);
        mostrarErro('Erro ao excluir o pedido.');
    }
}

function atualizarKanban(pedidos, situacaoId) {
    const colunas = {
        0:"preparo",
        1: "preparo",
        2: 'andamento',
        3: 'finalizado'
    };
    const colunaId = colunas[situacaoId];
    const coluna = document.getElementById(colunaId);
    
    if (!coluna) {
        console.error(`Coluna não encontrada para situação ${situacaoId}`);
        return;
    }

    // Mantém o cabeçalho
    const cabecalho = coluna.querySelector('h2');
    coluna.innerHTML = '';
    if (cabecalho) {
        coluna.appendChild(cabecalho);
    }

    pedidos.forEach(pedido => {
        const pedidoElement = criarElementoPedido(pedido);
        if (pedidoElement) {
            coluna.appendChild(pedidoElement);
        }
    });
}

function criarElementoPedido(pedido) {
    if (!pedido) return null;
    console.log(pedido,"pedido criar elemento")
    const div = document.createElement('div');
    div.className = 'item';
    if(!div.getAttribute("data-status")){

        div.setAttribute('data-status', getSituacaoNome(pedido.situacaoId));
    }
    console.log(div.getAttribute('data-status'))
    div.setAttribute('data-pedido-id', pedido.id);

    div.innerHTML = `
        <div class="pedido-info">
            <strong>Pedido #${pedido.id}</strong>
            <p>Mesa: ${pedido.numeroMesa || 'N/A'}</p>
            ${pedido.titulo ? `<p>${pedido.titulo}</p>` : ''}
        </div>
    `;

    return div;
}

function getSituacaoNome(situacaoId) {
    console.log(situacaoId,"id da situacao")
    const situacoes = {
        0:"preparo",
        1: "preparo",
        2: 'andamento',
        3: 'finalizado'
    };
    return situacoes[situacaoId] || 'preparo';
}

function mostrarErro(mensagem) {
    console.error(mensagem);
    alert(mensagem);
}

function mostrarSucesso(mensagem) {
    console.log(mensagem);
}

// Eventos
function handleItemClick(e) {
    const itemClicado = e.target.closest('.item');
    if (!itemClicado) return;

    const status = itemClicado.getAttribute('data-status');
    selectedItem = itemClicado;
    console.log(selectedItem, status,"click"); 

    if (status === 'finalizado') {
        abrirModal('modalExcluir', itemClicado);
    } else if (status === 'preparo') {
        abrirModal('modalIniciar', itemClicado);
    } else if (status === 'andamento') {
        abrirModal('modalFinalizar', itemClicado);
    }
}

function abrirModal(modalId, item) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const contentId = modalId === 'modalIniciar' ? 'modalPedidoContent' : 
                     modalId === 'modalFinalizar' ? 'modalFinalizarContent' : 
                     'modalExcluirContent';
    const modalContent = document.getElementById(contentId);
    if (modalContent) {
        modalContent.innerHTML = item.innerHTML;
    }
    modal.style.display = 'block';
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
    selectedItem = null;
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando aplicação...');
    await get0()

    // Configura eventos
    document.addEventListener('click', handleItemClick);

    // Configurar botões de cancelar para cada modal
    const botoesFechar = document.querySelectorAll('.btn-cancelar, .close-button');
    botoesFechar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            // Encontra o modal pai mais próximo
            const modal = botao.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                selectedItem = null;
            }
        });
    });

    const btnIniciar = document.getElementById('btnIniciarComanda');
    if (btnIniciar) {
        btnIniciar.addEventListener('click', async () => {
            if (selectedItem) {
                const pedidoId = selectedItem.getAttribute('data-pedido-id');
                let statusId = selectedItem.parentNode.id;
                if(statusId === "finalizado") {
                    statusId = 3;
                }
                if(statusId === "andamento") {
                    statusId = 2;
                }
                if(statusId === "preparo") {
                    statusId = 1;
                }
                await atualizarStatusPedido(pedidoId, statusId+1,selectedItem);
                fecharModal('modalIniciar');
            }
        });
    }

    const btnFinalizar = document.getElementById('btnFinalizarComanda');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', async () => {
            if (selectedItem) {
                const pedidoId = selectedItem.getAttribute('data-pedido-id');
                await atualizarStatusPedido(pedidoId, 3);
                fecharModal('modalFinalizar');
            }
        });
    }

    const btnExcluir = document.getElementById('btnExcluirComanda');
    if (btnExcluir) {
        btnExcluir.addEventListener('click', async () => {
            if (selectedItem) {
                const pedidoId = selectedItem.getAttribute('data-pedido-id');
                await excluirPedido(pedidoId);
                fecharModal('modalExcluir');
            }
        });
    }

    // Fechar modal quando clicar fora dele
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                selectedItem = null;
            }
        });
    });

    // Carrega pedidos iniciais
    
    await buscarTodosPedidos();

    
    
    // Atualização automática
    setInterval(buscarTodosPedidos, 5000);
});