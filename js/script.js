// Variáveis globais
let pedido = [];
const chavePix = "66814243334";
const tipoChavePix = "CPF";
const banco = "Santander";
const titular = "JOSE ARIMATEIA RODRIGUES JUNIOR";
let taxaEntrega = 0;

const botaoFinalizar = document.querySelector('.finalizar-pedido');

// Variável global para armazenar as escolhas da massa
let escolhaMassa = {
  tipo: null,
  molho: null,
  ingredientes: []
};

let escolhaAcompanhamento = []; // Variável para armazenar os acompanhamentos escolhidos

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

// Função para atualizar o resumo do pedido no botão "Finalizar Pedido"
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

// Função para fechar o modal de confirmação do pedido
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
  const botaoConfirmar = document.querySelector('.confirmar'); // Botão "Tudo certo, pode pedir!"
  let total = pedido.reduce((acc, item) => acc + item.preco, 0); // Calcula o total inicial

// Verifica se o bairro é atendido
if (bairro === "araturi") {
  taxaEntrega = 2.00;
  taxaEntregaTexto.innerText = "Taxa de entrega: R$ 2,00";
  taxaEntregaTexto.style.color = "#7DDA58";
  botaoConfirmar.disabled = false; // Habilita o botão de confirmação do pedido
} else if (bairro === "arianopolis") {
  taxaEntrega = 4.00;
  taxaEntregaTexto.innerText = "Taxa de entrega: R$ 4,00";
  taxaEntregaTexto.style.color = "#7DDA58";
  botaoConfirmar.disabled = false; // Habilita o botão de confirmação do pedido
} else if (bairro === "jurema" || bairro === "metropole") {
  taxaEntrega = 5.00;
  taxaEntregaTexto.innerText = "Taxa de entrega: R$ 5,00";
  taxaEntregaTexto.style.color = "#7DDA58";
  botaoConfirmar.disabled = false; // Habilita o botão de confirmação do pedido
} else if (bairro === "potira") {
  taxaEntrega = 6.00;
  taxaEntregaTexto.innerText = "Taxa de entrega: R$ 6,00";
  taxaEntregaTexto.style.color = "#FFDE59";
  botaoConfirmar.disabled = false; // Habilita o botão de confirmação do pedido
} else {
  // Caso o bairro não seja atendido
  taxaEntrega = 0;
  taxaEntregaTexto.innerText = "Bairro não atendido";
  taxaEntregaTexto.style.color = "#FF0000"; // Cor vermelha para indicar erro
  botaoConfirmar.disabled = true; // Desabilita o botão de confirmação do pedido
  
  // Exibe o alerta estilizado informando que o bairro não é atendido
  exibirErroEstilizado("Bairro fora da área de entrega. Por favor, escolha um bairro válido.");
  return; // Não prossegue com o cálculo se o bairro estiver fora da área de entrega
}

// Adiciona a taxa de entrega ao total se o bairro for atendido
total += taxaEntrega; 


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
function exibirErroEstilizado(mensagem) {
  const erro = document.createElement('div');
  erro.classList.add('erro-mensagem');
  erro.innerText = mensagem;
  document.body.appendChild(erro);

  setTimeout(() => {
    erro.remove();
  }, 3000);
}

// Função para enviar o pedido via WhatsApp
function enviarPedido() {
  const nome = document.getElementById("nome").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const observacao = document.getElementById("observacao").value.trim();

  // Verifica se os campos de nome, bairro e endereço estão preenchidos
  if (!nome || !bairro || !endereco) {
    exibirErroEstilizado("Por favor, preencha o nome, bairro e endereço antes de prosseguir!");
    return; // Sai da função para impedir o envio do pedido incompleto
  }

  let mensagemPedido = `*Olá, sou ${nome} e gostaria de fazer o pedido:*\n\n`;
  let total = pedido.reduce((acc, item) => acc + item.preco, 0);

  // Adiciona os itens do pedido à mensagem
  pedido.forEach(item => {
    mensagemPedido += `- *${item.nome}:* R$ ${item.preco.toFixed(2)}\n`;
  });

  // Verifica se o item "Massas" está no pedido antes de adicionar as escolhas de massas
  const massaNoPedido = pedido.find(item => item.nome === "Massas");
  if (massaNoPedido && escolhaMassa.tipo && escolhaMassa.molho.length > 0) {
    mensagemPedido += `\n*Opções de Massas:*\n`;
    mensagemPedido += `- Massa: ${escolhaMassa.tipo}\n`;
    mensagemPedido += `- Molhos: ${escolhaMassa.molho.join(', ')}\n`; // Envia todos os molhos selecionados
    if (escolhaMassa.ingredientes.length > 0) {
      mensagemPedido += `- Ingredientes: ${escolhaMassa.ingredientes.join(', ')}\n`;
    }
  }

  total += taxaEntrega;
  mensagemPedido += `\n*Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}*`;
  mensagemPedido += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
  mensagemPedido += `- *Nome:* ${nome}\n`;
  mensagemPedido += `- *Endereço:* ${endereco}\n`;
  mensagemPedido += `- *Bairro:* ${bairro}\n`;
  mensagemPedido += `- *Observação:* ${observacao}\n\n`;
  mensagemPedido += `*Para pagamento via PIX:*\n`;
  mensagemPedido += `- *Tipo da Chave:* ${tipoChavePix}\n`;
  mensagemPedido += `- *Chave PIX:* ${chavePix}\n`;
  mensagemPedido += `- *Banco:* ${banco}\n`;
  mensagemPedido += `- *Titular:* ${titular}\n\n`;
  mensagemPedido += `*Obrigado por escolher Ari Jo Lanches!*`;

  // URL para envio do pedido via WhatsApp
  const urlPedido = `https://api.whatsapp.com/send?phone=5585987764006&text=${encodeURIComponent(mensagemPedido)}`;
  window.open(urlPedido, '_blank');

  // Exibe a confirmação de que o pedido foi enviado com sucesso
  exibirConfirmacao("Pedido confirmado e enviado para o WhatsApp! Por favor, realize o pagamento via PIX ou em dinheiro na entrega.");

  // Limpa o pedido, fecha o modal e reseta a seleção visual
  pedido = [];
  escolhaMassa = { tipo: null, molho: [], ingredientes: [] }; // Reseta os molhos como array
  atualizarResumoPedido();
  atualizarVisibilidadeBotao();
  cancelarPedido(); // Fecha o modal de confirmação

  // Limpa as seleções visuais de todos os itens
  document.querySelectorAll('.menu-items .item').forEach(item => item.classList.remove('selecionado'));
}



// Função para exibir a confirmação de pedido enviado
function exibirConfirmacao(mensagem) {
  const confirmacao = document.createElement('div');
  confirmacao.classList.add('confirmacao-mensagem');
  confirmacao.innerText = mensagem;
  document.body.appendChild(confirmacao);

  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    confirmacao.remove();
  }, 5000);
}


// Função para exibir a confirmação de pedido enviado
function exibirConfirmacao(mensagem) {
  const confirmacao = document.createElement('div');
  confirmacao.classList.add('confirmacao-mensagem');
  confirmacao.innerText = mensagem;
  document.body.appendChild(confirmacao);

  // Remove a mensagem após 3 segundos
  setTimeout(() => {
    confirmacao.remove();
  }, 3000);
}



// Funções para abrir e fechar o modal de massas
function abrirModalMassa() {
  document.querySelector('.modal-massa').style.display = 'block';
  document.querySelector('.modal-background').style.display = 'block';
}

function fecharModalMassa() {
  document.querySelector('.modal-massa').style.display = 'none';
  document.querySelector('.modal-background').style.display = 'none';
}

// Função para verificar a quantidade de ingredientes selecionados
function verificarLimiteIngredientes() {
  const ingredientesSelecionados = document.querySelectorAll('input[name="ingrediente"]:checked');
  const checkboxesIngredientes = document.querySelectorAll('input[name="ingrediente"]');

  if (ingredientesSelecionados.length >= 8) {
    // Desabilita os checkboxes não selecionados
    checkboxesIngredientes.forEach(checkbox => {
      if (!checkbox.checked) {
        checkbox.disabled = true;
      }
    });
  } else {
    // Habilita todos os checkboxes se a quantidade for menor que 8
    checkboxesIngredientes.forEach(checkbox => {
      checkbox.disabled = false;
    });
  }
}

// Adiciona o evento para verificar o limite ao selecionar ingredientes
document.querySelectorAll('input[name="ingrediente"]').forEach(checkbox => {
  checkbox.addEventListener('change', verificarLimiteIngredientes);
});



// Função para confirmar a escolha de massas e fechar o modal
function confirmarEscolhaMassa() {
  const massaEscolhida = document.querySelector('input[name="massa"]:checked');
  const molhosEscolhidos = document.querySelectorAll('input[name="molho"]:checked');
  const ingredientesSelecionados = document.querySelectorAll('input[name="ingrediente"]:checked');
  const acompanhamentosSelecionados = document.querySelectorAll('input[name="acompanhamento"]:checked');

  // Verifica se todas as opções estão desmarcadas
  if (!massaEscolhida && molhosEscolhidos.length === 0 && ingredientesSelecionados.length === 0 && acompanhamentosSelecionados.length === 0) {
    // Se nada está selecionado, remove "Massas" do pedido e desmarca visualmente
    pedido = pedido.filter(item => item.nome !== "Massas");
    document.querySelector('.menu-items .item.massa').classList.remove('selecionado');
    atualizarResumoPedido();
    fecharModalMassa();
    return;
  }

  // Se há uma seleção de massa e algum molho, processa normalmente
  if (massaEscolhida && molhosEscolhidos.length > 0) {
    // Armazena as escolhas na variável global
    escolhaMassa.tipo = massaEscolhida.value;
    escolhaMassa.molho = Array.from(molhosEscolhidos).map(molho => molho.value); // Captura todos os molhos selecionados
    escolhaMassa.ingredientes = Array.from(ingredientesSelecionados).map(ing => ing.value);
    escolhaMassa.acompanhamentos = Array.from(acompanhamentosSelecionados).map(acomp => acomp.value);

    // Adiciona o item "Massas" ao pedido se ainda não foi adicionado
    const massaIndex = pedido.findIndex(item => item.nome === "Massas");
    if (massaIndex === -1) {
      pedido.push({ nome: "Massas", preco: 16.00 });
    }

    // Marca o item "Massas" como selecionado visualmente
    document.querySelector('.menu-items .item.massa').classList.add('selecionado');

    atualizarResumoPedido();
    atualizarVisibilidadeBotao();
    fecharModalMassa();
  } else {
    // Exibe erro se massa ou molho não foi escolhido
    exibirErroEstilizado("Por favor, escolha uma massa e ao menos um molho!");
  }
}



// Função para cancelar a escolha de massas
function cancelarEscolhaMassa() {
  document.querySelector('.menu-items .item.massa').classList.remove('selecionado');
  pedido = pedido.filter(item => item.nome !== "Massas");
  escolhaMassa = { tipo: null, molho: null, ingredientes: [] };
  atualizarResumoPedido();
  fecharModalMassa();
}

// Eventos de confirmação e cancelamento
document.querySelector('.confirmar').addEventListener('click', enviarPedido);
document.querySelector('.cancelar').addEventListener('click', cancelarPedido);
document.getElementById("bairro").addEventListener("input", calcularTaxaEntrega);

// Função para alternar o menu hamburguer
function toggleMenu() {
  document.querySelector('.dropdown-menu').classList.toggle('show');
}

// Inicializa a visibilidade do botão "Finalizar Pedido"
atualizarVisibilidadeBotao();
