import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IncidentData, RemovalPlanResponse } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "Resumo claro e empático do caso (2-3 linhas)" },
    classification: { type: Type.STRING, description: "Classificação do conteúdo e da página" },
    risks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de riscos principais identificados"
    },
    technicalAnalysis: {
      type: Type.OBJECT,
      properties: {
        domain: { type: Type.STRING },
        host: { type: Type.STRING },
        registrar: { type: Type.STRING },
        cdn: { type: Type.STRING },
        socialNetwork: { type: Type.STRING },
        reportingChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
        notes: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["reportingChannels", "notes"]
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          priority: { type: Type.INTEGER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          type: { type: Type.STRING, description: "removal | deindex | copy_removal | evidence | monitor | legal" }
        },
        required: ["priority", "title", "description", "type"]
      }
    },
    templates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          channel: { type: Type.STRING }
        },
        required: ["platform", "title", "content"]
      }
    },
    placeholders: { type: Type.ARRAY, items: { type: Type.STRING } },
    checklist: { type: Type.ARRAY, items: { type: Type.STRING } },
    evidenceTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    monitoringTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    distinctionNote: {
      type: Type.STRING,
      description: "Explicação clara da diferença entre remoção da página original, desindexação e remoção de cópias"
    }
  },
  required: [
    "summary", "classification", "risks", "technicalAnalysis",
    "actionPlan", "templates", "placeholders", "checklist",
    "evidenceTips", "monitoringTips", "distinctionNote"
  ]
};

const SYSTEM_INSTRUCTION = `
Você é o EraseMe — Assistente especializado em remoção de conteúdo não consensual e proteção de privacidade online.

Seu objetivo é ajudar vítimas de:
- divulgação de imagens íntimas sem consentimento
- perfis falsos e golpes
- anúncios fraudulentos
- exposição de telefones, endereços e dados pessoais
- uso indevido de fotografias
- conteúdos envolvendo menores

Princípios obrigatórios:
1. Segurança e privacidade acima de tudo. Nunca peça dados desnecessários. Nunca incentive hacking, doxxing, invasão ou retaliação.
2. Você não é advogado. Sempre deixe claro que as orientações são gerais e que, em casos graves, a pessoa deve procurar delegacia especializada e/ou advogado.
3. Se o usuário pedir anonimização, use apenas [NOME], [TELEFONE], [EMAIL] etc. nos textos.
4. Separe claramente três ações distintas:
   - REMOÇÃO da página original (feita pelo site, provedor ou rede social)
   - DESINDEXAÇÃO (para o resultado sumir dos buscadores)
   - REMOÇÃO DE CÓPIAS (excluir um endereço não apaga automaticamente todas as reproduções)
5. Sempre forneça textos prontos para copiar/colar (e-mails, formulários, justificativas para Google, Cloudflare, hosts etc.).
6. Oriente sobre preservação de provas antes de qualquer denúncia (URL, data/hora, captura de tela, hash se possível, identificação técnica da página).
7. Inclua dicas de monitoramento contínuo (verificar se o conteúdo voltou a aparecer).
8. Em modo profissional (advogados, delegacias, organizações), use linguagem mais técnica e completa.

Estrutura da resposta:
- Resumo empático e objetivo
- Classificação do conteúdo
- Riscos
- Análise técnica do domínio (host, CDN, registrador, canais de denúncia quando possível)
- Plano de ação prioritário (com tipo: removal / deindex / copy_removal / evidence / monitor / legal)
- Modelos prontos de denúncia
- Placeholders que o usuário precisa preencher
- Checklist
- Dicas de preservação de provas
- Dicas de monitoramento
- Nota clara sobre a diferença entre remoção, desindexação e cópias

User-Agent sugerido quando necessário:
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
`;

export const generateRemovalPlan = async (data: IncidentData): Promise<RemovalPlanResponse> => {
  try {
    const prompt = `
Detalhes do caso enviado pelo usuário:

Nome / identificação: ${data.anonymize ? "[ANONIMIZADO]" : (data.fullName || "não informado")}
Apelidos: ${data.aliases || "não informado"}
Telefones: ${data.anonymize ? "[TELEFONE]" : (data.phones || "não informado")}
E-mails: ${data.anonymize ? "[EMAIL]" : (data.emails || "não informado")}

URLs encontradas (uma por linha):
${data.urls}

Palavras-chave: ${data.keywords || "não informado"}
Tipo de conteúdo: ${data.contentType}
Descrição do caso: ${data.description}
Solicitações especiais do usuário: ${data.userRequests || "nenhuma"}
Modo profissional: ${data.professionalMode ? "SIM" : "NÃO"}
Anonimizar dados sensíveis nos textos: ${data.anonymize ? "SIM" : "NÃO"}

Gere um plano completo de proteção e remoção seguindo rigorosamente as instruções de sistema.
Seja claro, organizado e útil. Priorize a segurança da vítima.
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.35,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Sem resposta do Gemini");

    return JSON.parse(jsonText) as RemovalPlanResponse;
  } catch (error) {
    console.error("Erro ao gerar plano:", error);
    throw error;
  }
};
