let pedido = [];
const chavePix = "66814243334"; // Insira o CPF ou chave PIX sem pontos e traços
const tipoChavePix = "CPF"; // Tipo da chave PIX (ex: CPF, CNPJ, E-mail, Telefone, Aleatória)
const banco = "Santander"; // Nome do banco
const titular = "JOSE ARIMATEIA RODRIGUES JUNIOR"; // Nome do titular da conta

const botaoFinalizar = document.querySelector('.finalizar-pedido'); // Seleciona o botão de finalizar pedido

// Função para adicionar ou remover itens do pedido
function adicionarItem(nome, preco, elemento) {
    if (elemento.classList.contains('selecionado')) {
        elemento.classList.remove('selecionado');
        pedido = pedido.filter(item => item.nome !== nome); // Remove o item do pedido
    } else {
        elemento.classList.add('selecionado');
        pedido.push({ nome, preco }); // Adiciona o item ao pedido
    }
    atualizarResumoPedido();
    atualizarVisibilidadeBotao(); // Atualiza a visibilidade do botão sempre que o pedido muda
}

// Função para atualizar o texto do botão com o número de itens
function atualizarResumoPedido() {
    botaoFinalizar.innerText = `Finalizar Pedido - ${pedido.length} itens`;
}

// Função para controlar a visibilidade do botão "Finalizar Pedido"
function atualizarVisibilidadeBotao() {
    if (pedido.length > 0) {
        botaoFinalizar.style.display = 'block'; // Mostra o botão se houver itens no pedido
    } else {
        botaoFinalizar.style.display = 'none'; // Esconde o botão se não houver itens
    }
}

// Função para mostrar o modal de confirmação de pedido
function confirmarPedido() {
    const modal = document.querySelector('.modal-confirmacao');
    const background = document.querySelector('.modal-background');

    const resumoPedido = document.querySelector('.resumo-pedido');
    resumoPedido.innerHTML = '';
    let total = 0;

    pedido.forEach(item => {
        total += item.preco;
        resumoPedido.innerHTML += `<p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>`;
    });
    resumoPedido.innerHTML += `<p><strong>Total: R$ ${total.toFixed(2)}</strong></p>`;

    botaoFinalizar.style.display = 'none'; // Oculta o botão de finalizar pedido quando o modal está aberto
    modal.style.display = 'flex';
    background.style.display = 'block';
}

// Função para fechar o modal e exibir o botão novamente
function cancelarPedido() {
    document.querySelector('.modal-confirmacao').style.display = 'none';
    document.querySelector('.modal-background').style.display = 'none';
    atualizarVisibilidadeBotao(); // Atualiza a visibilidade do botão quando o modal fecha
}

// Função para enviar o pedido via WhatsApp
function enviarPedido(event) {
    event.preventDefault();

    let mensagemPedido = "*Olá, gostaria de fazer o pedido:*\n\n";
    let total = 0;

    // Formata cada item do pedido em uma nova linha
    pedido.forEach(item => {
        total += item.preco;
        mensagemPedido += `- *${item.nome}:* R$ ${item.preco.toFixed(2)}\n`;
    });

    // Adiciona o total e informações de pagamento na mensagem
    mensagemPedido += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
    mensagemPedido += `*Para pagamento via PIX:*\n`;
    mensagemPedido += `- *Tipo da Chave:* ${tipoChavePix}\n`;
    mensagemPedido += `- *Chave PIX:* ${chavePix}\n`;
    mensagemPedido += `- *Banco:* ${banco}\n`;
    mensagemPedido += `- *Titular:* ${titular}\n\n`;
    mensagemPedido += `*Obrigado por escolher Ari Jo Lanches!*`;

    const urlPedido = `https://api.whatsapp.com/send?phone=5585987764006&text=${encodeURIComponent(mensagemPedido)}`;
    window.open(urlPedido, '_blank');
}

// Adiciona os eventos para os botões de confirmação e cancelamento
document.querySelector('.confirmar').addEventListener('click', enviarPedido);
document.querySelector('.cancelar').addEventListener('click', cancelarPedido);

// Função para alternar o menu hamburguer
function toggleMenu() {
    const menu = document.querySelector('.dropdown-menu');
    menu.classList.toggle('show');
}

// Inicialmente, o botão "Finalizar Pedido" está escondido
atualizarVisibilidadeBotao();
