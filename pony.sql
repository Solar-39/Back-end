-- =========================================================================
-- 1. CRIAÇÃO DAS TABELAS (Primeiro as que não dependem de ninguém)
-- =========================================================================

-- Tabela de Categorias
CREATE TABLE Categoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

-- Tabela de Clientes (Criada no início para que Endereco e Pedido possam usá-la)
CREATE TABLE Cliente ( 
    id INT PRIMARY KEY AUTO_INCREMENT,  
    nome VARCHAR(100) NOT NULL,  
    cpf CHAR(14) NOT NULL UNIQUE,  
    email VARCHAR(100) NOT NULL UNIQUE,  
    celular CHAR(14) NOT NULL,  
    senha VARCHAR(512) NOT NULL
);

-- Tabela de Produtos (Os bonecos de My Little Pony)
CREATE TABLE Pony (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cor_corpo VARCHAR(30),
    cor_crina VARCHAR(30),
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id)
);

-- Tabela de Endereços dos Clientes
CREATE TABLE Endereco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep CHAR(9) NOT NULL,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id) ON DELETE CASCADE
);

-- Tabela de Pedidos (Cabeçalho da venda)
CREATE TABLE Pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10, 2) NOT NULL,
    status_pedido VARCHAR(20) DEFAULT 'Pendente',
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id)
);

-- Tabela de Itens do Pedido (Produtos dentro de cada pedido)
CREATE TABLE ItemPedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    id_pedido INT NOT NULL,
    id_pony INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pony) REFERENCES Pony(id)
);

-- =========================================================================
-- 2. POPULANDO OS DADOS (Inserindo primeiro os dados base)
-- =========================================================================

-- Populando as Categorias
INSERT INTO Categoria (nome, descricao) VALUES 
('Geração 4 (G4)', 'Pôneis clássicos da série A Amizade é Mágica'),
('Edição Especial Brilho', 'Pôneis com asas translúcidas ou detalhes em glitter'),
('Edição de Colecionador', 'Modelos raros, metálicos ou com acessórios exclusivos');

-- Populando os Clientes (Todos juntos e corrigidos)
INSERT INTO Cliente (nome, cpf, email, celular, senha) VALUES 
('Myung Jaehyun', '123.456.789-12', 'Boynextdoor@gmail.com', '(42)99988-7766', 'pusheenpusheenpusheen'),
('Naoi Rei', '111.222.33-44', 'naoirei@gmail.com', '(42)98888-1111', 'senhaRei123'),
('Lily Jin Park Morrow', '222.333.444-55', 'lilyjin@gmail.com', '(42)98888-2222', 'lilyMorrow99'),
('Lee Won-hee', '333.444.554-66', 'wonhee.lee@gmail.com', '(42)98888-3333', 'illitWonhee0'),
('Kim Juhoon', '444.555.666-77', 'juhoonkim@gmail.com', '(42)98888-4444', 'juhoon9876'),
('Kim Min-jeong', '555.666.777-88', 'minjeong@gmail.com', '(42)98888-5555', 'aespaWinter!'),
('Lee Min-ho', '666.777.888-99', 'leeminho@gmail.com', '(42)98888-6666', 'skzLeeKnow0'),
('Choi Beom-gyu', '777.888.999-00', 'beomgyu@gmail.com', '(42)98888-7777', 'txtChoi321'),
('Kang Yeosang', '888.999.000-11', 'yeosang@gmail.com', '(42)98888-8888', 'ateezKang456'),
('Min Yoon-gi', '999.000.111-22', 'yoongi.min@gmail.com', '(42)98888-9999', 'btsSuga1993');

-- Populando os Ponys
INSERT INTO Pony (nome, cor_corpo, cor_crina, preco, estoque, id_categoria) VALUES 
('Princess Twilight Sparkle', 'Roxo', 'Azul Escuro, Rosa e Roxo', 89.90, 15, 1),
('Pinkamena Diane Pie', 'Rosa Claro', 'Rosa Choque', 79.90, 20, 1),
('Rainbow Dash Asas de Cristal', 'Azul Celeste', 'Arco-íris', 115.00, 8, 2),
('Rarity Belle Stylist', 'Branco', 'Roxo Escuro', 85.50, 10, 1),
('Fluttershy Brilho Mágico', 'Amarelo', 'Rosa Claro', 110.00, 5, 2),
('Applejack Core Fashion', 'Laranja', 'Amarelo', 79.90, 12, 1),
('Princess Celestia Edição Suprema', 'Branco', 'Rosa, Verde e Azul', 199.90, 3, 3);

-- Populando os Endereços
INSERT INTO Endereco (rua, numero, bairro, cidade, estado, cep, id_cliente) VALUES 
('Rua das Flores', '123', 'Centro', 'Curitiba', 'PR', '80000-000', 1), -- Myung Jaehyun
('Av. Batel', '77', 'Batel', 'Curitiba', 'PR', '80420-000', 2),     -- Naoi Rei
('Rua São Francisco', '999', 'Centro', 'Cascavel', 'PR', '85800-111', 6); -- Kim Min-jeong (ID corrigido para 6 na ordem do INSERT)

-- Simulando Pedidos
INSERT INTO Pedido (valor_total, status_pedido, id_cliente) VALUES 
(204.90, 'Enviado', 1),   -- Pedido do Jaehyun
(115.00, 'Pendente', 6);   -- Pedido da Min-jeong (Winter - ID 6)

-- Itens dos Pedidos
INSERT INTO ItemPedido (quantidade, preco_unitario, id_pedido, id_pony) VALUES 
(1, 89.90, 1, 1),  -- Jaehyun levou 1 Princess Twilight Sparkle
(1, 115.00, 1, 3), -- Jaehyun também levou 1 Rainbow Dash Asas de Cristal
(1, 115.00, 2, 3); -- Winter levou 1 Rainbow Dash Asas de Cristal
