# ShadownJin — Discord Bot (Solo Leveling Inspired)

Bot em JavaScript usando **discord.js**, **Firebase Firestore** e estrutura modular para comandos, XP e futuras funcionalidades como moderação e dashboard.

---

## 🚀 Funcionalidades Atuais
- Sistema de XP básico (com cooldown).
- Comandos modulares.
- Integração com Firestore (Firebase Admin).
- Arquitetura preparada para expansão e futuro dashboard web.

---

## 🛠️ Tecnologias Principais
### Linguagem e Ambiente
* **TypeScript (TS):** Utilizado como linguagem principal para tipagem forte, garantindo maior estabilidade e menos erros em tempo de execução.
* **Node.js 18+:** O ambiente de *runtime* principal.
* **ES Modules (ESM):** O projeto utiliza a sintaxe moderna `import`/`export`, aproveitando os recursos assíncronos como `await import()`.
* **TSX:** Ferramenta de *runtime* para executar instantaneamente arquivos TypeScript e JSX, substituindo `nodemon` e `ts-node` em ambientes de desenvolvimento.

### Bibliotecas Principais
* **Discord.js (v14+):** Biblioteca principal para interagir com a API do Discord.
* **Firebase Admin SDK:** Utilizado para inicializar o **Firestore Database** e gerir a persistência de dados (XP, comandos, etc.).
* **Dotenv:** Para gestão e carregamento seguro de variáveis de ambiente a partir do ficheiro `.env`.

---

## 🔄 GitHub Actions (CI)
Este projeto inclui um workflow básico para:
- Instalar dependências
- Rodar ESLint
- Validação rápida
Workflow em:
`.github/workflows/ci.yml`

---

## 🌐 Futuro do Projeto
- Moderação automática (ativável/desativável).
- Dashboard Web estilo Loritta.
- Rotinas avançadas de economia/XP.
- Estatísticas no servidor.
- Log de eventos.
- Sistema de inventário.

---

## 📄 Licença
GNU GENERAL PUBLIC LICENSE

---

## 💬 Contato
Futuramente será adicionado contato oficial e links do dashboard.