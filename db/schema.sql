DROP TABLE IF EXISTS calculations;
DROP TABLE IF EXISTS users;

-- Tabela de Utilizadores
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    plan TEXT DEFAULT 'free', -- 'free', 'pro', 'premium'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Histórico de Cálculos
CREATE TABLE calculations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    module_name TEXT NOT NULL, -- ex: 'Shopee', 'Custo Fixo'
    inputs TEXT NOT NULL,      -- Guardado em formato JSON
    results TEXT NOT NULL,     -- Guardado em formato JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);