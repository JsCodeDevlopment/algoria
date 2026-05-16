"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface RawMetadataEditorProps {
  meta: Record<string, unknown>;
  setMeta: (v: Record<string, unknown>) => void;
}

export function RawMetadataEditor({ meta, setMeta }: RawMetadataEditorProps) {
  const [jsonText, setJsonText] = useState(JSON.stringify(meta, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [prevMeta, setPrevMeta] = useState(meta);
  const [lastAppliedJson, setLastAppliedJson] = useState(JSON.stringify(meta));

  if (meta !== prevMeta) {
    setPrevMeta(meta);
    const newJson = JSON.stringify(meta, null, 2);
    if (JSON.stringify(meta) !== lastAppliedJson) {
      setJsonText(newJson);
      setLastAppliedJson(JSON.stringify(meta));
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonText);
        if (typeof parsed === "object" && parsed !== null) {
          const stringified = JSON.stringify(parsed);
          if (stringified !== JSON.stringify(meta)) {
            setMeta(parsed);
            setLastAppliedJson(stringified);
            setError(null);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
          }
        }
      } catch (e) {
        // Não mostramos erro no auto-apply para não incomodar enquanto digita
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [jsonText, meta, setMeta]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("O JSON deve ser um objeto.");
      }
      const stringified = JSON.stringify(parsed);
      setMeta(parsed);
      setLastAppliedJson(stringified);
      setError(null);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON inválido");
      setIsSuccess(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Editor de Metadados (JSON)
        </h3>
        <p className="text-xs text-muted-foreground">
          Edita os campos diretamente no objeto JSON abaixo. Tem cuidado com a
          sintaxe.
        </p>
      </div>

      <div className="relative group">
        <textarea
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setError(null);
          }}
          spellCheck={false}
          className={`w-full min-h-[400px] bg-[#0c0c0c] text-emerald-400 p-6 font-mono text-xs rounded-none border-2 transition-colors outline-none ${
            error
              ? "border-destructive"
              : "border-border focus:border-primary/50"
          }`}
        />

        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-destructive/10 border border-destructive/20 p-3 rounded flex items-center gap-3 text-destructive animate-in slide-in-from-bottom-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {error}
            </span>
          </div>
        )}

        {isSuccess && (
          <div className="absolute bottom-4 right-4 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded flex items-center gap-2 text-emerald-500 animate-in fade-in zoom-in">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              Aplicado
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleApply}
          variant="outline"
          className="rounded-none border-2 font-black uppercase tracking-widest px-8"
        >
          Aplicar Alterações
        </Button>
      </div>

      <div className="p-4 bg-muted/20 border border-border/50 text-[10px] leading-relaxed text-muted-foreground uppercase font-medium">
        Nota: Alterar campos como &quot;access&quot; ou &quot;slug&quot; através
        deste editor pode ter impacto direto na visibilidade e links do
        conteúdo. Campos que já existem nos formulários visuais serão
        sincronizados.
      </div>
    </div>
  );
}
