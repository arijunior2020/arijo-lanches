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
    const container = document.querySelector('.container');

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
    container.classList.add('blur'); // Adiciona o efeito de desfoque ao conteúdo principal
}

// Função para fechar o modal e exibir o botão novamente
function cancelarPedido() {
    const container = document.querySelector('.container');
    document.querySelector('.modal-confirmacao').style.display = 'none';
    document.querySelector('.modal-background').style.display = 'none';
    container.classList.remove('blur'); // Remove o efeito de desfoque do conteúdo principal
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
        taxaEntregaTexto.style.color = "#7DDA58";
    } else if (bairro === "jurema" || bairro === "metropole") {
        taxaEntrega = 3.00;
        taxaEntregaTexto.innerText = "Taxa de entrega: R$ 3,00";
        taxaEntregaTexto.style.color = "#7DDA58";
    } else {
        taxaEntrega = 0;
        taxaEntregaTexto.innerText = "Bairro fora da área de entrega.";
        taxaEntregaTexto.style.color = "#FFDE59";
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

// Função para exibir mensagem de erro estilizada
function exibirErro(mensagem) {
    const erro = document.createElement('div');
    erro.classList.add('erro-mensagem');
    erro.innerText = mensagem;
    document.body.appendChild(erro);

    setTimeout(() => {
        erro.remove();
    }, 3000); // Remove a mensagem de erro após 3 segundos
}

// Função para verificar campos e enviar o pedido via WhatsApp
function enviarPedido() {
    const bairro = document.getElementById("bairro").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    // Verifica se os campos obrigatórios estão preenchidos
    if (!bairro || !endereco) {
        exibirErro("Por favor, preencha o bairro e o endereço antes de prosseguir!");
        return;
    }

    let mensagemPedido = "*Olá, gostaria de fazer o pedido:*\n\n";
    let total = pedido.reduce((acc, item) => acc + item.preco, 0); // Calcula o total inicial

    pedido.forEach(item => {
        mensagemPedido += `- *${item.nome}:* R$ ${item.preco.toFixed(2)}\n`;
    });

    total += taxaEntrega;
    mensagemPedido += `\n*Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}*`;
    mensagemPedido += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
    mensagemPedido += `- *Endereço:* ${endereco}\n`;
    mensagemPedido += `- *Bairro:* ${bairro}\n`;
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
