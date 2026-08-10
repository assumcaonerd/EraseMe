# EraseMe

Ferramenta de proteção de privacidade e remoção de conteúdo não consensual.

Localiza exposições indevidas, preserva provas, gera denúncias e orienta o acompanhamento de cada solicitação.

## O que o EraseMe faz

- Organiza o relato de exposição (nome, telefone, links, palavras-chave)
- Analisa tecnicamente os links informados
- Gera planos de ação prioritários
- Produz textos prontos de denúncia (Google, redes sociais, hosts etc.)
- Orienta preservação de provas e monitoramento
- Diferencia claramente: remoção da página original × desindexação × remoção de cópias
- Oferece modo profissional para advogados, delegacias e organizações

## Público-alvo

- Vítimas de divulgação de imagens íntimas
- Perfis falsos, golpes e anúncios fraudulentos
- Exposição de telefone, endereço ou dados pessoais
- Uso indevido de fotografias
- Casos envolvendo menores
- Profissionais de apoio

## Como executar

### Pré-requisitos
- Node.js 18 ou superior

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/assumcaonerd/EraseMe.git
cd EraseMe

# 2. Instale as dependências
npm install

# 3. Configure a chave da API do Gemini
cp .env.example .env.local
# Edite .env.local e coloque sua chave:
# GEMINI_API_KEY=sua_chave_aqui

# 4. Rode o app
npm run dev
```

Acesse: http://localhost:3000

### Obter chave da API
1. Acesse https://aistudio.google.com/apikey
2. Crie uma chave
3. Cole no arquivo `.env.local`

## Aviso importante

Esta ferramenta fornece orientações gerais e modelos de texto.  
**Não constitui aconselhamento jurídico.**  
Em situações de risco imediato, procure a polícia (190) ou delegacia especializada (crimes cibernéticos / Delegacia da Mulher).

## Estrutura

- `App.tsx` – interface principal
- `services/geminiService.ts` – geração do plano via Gemini
- `types.ts` – tipos TypeScript
- `components/` – componentes de UI

## Licença

Uso responsável. Proteja a privacidade.
