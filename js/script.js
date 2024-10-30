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

// Função para mostrar o modal de confirmação do pedido e fundo embaraçado
function confirmarPedido() {
  const modal = document.querySelector('.modal-confirmacao');
  const background = document.querySelector('.modal-background');
  const resumoPedido = document.querySelector('.resumo-pedido');
  resumoPedido.innerHTML = '';
  let total = pedido.reduce((acc, item) => acc + item.preco, 0);

  pedido.forEach(item => {
    resumoPedido.innerHTML += `<p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>`;
  });
  resumoPedido.innerHTML += `<p><strong>Total: R$ ${total.toFixed(2)}</strong></p>`;

  botaoFinalizar.style.display = 'none';
  modal.style.display = 'flex';
  background.style.display = 'block';
}

// Função para fechar o modal e esconder o fundo embaraçado
function fecharModal() {
  document.querySelector('.modal-confirmacao').style.display = 'none';
  document.querySelector('.modal-background').style.display = 'none';
  atualizarVisibilidadeBotao();
}

// Função para calcular a taxa de entrega com base no bairro e atualizar o total no modal
function calcularTaxaEntrega() {
  const bairro = document.getElementById("bairro").value.trim().toLowerCase();
  const taxaEntregaTexto = document.getElementById("taxa-entrega");
  let total = pedido.reduce((acc, item) => acc + item.preco, 0);

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
    return;
  }

  total += taxaEntrega;

  const resumoPedido = document.querySelector('.resumo-pedido');
  resumoPedido.innerHTML = '';
  pedido.forEach(item => {
    resumoPedido.innerHTML += `<p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>`;
  });
  resumoPedido.innerHTML += `<p>Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}</p>`;
  resumoPedido.innerHTML += `<p><strong>Total com entrega: R$ ${total.toFixed(2)}</strong></p>`;
}

// Função para enviar o pedido ao backend e redirecionar ao Mercado Pago
async function enviarPedido() {
  let total = pedido.reduce((acc, item) => acc + item.preco, 0);
  const bairro = document.getElementById("bairro").value.trim().toLowerCase();
  const endereco = document.getElementById("endereco").value.trim();

  total += taxaEntrega;

  const pedidoData = {
    pedido: pedido,
    endereco: endereco,
    bairro: bairro,
    taxaEntrega: taxaEntrega,
    total: total
  };

  try {
    const response = await fetch("https://arijolanches.com.br/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pedidoData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Dados da resposta da criação de preferência:", data); // Adicionando um log para depuração
      // Redireciona o usuário para o checkout do Mercado Pago
      window.location.href = data.init_point;
    } else {
      console.error("Erro na resposta da API:", response.status, response.statusText);
      alert("Erro ao criar a preferência de pagamento. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    alert("Erro ao processar o pedido.");
  }
}

// Função para verificar o status do pagamento na página de status (status.html)
async function verificarStatusPagamento() {
  const urlParams = new URLSearchParams(window.location.search);
  const pedidoId = urlParams.get("pedidoId"); // Você pode passar o pedidoId na URL
  console.log("ID do pedido recebido:", pedidoId);

  if (!pedidoId) {
      console.warn("Pedido ID não encontrado.");
      document.getElementById("status-text").innerText = "ID de pedido não encontrado.";
      return;
  }

  try {
      // Buscando o preferenceId no banco de dados
      const preferenceResponse = await fetch(`https://arijolanches.com.br/get_preference_id/${pedidoId}`);
      const preferenceData = await preferenceResponse.json();

      if (!preferenceResponse.ok) {
          console.error("Erro ao buscar preferenceId:", preferenceData.error);
          document.getElementById("status-text").innerText = "Erro ao buscar preferenceId.";
          return;
      }

      const preferenceId = preferenceData.preferenceId;
      console.log("Preference ID recebido:", preferenceId);

      const response = await fetch(`https://arijolanches.com.br/status_pagamento/${preferenceId}`);
      console.log("Resposta do backend para status do pagamento:", response);

      if (!response.ok) {
          console.error("Erro na resposta do backend:", response.statusText);
          document.getElementById("status-text").innerText = "Erro ao verificar status do pagamento.";
          return;
      }

      const data = await response.json();
      console.log("Dados do status do pagamento recebidos:", data);
      console.log("Status do pagamento recebido:", data.status); // Log do status do pagamento

      const statusText = document.getElementById("status-text");
      if (data.status === "approved") {
          statusText.innerText = "Pagamento confirmado! Obrigado pelo pedido.";
          setTimeout(() => window.location.href = "https://arijo-lanches.vercel.app/success.html");
      } else if (data.status === "pending") {
          statusText.innerText = "Pagamento ainda pendente, verificando novamente...";
      } else if (data.status === "rejected") {
          statusText.innerText = "Pagamento foi rejeitado. Tente novamente.";
          setTimeout(() => window.location.href = "https://arijo-lanches.vercel.app/failure.html");
      } else {
          console.warn("Status desconhecido:", data.status);
          statusText.innerText = "Status do pagamento desconhecido.";
      }
  } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
      document.getElementById("status-text").innerText = "Erro ao verificar status do pagamento.";
  }
}


// Verifica se está na página de status antes de chamar verificarStatusPagamento
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("status.html")) {
    verificarStatusPagamento();
  } else if (window.location.pathname.includes("checkout.html")) {
    // Adiciona um listener para o evento de redirecionamento do Mercado Pago
    window.addEventListener("message", (event) => {
      if (event.origin === "https://www.mercadopago.com.br") {
        const data = event.data;
        if (data.type === "redirect") {
          window.location.href = data.url;
        }
      }
    });
  }
});


// Adiciona os eventos para os botões de confirmação e cancelamento
document.querySelector('.confirmar').addEventListener('click', enviarPedido);
document.querySelector('.cancelar').addEventListener('click', fecharModal);
document.getElementById("bairro").addEventListener("input", calcularTaxaEntrega);

// Função para alternar o menu hamburguer
function toggleMenu() {
  const menu = document.querySelector('.dropdown-menu');
  menu.classList.toggle('show');
}

// Inicializa a visibilidade do botão "Finalizar Pedido"
atualizarVisibilidadeBotao();
