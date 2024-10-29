// Variáveis globais
let pedido = [];
const chavePix = "66814243334";
const tipoChavePix = "CPF";
const banco = "Santander";
const titular = "JOSE ARIMATEIA RODRIGUES JUNIOR";
let taxaEntrega = 0;

const botaoFinalizar = document.querySelector('.finalizar-pedido');

// Função para adicionar ou remover itens do pedido
function adicionarItem(nome, preco, elemento) {
    if (elemento.classList.contains('selecionado')) {
        elemento.classList.remove('selecionado');
        pedido = pedido.filter(item => item.nome !== nome);
    } else {
        elemento.classList.add('selecionado');
        pedido.push({ nome, preco });
    }
    atualizarResumoPedido();
    atualizarVisibilidadeBotao();
}

// Função para atualizar o resumo do pedido no botão
function atualizarResumoPedido() {
    botaoFinalizar.innerText = `Finalizar Pedido - ${pedido.length} itens`;
}

// Função para controlar a visibilidade do botão "Finalizar Pedido"
function atualizarVisibilidadeBotao() {
    botaoFinalizar.style.display = pedido.length > 0 ? 'block' : 'none';
}

// Função para mostrar o modal de confirmação do pedido
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

    botaoFinalizar.style.display = 'none';
    modal.style.display = 'flex';
    background.style.display = 'block';
}

// Função para fechar o modal e exibir o botão novamente
function cancelarPedido() {
    document.querySelector('.modal-confirmacao').style.display = 'none';
    document.querySelector('.modal-background').style.display = 'none';
    atualizarVisibilidadeBotao();
}

// Função para calcular a taxa de entrega com base no bairro e atualizar o total no modal
function calcularTaxaEntrega(event) {
    event.preventDefault(); // Previne o comportamento padrão de envio

    const bairro = document.getElementById("bairro").value.trim().toLowerCase();
    const taxaEntregaTexto = document.getElementById("taxa-entrega");
    let total = pedido.reduce((acc, item) => acc + item.preco, 0); // Calcula o total inicial

    if (bairro === "araturi" || bairro === "arianopolis") {
        taxaEntrega = 2.00;
        taxaEntregaTexto.innerText = "Taxa de entrega: R$ 2,00";
        taxaEntregaTexto.style.color = "#FFD700";
    } else if (bairro === "jurema" || bairro === "metropole") {
        taxaEntrega = 3.00;
        taxaEntregaTexto.innerText = "Taxa de entrega: R$ 3,00";
        taxaEntregaTexto.style.color = "#FFD700";
    } else {
        taxaEntrega = 0;
        taxaEntregaTexto.innerText = "Bairro fora da área de entrega.";
        taxaEntregaTexto.style.color = "#FF4500";
        return; // Não prossegue com o cálculo se o bairro estiver fora da área de entrega
    }

    total += taxaEntrega; // Adiciona a taxa de entrega ao total

    // Atualiza o total no modal
    const resumoPedido = document.querySelector('.resumo-pedido');
    resumoPedido.innerHTML = '';
    pedido.forEach(item => {
        resumoPedido.innerHTML += `<p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>`;
    });
    resumoPedido.innerHTML += `<p>Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}</p>`;
    resumoPedido.innerHTML += `<p><strong>Total com entrega: R$ ${total.toFixed(2)}</strong></p>`;
}

// Função para enviar o pedido via WhatsApp
function enviarPedido() {
    let mensagemPedido = "*Olá, gostaria de fazer o pedido:*\n\n";
    let total = pedido.reduce((acc, item) => acc + item.preco, 0); // Calcula o total inicial

    pedido.forEach(item => {
        mensagemPedido += `- *${item.nome}:* R$ ${item.preco.toFixed(2)}\n`;
    });

    total += taxaEntrega;
    mensagemPedido += `\n*Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}*`;
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
document.getElementById("bairro").addEventListener("input", calcularTaxaEntrega);

// Função para alternar o menu hamburguer
function toggleMenu() {
    const menu = document.querySelector('.dropdown-menu');
    menu.classList.toggle('show');
}

// Inicialmente, o botão "Finalizar Pedido" está escondido
atualizarVisibilidadeBotao();
