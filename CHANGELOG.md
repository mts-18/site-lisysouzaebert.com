# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-02-14

### 🎉 Lançamento Inicial

Primeira versão do site profissional de Lisy Souza Ebert.

### ✨ Adicionado

#### Frontend
- Interface moderna e responsiva com React 18 + TypeScript
- Design elegante com Tailwind CSS e shadcn/ui
- Página inicial com apresentação profissional da terapeuta
- Seção "Sobre mim" com foto e descrição detalhada
- Formulário de contato com validação completa
- Integração direta com WhatsApp
- Animações e transições suaves
- Tema de cores: preto, branco, dourado e violeta

#### Backend
- API REST em PHP puro
- Sistema de gerenciamento de leads
- Endpoints para criar, listar e deletar leads
- Sistema de blog com CRUD completo
- Upload de imagens para posts do blog
- Autenticação admin com token seguro

#### Banco de Dados
- Schema MySQL otimizado
- Tabela `leads` com índices para busca rápida
- Tabela `blog_posts` com suporte a imagens e vídeos
- Suporte a ambientes local e produção

#### Painel Administrativo
- Login seguro com credenciais configuráveis
- Dashboard para visualizar leads
- Sistema de busca e paginação de leads
- Modal de detalhes completos do lead
- Editor rico (TipTap) para posts do blog
- Gerenciamento completo de posts (criar, editar, excluir)
- Upload de imagens para o blog
- Pré-visualização de posts

#### Segurança
- Row Level Security implementado
- Proteção contra SQL Injection
- CORS configurado adequadamente
- Variáveis de ambiente para credenciais
- Autenticação por token Bearer
- Validação de dados no frontend e backend

#### DevOps
- Configuração para desenvolvimento local (XAMPP/WAMP)
- Build otimizado para produção
- Instruções detalhadas de deploy para Hostinger
- Documentação completa no README.md

### 🔧 Tecnologias Utilizadas

- **Frontend**: React 18.3.1, TypeScript 5.8.3, Vite 7.1.12
- **UI**: Tailwind CSS 3.4.17, shadcn/ui, Radix UI
- **Editor**: TipTap 3.17.1
- **Backend**: PHP 8+, MySQL
- **Ferramentas**: ESLint, PostCSS, Autoprefixer
- **Hospedagem**: Hostinger

### 📝 Arquivos de Configuração

- `.env.example` - Template de variáveis de ambiente
- `.gitignore` - Proteção de arquivos sensíveis
- `database.sql` - Schema completo do banco
- `HOSTINGER_DEPLOY.md` - Guia de deploy passo a passo

### 🗑️ Removido

- Dependências do Supabase (migrado para PHP + MySQL)
- Configurações de deploy Netlify e Vercel
- Arquivos de documentação antigos

### 🔒 Segurança

- Credenciais não commitadas no repositório
- Proteção de rotas administrativas
- Sanitização de inputs do usuário
- Headers de segurança configurados

---

## [Unreleased]

### 🚀 Planejado para Próximas Versões

- [ ] Sistema de agendamento online
- [ ] Integração com calendário
- [ ] Sistema de pagamentos
- [ ] Galeria de depoimentos de clientes
- [ ] Newsletter com envio automático
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Sistema de notificações
- [ ] Métricas e analytics
- [ ] SEO avançado

---

## Tipos de Mudanças

- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correção de bugs
- **Segurança** para vulnerabilidades corrigidas

---

[1.0.0]: https://github.com/mts-18/site-lisysouzaebert.com/releases/tag/v1.0.0
[Unreleased]: https://github.com/mts-18/site-lisysouzaebert.com/compare/v1.0.0...HEAD
