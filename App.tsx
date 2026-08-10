import React, { useState } from 'react';
import {
  Shield, Lock, Search, FileText, Send, RefreshCw, CheckCircle,
  AlertCircle, ChevronRight, Info, Eye, Camera, Phone, User, Link as LinkIcon
} from 'lucide-react';
import { generateRemovalPlan } from './services/geminiService';
import { IncidentData, RemovalPlanResponse, ContentType } from './types';
import { SafetyBanner } from './components/SafetyBanner';
import { CopyBlock } from './components/CopyBlock';

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'intimate_image', label: 'Imagem íntima sem consentimento' },
  { value: 'photo', label: 'Fotografia / uso indevido de imagem' },
  { value: 'video', label: 'Vídeo' },
  { value: 'phone', label: 'Telefone exposto' },
  { value: 'name', label: 'Nome / dados pessoais' },
  { value: 'address', label: 'Endereço / localização' },
  { value: 'profile_fake', label: 'Perfil falso' },
  { value: 'ad_fraud', label: 'Anúncio fraudulento / golpe' },
  { value: 'minor', label: 'Conteúdo envolvendo menor' },
  { value: 'other', label: 'Outro' },
];

const App: React.FC = () => {
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form');
  const [formData, setFormData] = useState<IncidentData>({
    fullName: '',
    aliases: '',
    phones: '',
    emails: '',
    urls: '',
    keywords: '',
    contentType: 'other',
    description: '',
    userRequests: '',
    anonymize: true,
    professionalMode: false,
  });
  const [response, setResponse] = useState<RemovalPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.urls.trim() && !formData.description.trim()) {
      setError('Informe pelo menos um link ou uma descrição do caso.');
      return;
    }
    setStep('loading');
    setError(null);
    try {
      const result = await generateRemovalPlan(formData);
      setResponse(result);
      setStep('results');
    } catch (err) {
      setError('Ocorreu um erro ao gerar o plano. Verifique a chave da API e tente novamente.');
      setStep('form');
    }
  };

  const resetApp = () => {
    setStep('form');
    setResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">EraseMe</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Proteção de privacidade e remoção de conteúdo</p>
            </div>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Localize • Preserve • Denuncie • Monitore
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SafetyBanner />

        {step === 'form' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Relatar exposição indevida</h2>
              <p className="text-slate-600 mb-8">
                Informe os dados que você tem. O EraseMe gera um plano de ação, modelos de denúncia
                e orientações de preservação de provas.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <User className="w-4 h-4" /> Nome completo (opcional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Pode ser anonimizado nos textos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Apelidos / nomes usados</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      value={formData.aliases}
                      onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" /> Telefones expostos
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      value={formData.phones}
                      onChange={(e) => setFormData({ ...formData, phones: e.target.value })}
                      placeholder="Um ou mais números"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-mails</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      value={formData.emails}
                      onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" /> Links onde o conteúdo foi encontrado
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                    value={formData.urls}
                    onChange={(e) => setFormData({ ...formData, urls: e.target.value })}
                    placeholder="Cole um ou mais links (um por linha)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Palavras-chave relacionadas</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="Nomes, apelidos, termos usados nos anúncios ou perfis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de conteúdo</label>
                  <select
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ContentType })}
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do caso</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Conte o que aconteceu, onde encontrou o conteúdo, se há fotos/vídeos, se envolve menor, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Solicitações especiais (opcional)</label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={formData.userRequests}
                    onChange={(e) => setFormData({ ...formData, userRequests: e.target.value })}
                    placeholder="Ex: Quero que os textos usem apenas [NOME]. Preciso de linguagem mais formal para advogado..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.anonymize}
                      onChange={(e) => setFormData({ ...formData, anonymize: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">Anonimizar dados sensíveis nos modelos gerados</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.professionalMode}
                      onChange={(e) => setFormData({ ...formData, professionalMode: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">Modo profissional (advogados / delegacias / organizações)</span>
                  </label>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-sm"
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    Gerar plano de proteção e remoção
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <h3 className="text-lg font-medium text-slate-900">Analisando o caso...</h3>
            <p className="text-slate-500 mt-2 text-center max-w-md px-4">
              Estamos gerando análise técnica, modelos de denúncia, orientações de provas e plano de monitoramento.
            </p>
          </div>
        )}

        {step === 'results' && response && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Análise do caso</h2>
                  <p className="text-slate-600 mt-1">{response.summary}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  <Info className="w-3 h-3 mr-1" />
                  {response.classification}
                </span>
              </div>

              {response.risks.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <h4 className="text-sm font-bold text-red-800 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Riscos identificados
                  </h4>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {response.risks.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-1">Remoção × Desindexação × Cópias</h4>
                <p className="text-sm text-slate-600">{response.distinctionNote}</p>
              </div>
            </div>

            {response.technicalAnalysis && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                  <Search className="h-5 w-5 text-indigo-600 mr-2" />
                  Análise técnica do endereço
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {response.technicalAnalysis.domain && (
                    <div><span className="font-medium text-slate-500">Domínio:</span> {response.technicalAnalysis.domain}</div>
                  )}
                  {response.technicalAnalysis.host && (
                    <div><span className="font-medium text-slate-500">Host:</span> {response.technicalAnalysis.host}</div>
                  )}
                  {response.technicalAnalysis.cdn && (
                    <div><span className="font-medium text-slate-500">CDN:</span> {response.technicalAnalysis.cdn}</div>
                  )}
                  {response.technicalAnalysis.socialNetwork && (
                    <div><span className="font-medium text-slate-500">Rede social:</span> {response.technicalAnalysis.socialNetwork}</div>
                  )}
                </div>
                {response.technicalAnalysis.reportingChannels?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">Canais de denúncia sugeridos:</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-0.5">
                      {response.technicalAnalysis.reportingChannels.map((ch, i) => (
                        <li key={i}>{ch}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {response.technicalAnalysis.notes?.length > 0 && (
                  <div className="mt-3 text-sm text-slate-600">
                    {response.technicalAnalysis.notes.map((n, i) => (
                      <p key={i}>• {n}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <ChevronRight className="h-5 w-5 text-indigo-600 mr-1" />
                Plano de ação prioritário
              </h3>
              <div className="space-y-4">
                {response.actionPlan
                  .sort((a, b) => a.priority - b.priority)
                  .map((stepItem, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                        {stepItem.priority}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{stepItem.title}</h4>
                        <p className="text-sm text-slate-600 mt-0.5">{stepItem.description}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {stepItem.type}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {response.templates.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  Modelos prontos para denúncia
                </h3>
                <div className="space-y-6">
                  {response.templates.map((tpl, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-slate-800">{tpl.title}</h4>
                        <span className="text-xs text-slate-500">{tpl.platform}</span>
                      </div>
                      {tpl.channel && (
                        <p className="text-xs text-indigo-600 mb-1">Canal: {tpl.channel}</p>
                      )}
                      <CopyBlock label="Texto para copiar" text={tpl.content} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                  <Camera className="h-5 w-5 text-indigo-600 mr-2" />
                  Preservação de provas
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {response.evidenceTips.map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                  <Eye className="h-5 w-5 text-indigo-600 mr-2" />
                  Monitoramento
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {response.monitoringTips.map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <RefreshCw className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Checklist final</h3>
              <ul className="space-y-2">
                {response.checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {response.placeholders.length > 0 && (
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                <h4 className="text-sm font-bold text-amber-900 mb-2">Campos que você ainda precisa preencher</h4>
                <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                  {response.placeholders.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                onClick={resetApp}
                className="inline-flex items-center px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Novo caso
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-xs text-slate-400 pb-6">
        EraseMe — Ferramenta de apoio à proteção de privacidade. Não substitui orientação jurídica ou policial.
      </footer>
    </div>
  );
};

export default App;
