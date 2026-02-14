# 🌟 Site Lisy Souza Ebert - Terapias Espirituais

Site profissional para terapeuta holística, desenvolvido com React, TypeScript e Vite.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Estilo**: Tailwind CSS + shadcn/ui
- **Backend**: PHP + MySQL
- **Hospedagem**: Hostinger

## 📋 Funcionalidades

- ✅ Página inicial com apresentação profissional
- ✅ Formulário de contato integrado
- ✅ Blog com editor rico (TipTap)
- ✅ Painel administrativo para gerenciar leads e posts
- ✅ Design responsivo e moderno
- ✅ Integração com WhatsApp

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- XAMPP/WAMP (para MySQL local)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd site-lisy
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados local:
- Inicie o XAMPP/WAMP
- Crie um banco chamado `site_lisy`
- Importe o arquivo `database.sql`

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O site estará disponível em `http://localhost:5173`

## 🏗️ Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 📦 Deploy na Hostinger

Siga as instruções detalhadas no arquivo `HOSTINGER_DEPLOY.md`.

Resumo:
1. Execute `npm run build`
2. Configure o banco MySQL no painel da Hostinger
3. Importe o `database.sql`
4. Edite `dist/api/config.php` com suas credenciais
5. Faça upload da pasta `dist/` para `public_html`

## 🔒 Segurança

- Credenciais de banco de dados configuradas via variáveis de ambiente
- Autenticação admin protegida
- CORS configurado adequadamente
- SQL preparado para prevenir injection

## 📝 Estrutura do Projeto

```
site-lisy/
├── public/           # Arquivos públicos e API PHP
│   └── api/         # Backend PHP (leads, blog)
├── src/             # Código React
│   ├── components/  # Componentes reutilizáveis
│   ├── hooks/       # Custom hooks (useApi.js)
│   ├── pages/       # Páginas da aplicação
│   └── lib/         # Utilitários
├── dist/            # Build de produção (gerado)
└── database.sql     # Schema do banco de dados
```

## 📞 Contato

- **WhatsApp**: (51) 99898-1667
- **Instagram**: @lisysouzaebert
- **Site**: https://lisysouzaebert.com

## 📄 Licença

Projeto privado - Todos os direitos reservados © 2025 Lisy Souza Ebert
