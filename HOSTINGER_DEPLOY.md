# Guia de Deploy no Hostinger

Este projeto foi migrado de Supabase para um backend PHP + MySQL simples para ser hospedado no Hostinger.

## Passos para Deploy

1. **Build do Projeto**
   Execute o comando de build localmente:
   ```bash
   npm run build
   ```
   Isso criará uma pasta `dist` com todos os arquivos.

2. **Banco de Dados**
   - No painel do Hostinger, vá em "Banco de Dados MySQL" e crie um novo banco.
   - Anote o Nome do Banco, Usuário e Senha.
   - Abra o phpMyAdmin do banco criado.
   - Importe o arquivo `database.sql` (que está na raiz do projeto). Isso criará as tabelas `leads` e `blog_posts`.

3. **Configuração da API**
   - Navegue até a pasta `dist/api` (ou edite antes de fazer o upload em `public/api/config.php`).
   - Abra o arquivo `config.php`.
   - Preencha as constantes com seus dados do Hostinger:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'seu_usuario_hostinger');
     define('DB_PASS', 'sua_senha_hostinger');
     define('DB_NAME', 'seu_banco_hostinger');
     ```
   - **IMPORTANTE**: Defina o `API_SECRET`. Ele deve ser **IGUAL** ao valor `VITE_ADMIN_SECRET` que foi usado durante o build (no seu arquivo `.env`).
     - Se você não sabe qual é, pode definir um novo no `config.php` e terá que reconstruir o projeto front-end com esse mesmo valor no `.env` (`VITE_ADMIN_SECRET=novo_secret`).

4. **Upload de Arquivos**
   - Faça o upload de **todo o conteúdo** da pasta `dist` para a pasta `public_html` no gerenciador de arquivos do Hostinger.

5. **Permissões**
   - Certifique-se de que a pasta `api` e seus arquivos tenham permissões de execução (padrão 644 para arquivos e 755 para pastas funciona).
   - Se houver uma pasta `uploads` (para imagens do blog), garanta que ela tenha permissão de escrita (755 ou 777 dependendo da configuração do servidor). Se não existir, crie-a dentro de `public_html` (ou seja, `public_html/uploads`).

6. **Testes**
   - Acesse seu site.
   - Tente criar um Lead (formulário de contato).
   - Acesse `/admin` (ou a rota de login) para testar o blog. Se o login falhar, verifique se o `API_SECRET` no `config.php` bate com o do front-end.
