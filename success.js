document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get("pedidoId");

    if (!pedidoId) {
        document.getElementById("pedido-info").innerText = "ID de pedido não encontrado.";
        return;
    }

    try {
        const response = await fetch(`https://arijolanches.com.br/status_pagamento/${pedidoId}`);
        const data = await response.json();

        if (response.ok && data.status === "approved") {
            const pedidoInfo = `
                <p>ID do Pedido: ${pedidoId}</p>
                <p>Status: ${data.status}</p>
                <p>Itens: ${data.items.map(item => `${item.nome} - R$ ${item.preco.toFixed(2)}`).join(', ')}</p>
                <p>Total: R$ ${data.total.toFixed(2)}</p>
            `;
            document.getElementById("pedido-info").innerHTML = pedidoInfo;

            document.getElementById("enviar-whatsapp").addEventListener("click", () => {
                const mensagem = `Pedido Confirmado!\nID: ${pedidoId}\nStatus: ${data.status}\nItens: ${data.items.map(item => `${item.nome} - R$ ${item.preco.toFixed(2)}`).join(', ')}\nTotal: R$ ${data.total.toFixed(2)}`;
                window.location.href = `https://wa.me/5585987764006?text=${encodeURIComponent(mensagem)}`;
            });
        } else {
            document.getElementById("pedido-info").innerText = "Erro ao verificar status do pagamento.";
        }
    } catch (error) {
        console.error("Erro ao verificar status do pagamento:", error);
        document.getElementById("pedido-info").innerText = "Erro ao verificar status do pagamento.";
    }
});
