import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">Aviso Legal e de Segurança</h3>
          <div className="mt-2 text-sm text-amber-700 space-y-1">
            <p>
              O EraseMe fornece orientações gerais e modelos de texto. <strong>Não é aconselhamento jurídico.</strong>
            </p>
            <p>
              Se você estiver em perigo imediato, ligue para a polícia (190) ou procure a delegacia especializada
              (crimes cibernéticos / Delegacia da Mulher). Não entre em contato direto com agressores.
            </p>
            <p>
              Preserve provas antes de qualquer denúncia. Em casos de conteúdo envolvendo menores, priorize
              canais oficiais de proteção à criança e ao adolescente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
