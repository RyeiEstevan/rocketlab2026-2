# 🎬 Catálogo de Filmes Full-Stack

Aplicação web full-stack desenvolvida para a gestão de um catálogo de filmes, permitindo listar, pesquisar, visualizar detalhes, criar, atualizar e eliminar registos, além de gerir avaliações associadas.

---

## 🚀 Tecnologias Utilizadas

### **Backend**
* **Python 3.12+**
* **FastAPI** (Framework web assíncrono)
* **SQLAlchemy (Async)** (ORM para gestão da base de dados)
* **SQLite & Aiosqlite** (Base de dados relacional leve)
* **Alembic** (Gestão de migrações)

### **Frontend**
* **React** com **TypeScript**
* **Vite** (Empacotador e servidor de desenvolvimento)
* **Axios** (Cliente HTTP para comunicação com a API)

---

## ✨ Funcionalidades

* **Listagem e Paginação:** Visualização dos filmes em grelha com paginação otimizada.
* **Pesquisa por Título:** Filtragem dinâmica de filmes em tempo real.
* **Detalhes Completos:** Visualização de sinopse, estado, duração, média calculada de avaliações e lista de comentários.
* **CRUD Completo:**
  * **Criar:** Adição de novos filmes (com validação de títulos duplicados) e novas avaliações (notas de 0 a 10).
  * **Atualizar:** Edição de dados do filme via painel de detalhes (`PATCH`).
  * **Eliminar:** Remoção de filmes do catálogo.

---

## 📂 Estrutura do Projeto

```text
.
├── backend/
│   ├── alembic/              # Migrações da base de dados
│   ├── app/
│   │   ├── api/v1/           # Rotas da API (filmes, etc.)
│   │   ├── db/               # Sessão e configuração da BD
│   │   ├── movies/           # Modelos e schemas Pydantic
│   │   └── main.py           # Ponto de entrada do FastAPI
│   ├── load_data.py          # Script de população inicial de filmes
│   ├── load_reviews.py       # Script de população inicial de avaliações
│   └── requirements.txt      # Dependências Python
│
└── frontend/
    ├── src/
    │   ├── components/       # Componentes visuais modularizados (Cards, Modals, etc.)
    |   ├── hooks/            # Lógica do App
    │   ├── services/         # Configuração do Axios
    │   ├── types/            # Tipagens TypeScript
    │   ├── App.tsx           # Componente principal
    │   └── main.tsx          # Ponto de entrada do React
    └── package.json          # Dependências Node.js

# 🛠️ Guia de Instalação e Execução

Certifica-te de que tens o **Python** e o **Node.js** instalados no teu sistema.

## 1. Configurar e Executar o Backend

1. Abre um terminal e navega para a pasta do backend:

```bash
   cd backend
```

2. Cria e ativa o ambiente virtual:

```bash
   python3 -m venv .venv
   source .venv/bin/activate
```

3. Instala as dependências necessárias:

```bash
   pip install -r requirements.txt
```

4. Executa as migrações do Alembic para estruturar a base de dados:

```bash
   alembic upgrade head
```

5. Popula a base de dados com os dados iniciais dos CSVs:

```bash
   python load_data.py
   python load_reviews.py
```

6. Inicia o servidor backend com o Uvicorn:

```bash
   uvicorn app.main:app --reload
```

O servidor da API estará ativo em `http://127.0.0.1:8000`. Podes aceder a `http://127.0.0.1:8000/docs` para ver a documentação interativa do Swagger.

## 2. Configurar e Executar o Frontend

1. Abre um **novo terminal** e navega para a pasta do frontend:

```bash
   cd frontend
```

2. Instala as dependências do projeto:

```bash
   npm install
```

3. Inicia o ambiente de desenvolvimento do Vite:

```bash
   npm run dev
```

A aplicação web estará acessível no teu browser através de `http://localhost:5173`.