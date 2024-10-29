let pedido = [];
const chavePix = "66814243334"; // Insira o CPF ou chave PIX sem pontos e traços (ex: 12345678900)
const tipoChavePix = "CPF"; // Tipo da chave PIX (ex: CPF, CNPJ, E-mail, Telefone, Aleatória)
const banco = "Santander"; // Nome do banco
const titular = "JOSE ARIMATEIA RODRIGUES JUNIOR"; // Nome do titular da conta

function adicionarItem(nome, preco, elemento) {
    if (elemento.classList.contains('selecionado')) {
        elemento.classList.remove('selecionado');
        pedido = pedido.filter(item => item.nome !== nome);
    } else {
        elemento.classList.add('selecionado');
        pedido.push({ nome, preco });
    }
    atualizarResumoPedido();
}

function atualizarResumoPedido() {
    const botaoFinalizar = document.querySelector('.finalizar-pedido');
    botaoFinalizar.innerText = `Finalizar Pedido - ${pedido.length} itens`;
}

function confirmarPedido() {
  const modal = document.querySelector('.modal-confirmacao');
  const background = document.querySelector('.modal-background');
  const resumoPedido = document.querySelector('.resumo-pedido');
  const botaoFinalizar = document.querySelector('.finalizar-pedido'); // Seleciona o botão de finalizar pedido

  // Oculta o botão de finalizar pedido
  botaoFinalizar.style.display = 'none';
  // Centraliza o texto do resumo do pedido
  botaoFinalizar.style.textAlign = 'center';

  resumoPedido.innerHTML = '';
  let total = 0;
  pedido.forEach(item => {
      total += item.preco;
      resumoPedido.innerHTML += `<p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>`;
  });
  resumoPedido.innerHTML += `<p><strong>Total: R$ ${total.toFixed(2)}</strong></p>`;

  modal.style.display = 'flex';
  background.style.display = 'block';
}

function cancelarPedido() {
  const modal = document.querySelector('.modal-confirmacao');
  const background = document.querySelector('.modal-background');
  const botaoFinalizar = document.querySelector('.finalizar-pedido'); // Seleciona o botão de finalizar pedido

  // Mostra o botão de finalizar pedido novamente
  botaoFinalizar.style.display = 'flex';

  modal.style.display = 'none';
  background.style.display = 'none';
}

function enviarPedido(event) {
    event.preventDefault(); // Previne o comportamento padrão

    let mensagemPedido = "*Olá, gostaria de fazer o pedido:*\n\n";
    let total = 0;

    // Formata cada item do pedido em uma nova linha
    pedido.forEach(item => {
        total += item.preco;
        mensagemPedido += `- *${item.nome}:* R$ ${item.preco.toFixed(2)}\n`;
    });

    // Adiciona o total e informações de pagamento na mesma mensagem, com quebras de linha adicionais para melhor legibilidade
    mensagemPedido += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
    mensagemPedido += `*Para pagamento via PIX:*\n`;
    mensagemPedido += `- *Tipo da Chave:* ${tipoChavePix}\n`;
    mensagemPedido += `- *Chave PIX:* ${chavePix}\n`;
    mensagemPedido += `- *Banco:* ${banco}\n`;
    mensagemPedido += `- *Titular:* ${titular}\n\n`;
    mensagemPedido += `*Obrigado por escolher Ari Jo Lanches!*`;

    // Codifica a mensagem para garantir que caracteres especiais e quebras de linha sejam interpretados corretamente
    const urlPedido = `https://api.whatsapp.com/send?phone=5585987764006&text=${encodeURIComponent(mensagemPedido)}`;
    window.open(urlPedido, '_blank');
}

// Adiciona o evento apenas uma vez para evitar duplicidade
document.querySelector('.confirmar').addEventListener('click', enviarPedido);
document.querySelector('.cancelar').addEventListener('click', cancelarPedido);

function toggleMenu() {
  const menu = document.querySelector('.dropdown-menu');
  menu.classList.toggle('show'); // Adiciona ou remove a classe "show" para exibir ou ocultar o menu
}