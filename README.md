# InfoPoint

**InfoPoint** é um sistema web desenvolvido como Trabalho de Conclusão de Curso (TCC) em Engenharia de Software. O sistema permite que empresas, consultórios, clínicas e outros estabelecimentos criem páginas informativas personalizadas com base em layouts montados de forma livre. Cada página gerada possui uma URL única e pode ser acessada publicamente.

---

## Objetivo

Fornecer uma solução simples e dinâmica para exibir informações em telas (como painéis ou totens) de maneira visualmente agradável e gerenciável, com foco em acessibilidade, autonomia do usuário e personalização total do conteúdo.

---

## Tecnologias Utilizadas

### Frontend
- **React.js**
- **Css**
- **React Router DOM**
- **React Icons**

### Backend
- **Node.js**
- **Express.js**
- **Sequelize**
- **MySQL**

---

## Funcionalidades Principais

- Criação de páginas com layout personalizado
- Geração de páginas com URLs únicas
- Edição inline de textos e imagens
- Integração com Google Maps
- Exibição em tela cheia com rolagem vertical estilo "slide"
- Suporte a vídeo institucional (YouTube)
- Integração com clima via API (OpenWeatherMap)
- Sistema de autenticação e permissões (admin/editor)
- Confirmação de e-mail e recuperação de senha

---

## Estrutura do Projeto

```
/frontend          # Aplicação React com editor e visualização
/backend           # API Node.js com rotas, autenticação e banco

---

## Como executar o projeto localmente

### Pré-requisitos
- Node.js instalado
- MySQL em execução
- Git

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/RebecaBio-Samitschek/Infopoint.git
cd Infopoint
```

2. Instale dependências do frontend:
```bash
cd frontend
npm install
```

3. Instale dependências do backend:
```bash
cd ../backend
npm install
```

4. Configure o banco de dados no arquivo `.env` do backend (exemplo abaixo):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=infopoint
```

5. Rode as migrações e inicie o servidor:
```bash
npx sequelize db:migrate
npm run dev
```

6. Rode o frontend:
```bash
cd ../frontend
npm start
```

---

## Documentação Técnica

- Estrutura de banco com Sequelize
- Controllers e rotas organizados por domínio (`clientes`, `paginas`, `permissoes`)
- Layouts Personalizado
- Armazenamento de dados em JSON para flexibilidade de conteúdo

---


---

## Testes

O projeto inclui testes unitários para os principais componentes do frontend e rotas do backend, com o objetivo de garantir a estabilidade das funcionalidades.

### Tecnologias de Testes

- **Frontend:** Jest, React Testing Library
- **Backend:** Jest, Supertest

### Como executar os testes

#### Frontend

```bash
cd frontend
npm test
```

#### Backend

1. Certifique-se de que o banco `infopoint` existe no MySQL:
```sql
CREATE DATABASE infopoint;
```

2. Configure o arquivo `.env` corretamente com suas credenciais de banco.

3. Rode as migrações para criar as tabelas:
```bash
npx sequelize db:migrate
```

4. Crie os seguintes usuários no banco de dados, manualmente ou via seed/testes:

| Nome                   | E-mail                   | Senha   | emailConfirmado |
|------------------------|--------------------------|---------|------------------|
| Usuário de Teste       | usuario@teste.com        | 123456  | true             |
| Usuário Não Confirmado | naoconfirmado@teste.com  | 123456  | false            |

> A senha deve ser armazenada com hash (use o mesmo método de hashing usado no backend).

5. Execute os testes:
```bash
npm test
```



## Sobre o TCC

Este projeto foi desenvolvido como TCC de Engenharia de Software, com foco em:
- Aplicação prática de conceitos de front e backend
- Estrutura modular e reutilizável
- Interface acessível e responsiva
- Escalabilidade e manutenção futura

---

## Autora

**Rebeca Bio Samitschek**  
Engenharia de Software – TCC 2025  
GitHub: [@RebecaBio-Samitschek](https://github.com/RebecaBio-Samitschek)

