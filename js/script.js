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
    event.preventDefault();

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
      const response = await fetch("https://311f-45-186-134-166.ngrok-free.app/create_preference", { // Atualizado para ngrok
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(pedidoData)
      });

      if (response.ok) {
          const data = await response.json();
          window.location.href = data.init_point;
      } else {
          alert("Erro ao criar a preferência de pagamento. Tente novamente.");
      }
  } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar o pedido.");
  }
}

// Adiciona os eventos para os botões de confirmação e cancelamento
document.querySelector('.confirmar').addEventListener('click', enviarPedido);
document.querySelector('.cancelar').addEventListener('click', cancelarPedido);
document.getElementById("bairro").addEventListener("input", calcularTaxaEntrega);

async function verificarStatusPagamento() {
  try {
      const response = await fetch("https://311f-45-186-134-166.ngrok-free.app/status_pagamento"); // Atualizado para ngrok
      const data = await response.json();

      if (data.status === "approved") {
          alert("Pagamento confirmado! Obrigado pelo pedido.");
          window.location.href = "/success";
      }
  } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
  }
}

setInterval(verificarStatusPagamento, 5000); // Verifica o status a cada 5 segundos

// Função para alternar o menu hamburguer
function toggleMenu() {
    const menu = document.querySelector('.dropdown-menu');
    menu.classList.toggle('show');
}

atualizarVisibilidadeBotao();
