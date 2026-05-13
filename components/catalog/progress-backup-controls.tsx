"use client";

import { Download, Upload } from "lucide-react";
import { type ChangeEvent, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  importProgressReplace,
  serializeProgressBlob,
} from "@/lib/progress/local-progress";

export function ProgressBackupControls() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = serializeProgressBlob();
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `algoria-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePickFile() {
    inputRef.current?.click();
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    const result = importProgressReplace(text);
    if (result.ok) {
      window.alert("Progresso restaurado com sucesso.");
    } else {
      window.alert(`Não foi possível importar: ${result.error}`);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border border-border bg-muted/30 px-3 py-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
        Backup local
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={handleExport}
      >
        <Download className="h-3.5 w-3.5" aria-hidden />
        Exportar JSON
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={handlePickFile}
      >
        <Upload className="h-3.5 w-3.5" aria-hidden />
        Importar…
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        aria-hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
