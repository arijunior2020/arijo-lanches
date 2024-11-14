// Variáveis globais
let pedido = [];
const chavePix = "66814243334";
const tipoChavePix = "CPF";
const banco = "Santander";
const titular = "JOSE ARIMATEIA RODRIGUES JUNIOR";
let taxaEntrega = 0;
let massaAtual = 1;
let quantidadeMassas = 0;

const botaoFinalizar = document.querySelector('.finalizar-pedido');

// Variável global para armazenar as escolhas da massa
let escolhaMassa = {
  tipo: null,
  molho: null,
  ingredientes: []
};

let escolhaAcompanhamento = []; // Variável para armazenar os acompanhamentos escolhidos

// Função para remover a massa do pedido e a borda de seleção
function removerMassa() {
  // Remove o item "Massa" do pedido
  pedido = pedido.filter(item => !item.nome.startsWith("Massa"));

  // Atualiza o resumo e a visibilidade do botão "Finalizar Pedido"
  atualizarResumoPedido();
  atualizarVisibilidadeBotao();

  // Remove a borda vermelha do item de massa
  const itemMassa = document.querySelector('.item.massa');
  if (itemMassa) {
    itemMassa.classList.remove('selecionado');
  }

  // Remove o botão "Remover Massa" após clicar
  const botaoRemover = document.querySelector('.botao-remover-massa');
  if (botaoRemover) {
    botaoRemover.remove();
  }
}

// Função para remover a massa do pedido e a borda de seleção
function removerMassaSelecionada() {
  // Remove o item "Massa" do pedido
  pedido = pedido.filter(item => !item.nome.startsWith("Massa"));

  // Atualiza o resumo e a visibilidade do botão "Finalizar Pedido"
  atualizarResumoPedido();
  atualizarVisibilidadeBotao();

  // Remove a borda vermelha do item de massa
  const itemMassa = document.querySelector('.item.massa');
  if (itemMassa) {
    itemMassa.classList.remove('selecionado');
  }

  // Oculta o botão "Remover Massa" após remover
  const botaoRemover = document.getElementById("botao-remover-massa");
  botaoRemover.style.display = 'none';
}

// Função para adicionar ou remover itens do pedido, excluindo massas
function adicionarItem(nome, preco, elemento) {
  if (nome === "Massa") {
    iniciarEscolhaMassa(elemento);
    document.getElementById('botao-remover-massa').style.display = 'block'; // Exibe o botão "Remover Massa"
    return; // Interrompe o fluxo aqui para massas
  }

  // Verifica se o item já foi selecionado
  let itemPedido = pedido.find(item => item.nome === nome);

  if (itemPedido) {
    return;
  } else {
    pedido.push({ nome, preco, quantidade: 1 });
    elemento.classList.add('selecionado');

    // Adiciona os controles de quantidade
    let controles = document.createElement("div");
    controles.className = "quantidade-controle";
    controles.innerHTML = `
      <button onclick="alterarQuantidade(event, '${nome}', -1, this)">-</button>
      <span class="quantidade">1</span>
      <button onclick="alterarQuantidade(event, '${nome}', 1, this)">+</button>
    `;
    elemento.appendChild(controles);
  }

  atualizarResumoPedido();
  atualizarVisibilidadeBotao();
}

// Função para alterar a quantidade do item (exceto massas)
function alterarQuantidade(event, nome, valor, button) {
  event.stopPropagation();

  let itemPedido = pedido.find(item => item.nome === nome);
  if (!itemPedido) return;

  itemPedido.quantidade += valor;

  if (itemPedido.quantidade <= 0) {
    pedido = pedido.filter(item => item.nome !== nome);
    button.closest('.item').classList.remove('selecionado');
    button.closest('.quantidade-controle').remove();
  } else {
    button.closest('.quantidade-controle').querySelector('.quantidade').innerText = itemPedido.quantidade;
  }

  atualizarResumoPedido();
  atualizarVisibilidadeBotao();
}

// Função para controlar a visibilidade do botão "Finalizar Pedido"
function atualizarVisibilidadeBotao() {
  botaoFinalizar.style.display = pedido.length > 0 ? 'block' : 'none';
}

function atualizarResumoPedido() {
  const totalItens = pedido.reduce((acc, item) => acc + item.quantidade, 0);
  const totalPreco = pedido.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  botaoFinalizar.innerText = `Finalizar Pedido - ${totalItens} itens - Total: R$ ${totalPreco.toFixed(2)}`;

  // Limpa o conteúdo atual do resumo
  const resumoPedido = document.querySelector('.resumo-pedido');
  resumoPedido.innerHTML = '';

  // Itera sobre cada item no pedido e adiciona ao resumo
  pedido.forEach((item, index) => {
      const totalItem = item.preco * item.quantidade;

      // Cria um elemento de item de resumo
      const itemResumo = document.createElement('div');
      itemResumo.classList.add('item-resumo');

      // Verifica se o item é uma massa e adiciona o botão "Remover" caso seja
      if (item.nome.startsWith("Massa")) {
          itemResumo.innerHTML = `
              <p>${item.nome} - R$ ${totalItem.toFixed(2)}</p>
              <button class="remover" onclick="removerMassa(${index})">Remover</button>
          `;
          console.log("Botão Remover criado para:", item.nome); // Verifique se o log aparece no console
      } else {
          itemResumo.innerHTML = `<p>${item.nome} - ${item.quantidade} x R$ ${item.preco.toFixed(2)} = R$ ${totalItem.toFixed(2)}</p>`;
      }

      // Adiciona o item ao resumo do pedido
      resumoPedido.appendChild(itemResumo);
      console.log(resumoPedido.innerHTML); // Verifique se o conteúdo está sendo adicionado ao resumo
  });
}



function removerMassa(index) {
  // Remove o item do pedido com base no índice fornecido
  pedido.splice(index, 1);

  // Encontra o elemento de massa na interface e remove a classe `selecionado`
  const massaElemento = document.querySelector('.item.massa');
  if (massaElemento) {
      massaElemento.classList.remove('selecionado');
  }

  // Oculta o botão de "Remover Massa" após remover o item
  const botaoRemoverMassa = document.getElementById('botao-remover-massa');
  if (botaoRemoverMassa) {
      botaoRemoverMassa.style.display = 'none';
  }

  // Atualiza o resumo do pedido e a visibilidade do botão "Finalizar Pedido"
  atualizarResumoPedido();
  atualizarVisibilidadeBotao();

  // Força a atualização visual do elemento
  massaElemento.offsetHeight; // Trigger reflow
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
    const totalItem = item.preco * item.quantidade;
    total += totalItem;
    resumoPedido.innerHTML += `<p>${item.nome} - ${item.quantidade} x R$ ${item.preco.toFixed(2)} = R$ ${totalItem.toFixed(2)}</p>`;
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
function calcularTaxaEntrega() {
  const bairro = document.getElementById("bairro").value;
  const taxaEntregaTexto = document.getElementById("taxa-entrega");
  const botaoConfirmar = document.querySelector('.confirmar'); // Botão "Tudo certo, pode pedir!"

  // Reseta taxa e estado do botão
  botaoConfirmar.disabled = true;
  taxaEntrega = 0;
  let total = pedido.reduce((acc, item) => acc + item.preco * item.quantidade, 0); // Calcula o total inicial

  // Definindo as taxas de entrega com base nos bairros
  const taxas = {
    araturi: 2.00,
    arianopolis: 4.00,
    jurema: 5.00,
    metropole: 5.00,
    potira: 6.00
  };

  if (taxas.hasOwnProperty(bairro)) {
    taxaEntrega = taxas[bairro];
    taxaEntregaTexto.style.color = "#7DDA58"; // Verde para indicar bairro atendido
    taxaEntregaTexto.innerText = `Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}`;
    botaoConfirmar.disabled = false; // Habilita o botão de confirmação
  } else {
    taxaEntregaTexto.style.color = "#FF0000"; // Vermelho para indicar bairro não atendido
    taxaEntregaTexto.innerText = "Bairro não atendido";
  }

  // Atualiza o total no modal
  total += taxaEntrega;
  const resumoPedido = document.querySelector('.resumo-pedido');
  resumoPedido.innerHTML = ''; // Limpa o conteúdo anterior
  pedido.forEach(item => {
    const totalItem = item.preco * item.quantidade;
    resumoPedido.innerHTML += `<p>${item.nome} - ${item.quantidade} x R$ ${item.preco.toFixed(2)} = R$ ${totalItem.toFixed(2)}</p>`;
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

function enviarPedido() {
  const nome = document.getElementById("nome").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const observacao = document.getElementById("observacao").value.trim();
  const formaPagamento = document.getElementById("forma-pagamento").value;
  const trocoInput = document.getElementById("troco").value.trim();

  if (!nome || !bairro || !endereco || !formaPagamento) {
      exibirErroEstilizado("Por favor, preencha todos os campos obrigatórios e selecione uma forma de pagamento!");
      return;
  }

  let mensagemPedido = `*Olá, sou ${nome} e gostaria de fazer o pedido:*\n\n`;
  let total = 0;

  pedido.forEach(item => {
      const totalItem = item.preco * item.quantidade;
      total += totalItem;
      
      if (item.nome.startsWith("Massa")) {
          mensagemPedido += `- *${item.nome} :*\n`;
          mensagemPedido += `  - Tipo: ${item.tipo}\n`;
          mensagemPedido += `  - Molhos: ${item.molhos.join(", ")}\n`;
          if (item.ingredientes.length > 0) {
              mensagemPedido += `  - Ingredientes: ${item.ingredientes.join(", ")}\n`;
          }
          if (item.acompanhamentos.length > 0) {
              mensagemPedido += `  - Acompanhamentos: ${item.acompanhamentos.join(", ")}\n`;
          }
          mensagemPedido += `  - Preço: R$ ${totalItem.toFixed(2)}\n`;
      } else {
          mensagemPedido += `- *${item.nome}:* ${item.quantidade} x R$ ${item.preco.toFixed(2)} = R$ ${totalItem.toFixed(2)}\n`;
      }
  });

  total += taxaEntrega;
  mensagemPedido += `\n*Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}*`;

  // Adiciona taxa de maquineta se o pagamento for em débito ou crédito
  if (formaPagamento === "debito" || formaPagamento === "credito") {
    total += 1.00;
    mensagemPedido += `\n*Taxa de maquineta: R$ 1,00*`;
  }

  mensagemPedido += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
  mensagemPedido += `- *Nome:* ${nome}\n`;
  mensagemPedido += `- *Endereço:* ${endereco}\n`;
  mensagemPedido += `- *Bairro:* ${bairro}\n`;
  mensagemPedido += `- *Observação:* ${observacao}\n`;
  mensagemPedido += `- *Forma de Pagamento:* ${formaPagamento.charAt(0).toUpperCase() + formaPagamento.slice(1)}\n`;

  // Adiciona o cálculo do troco se a forma de pagamento for "dinheiro"
  if (formaPagamento === "dinheiro" && trocoInput) {
    const trocoCalculado = parseFloat(trocoInput) - total;
    mensagemPedido += `- *Troco para:* R$ ${parseFloat(trocoInput).toFixed(2)}\n`;
    if (trocoCalculado > 0) {
        mensagemPedido += `- *Troco a ser devolvido:* R$ ${trocoCalculado.toFixed(2)}\n`;
    }
  }

  // Inclui detalhes para pagamento via PIX
  if (formaPagamento === "pix") {
    mensagemPedido += `\n*Para pagamento via PIX:*\n`;
    mensagemPedido += `- *Tipo da Chave:* ${tipoChavePix}\n`;
    mensagemPedido += `- *Chave PIX:* ${chavePix}\n`;
    mensagemPedido += `- *Banco:* ${banco}\n`;
    mensagemPedido += `- *Titular:* ${titular}\n\n`;
  }

  mensagemPedido += `*Obrigado por escolher Ari Jô Lanches!*`;

  const urlPedido = `https://api.whatsapp.com/send?phone=5585987764006&text=${encodeURIComponent(mensagemPedido)}`;
  window.open(urlPedido, '_blank');

  exibirConfirmacao("Pedido confirmado e enviado para o WhatsApp!");
  pedido = [];
  atualizarResumoPedido();
  atualizarVisibilidadeBotao();
  cancelarPedido();

  document.querySelectorAll('.menu-items .item').forEach(item => item.classList.remove('selecionado'));

  setTimeout(() => {
      location.reload();
  }, 5000);
}


function calcularTroco() {
  const trocoInput = document.getElementById("troco").value;
  const totalPedido = pedido.reduce((acc, item) => acc + item.preco * item.quantidade, 0) + taxaEntrega;
  const trocoCalculado = parseFloat(trocoInput) - totalPedido;

  const campoTrocoCalculado = document.getElementById("troco-calculado");
  if (trocoCalculado > 0) {
      campoTrocoCalculado.innerText = `Troco a ser entregue: R$ ${trocoCalculado.toFixed(2)}`;
  } else {
      campoTrocoCalculado.innerText = "";
  }
}




// Função para exibir a confirmação e recarregar a página
function exibirConfirmacao(mensagem) {
  const confirmacao = document.createElement('div');
  confirmacao.classList.add('confirmacao-mensagem');
  confirmacao.innerText = mensagem;
  document.body.appendChild(confirmacao);

  setTimeout(() => {
    confirmacao.remove();
    location.reload(); // Recarrega a página para novo pedido
  }, 5000); // Espera 5 segundos antes de recarregar
}

// Abre o modal para definir a quantidade de massas
function abrirModalQuantidade() {
  document.querySelector('.modal-quantidade').style.display = 'flex';
  document.querySelector('.modal-background').style.display = 'block';
}

// Função para fechar o modal de quantidade de massas sem adicionar a massa
function fecharModalQuantidade() {
  document.querySelector('.modal-quantidade').style.display = 'none';
  document.querySelector('.modal-background').style.display = 'none';

  // Remove a seleção visual e oculta o botão "Remover Massa" caso o usuário cancele o processo
  const itemMassa = document.querySelector('.item.massa');
  if (itemMassa) {
    itemMassa.classList.remove('selecionado');
  }

  // Oculta o botão "Remover Massa"
  const botaoRemover = document.getElementById("botao-remover-massa");
  botaoRemover.style.display = 'none';
}

// Função para confirmar a quantidade de massas e abrir o modal de detalhes para a primeira massa
function confirmarQuantidade() {
  const quantidadeInput = document.getElementById('quantidade-massa');
  quantidadeMassas = parseInt(quantidadeInput.value, 10);

  if (isNaN(quantidadeMassas) || quantidadeMassas <= 0) {
    exibirErroEstilizado("Por favor, insira uma quantidade válida.");
    return;
  }

  fecharModalQuantidade();
  abrirModalMassa(); // Abre o modal de detalhes da primeira massa
}

// Função para iniciar a escolha de massa e abrir o modal de quantidade
function iniciarEscolhaMassa(elemento) {
  elemento.classList.add('selecionado'); // Adiciona a borda visual
  abrirModalQuantidade();
}

// Abre o modal de detalhes de uma massa específica
function abrirModalMassa() {
  document.querySelector('.modal-massa').style.display = 'block';
  document.querySelector('.modal-background').style.display = 'block';
  document.querySelector('.modal-massa h2').innerText = `Escolha os detalhes da Massa ${massaAtual} de ${quantidadeMassas}`;
}

// Fecha o modal de detalhes de massa
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

// Função para exibir o botão "Remover Massa" ao confirmar os detalhes da massa
function confirmarEscolhaMassa() {
  const nomeCliente = document.getElementById("nome-massa").value.trim();
  const massaEscolhida = document.querySelector('input[name="massa"]:checked');
  const molhosEscolhidos = document.querySelectorAll('input[name="molho"]:checked');
  const ingredientesSelecionados = document.querySelectorAll('input[name="ingrediente"]:checked');
  const acompanhamentosSelecionados = document.querySelectorAll('input[name="acompanhamento"]:checked');

  if (!nomeCliente) {
    exibirErroEstilizado("Por favor, insira o nome para esta massa.");
    return;
  }

  if (!massaEscolhida || molhosEscolhidos.length === 0) {
    exibirErroEstilizado("Por favor, escolha uma massa e ao menos um molho!");
    return;
  }

  // Define o preço base da massa
  let precoMassa = 16.00;

  // Verifica se o ingrediente "Camarão" foi selecionado e ajusta o preço
  const ingredientes = Array.from(ingredientesSelecionados).map(ing => ing.value);
  if (ingredientes.includes("Camarão")) {
    precoMassa = 18.00; // Preço com camarão
  }

  const detalhesMassa = {
    nome: `Massa para ${nomeCliente}`,
    destinatario: nomeCliente,
    preco: precoMassa,
    quantidade: 1,
    tipo: massaEscolhida.value,
    molhos: Array.from(molhosEscolhidos).map(molho => molho.value),
    ingredientes: Array.from(ingredientesSelecionados).map(ing => ing.value),
    acompanhamentos: Array.from(acompanhamentosSelecionados).map(acomp => acomp.value)
  };

  pedido.push(detalhesMassa);

  // Exibe o botão "Remover Massa" após a confirmação da escolha
  const botaoRemover = document.getElementById("botao-remover-massa");
  botaoRemover.style.display = 'block';

  if (massaAtual < quantidadeMassas) {
    massaAtual++;
    limparFormularioMassa();
    abrirModalMassa();
  } else {
    massaAtual = 1;
    quantidadeMassas = 0;
    atualizarResumoPedido();
    fecharModalMassa();
  }

  atualizarVisibilidadeBotao();
}


// Função para limpar o formulário de seleção da massa
function limparFormularioMassa() {
  document.getElementById("nome-massa").value = ""; // Limpa o campo de nome
  document.querySelectorAll('input[name="massa"]').forEach(radio => radio.checked = false); // Desmarca os radio buttons de massa
  document.querySelectorAll('input[name="molho"]').forEach(checkbox => checkbox.checked = false); // Desmarca os checkboxes de molho
  document.querySelectorAll('input[name="acompanhamento"]').forEach(checkbox => checkbox.checked = false); // Desmarca os checkboxes de acompanhamento
  document.querySelectorAll('input[name="ingrediente"]').forEach(checkbox => checkbox.checked = false); // Desmarca os checkboxes de ingrediente
}

function atualizarFormaPagamento() {
  const formaPagamento = document.getElementById("forma-pagamento").value;
  const campoTroco = document.getElementById("campo-troco");
  const trocoInput = document.getElementById("troco");
  const trocoCalculado = document.getElementById("troco-calculado");

  // Limpa o valor do troco e do troco calculado ao trocar a forma de pagamento
  if (trocoInput) {
    trocoInput.value = '';
  }
  if (trocoCalculado) {
    trocoCalculado.textContent = '';
  }

  // Mostra o campo de troco apenas se a forma de pagamento for "dinheiro"
  if (formaPagamento === "dinheiro") {
    campoTroco.style.display = "block";
  } else {
    campoTroco.style.display = "none";
  }

  // Recalcula o total com base nos itens do pedido e nas taxas
  let total = pedido.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  total += taxaEntrega; // Adiciona a taxa de entrega ao total

  // Adiciona a taxa de maquineta se a forma de pagamento for débito ou crédito
  const taxaMaquineta = (formaPagamento === "debito" || formaPagamento === "credito") ? 1.00 : 0.00;
  total += taxaMaquineta;

  // Atualiza o resumo do pedido no modal
  const resumoPedido = document.querySelector('.resumo-pedido');
  if (resumoPedido) {
    resumoPedido.innerHTML = ''; // Limpa o conteúdo anterior

    // Adiciona cada item no pedido ao resumo
    pedido.forEach(item => {
      const totalItem = item.preco * item.quantidade;
      resumoPedido.innerHTML += `<p>${item.nome} - ${item.quantidade} x R$ ${item.preco.toFixed(2)} = R$ ${totalItem.toFixed(2)}</p>`;
    });

    // Adiciona a taxa de entrega ao resumo
    resumoPedido.innerHTML += `<p>Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}</p>`;

    // Mostra a taxa de maquineta se aplicável
    if (taxaMaquineta > 0) {
      resumoPedido.innerHTML += `<p>Taxa de maquineta: R$ 1.00</p>`;
    }

    // Atualiza o valor total final com todos os encargos
    resumoPedido.innerHTML += `<p><strong>Total com entrega: R$ ${total.toFixed(2)}</strong></p>`;
  }

  // Atualiza o valor total exibido no campo de troco, caso o usuário insira o valor desejado
  trocoInput.addEventListener("input", () => {
    const valorTroco = parseFloat(trocoInput.value) || 0;
    const trocoParaCliente = valorTroco > total ? valorTroco - total : 0;
    trocoCalculado.textContent = `Troco necessário: R$ ${trocoParaCliente.toFixed(2)}`;
  });
}


// Chame a função atualizarFormaPagamento sempre que a forma de pagamento mudar
document.getElementById("forma-pagamento").addEventListener("change", atualizarFormaPagamento);



// Função para exibir o botão "Remover Massa" logo abaixo do item de massa
function exibirBotaoRemoverMassa() {
  const massaSecao = document.querySelector('.secao .massa'); // Seleciona o item de massa
  if (!document.querySelector('.botao-remover-massa')) { // Verifica se o botão já existe para evitar duplicação
    const botaoRemover = document.createElement('button');
    botaoRemover.className = 'botao-remover-massa';
    botaoRemover.innerText = 'Remover Massa';
    botaoRemover.onclick = removerMassa;
    massaSecao.appendChild(botaoRemover); // Adiciona o botão ao item de massa
  }
}



// Função para cancelar a escolha de massas
function cancelarEscolhaMassa() {
  document.querySelector('.menu-items .item.massa').classList.remove('selecionado');
  pedido = pedido.filter(item => item.nome !== "Massa");
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
