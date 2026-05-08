const produtos = ["Cinnamonroll", "Macarons", "Beignets", "Glazed Donuts","Lemon tarts", "Tiramisu", "Strawberry Cheesecake", "Pudding"]

const valores = [
    15,  20,  19,  35,  30,  40,   13,  28
];

function mostrarEstoque() {
    console.log("⊹₊˚‧︵୨ESTOQUE୧︵‧˚₊⊹");
    for (let i = 0; i < produtos.length; i++) {
        console.log(produtos[i] + " - R$ " + valores[i]);
    }
}

function adicionarProduto(nome, preco) {
    produtos.push(nome);
    valores.push(preco);
    console.log("Produto Adicionado!");
}

function removerProduto(indice) {
    produtos.splice(indice, 1);
    valores.splice(indice, 1);
    console.log("Produto Removido!");
}

mostrarEstoque();

adicionarProduto("brownie", 35);

mostrarEstoque();

removerProduto(2);

mostrarEstoque();
