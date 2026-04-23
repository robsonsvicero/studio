# Projeto: André Barbosa Imóveis

## Visão Geral

Este projeto consiste em uma Landing Page de Alta Conversão para o consultor imobiliário André Barbosa, com um foco estratégico em **Engenharia de Percepção** para o mercado imobiliário de alto padrão. O site foi desenhado não apenas como uma vitrine digital, mas como uma ferramenta ativa de negócios, utilizando inteligência artificial para otimizar a captura e qualificação de leads.

## Stack Técnica

A arquitetura do projeto é moderna e performática, utilizando as seguintes tecnologias:

-   **Frontend:** React com Next.js (App Router)
-   **Estilização:** Tailwind CSS com Radix UI e componentes `shadcn/ui`
-   **Inteligência Artificial:**
    -   **Framework:** Google Genkit
    -   **Modelos:** Integração com a API do Google Gemini para alimentar as funcionalidades de IA.
    -   **Features:**
        -   **Motor de Busca Multimodal:** Permite que os usuários pesquisem imóveis usando linguagem natural e baseada em intenção.
        -   **AI Concierge:** Um agente de IA que qualifica leads automaticamente através do formulário de contato.
-   **Backend & Banco de Dados:** Firebase (para autenticação de usuário e persistência de dados no Firestore).

---

## Guia de Estilo (Branding)

A identidade visual foi construída para transmitir sofisticação, confiança e modernidade, alinhada ao mercado de alto padrão.

### Paleta de Cores

| Cor         | Hex         | Nome        | Uso Principal                               |
| :---------- | :---------- | :---------- | :------------------------------------------ |
| **Primária**| `#4F5D48`   | Verde Musgo | Ações principais, botões, ícones de destaque |
| **Sotaque** | `#B35A44`   | Terracota   | Badges, preços, pontos de atenção secundária |
| **Fundo**   | `#F0E6D2`   | Areia       | Cor de fundo principal das seções claras    |
| **Texto**   | `#3C3C3B`   | Grafite     | Corpo de texto principal, títulos           |

### Tipografia

-   **Fonte Principal:** `Inter`
    -   Utilizada para todos os textos, desde títulos (headlines) até o corpo do texto, garantindo consistência e legibilidade.

---

## Arquitetura de Dados

O fluxo de captura e gerenciamento de leads foi otimizado para economizar o tempo de triagem do consultor e fornecer uma resposta imediata ao usuário.

1.  **Captura:** O usuário preenche o formulário de contato na seção do rodapé.
2.  **Qualificação com IA:** Os dados do formulário (`nome`, `email`, `mensagem`) são enviados para o **AI Concierge**, um fluxo do Genkit que utiliza o modelo Gemini.
3.  **Análise e Resposta:** A IA analisa a mensagem do usuário, gera um resumo conciso para o corretor e uma mensagem de confirmação amigável para o usuário.
4.  **Armazenamento:** O resumo gerado pela IA, juntamente com os dados do lead, é então armazenado em uma coleção no **Firebase Firestore**, criando um banco de dados centralizado de clientes potenciais qualificados.

---

## Como Executar o Projeto

Siga os passos abaixo para executar o projeto em um ambiente de desenvolvimento local.

1.  **Instalar dependências:**
    ```bash
    npm install
    ```

2.  **Configurar Variáveis de Ambiente:**
    -   Crie um arquivo `.env` na raiz do projeto.
    -   Adicione sua `GEMINI_API_KEY` para habilitar as funcionalidades de IA.
    ```env
    GEMINI_API_KEY=SUA_CHAVE_API_AQUI
    ```

3.  **Executar o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  **Acessar a aplicação:**
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

<br>

*Este projeto foi desenvolvido sob a metodologia de redução de fricção cognitiva do Svicero Studio.*
