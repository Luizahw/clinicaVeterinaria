
CREATE DATABASE IF NOT EXISTS clinica_veterinaria
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE clinica_veterinaria;

CREATE TABLE IF NOT EXISTS animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(60) NOT NULL,
    raca VARCHAR(80) NOT NULL,
    idade INT NOT NULL,
    responsavel VARCHAR(120) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_animais_idade CHECK (idade >= 0)
);

-- Animais para testar o sistema
INSERT INTO animais (nome, especie, raca, idade, responsavel)
VALUES
('Mel', 'Cachorro', 'Golden Retriever', 4, 'Ana Souza'),
('Mimi', 'Gato', 'Siamês', 2, 'Pedro Lima');

SELECT * FROM animais;