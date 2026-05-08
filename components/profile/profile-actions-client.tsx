"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
}

export function ProfileActionsClient({ userId }: Props) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/user/${userId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Meu Perfil na Algoria",
          text: "Confira o meu percurso profissional na Algoria!",
          url: profileUrl,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="h-7 rounded-none text-[9px] uppercase font-black tracking-widest border-primary/20 gap-2 min-w-[100px] transition-all"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-green-500" /> Copiado!
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copiar Link
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareProfile}
        className="h-7 rounded-none text-[9px] uppercase font-black tracking-widest border-primary/20 gap-2"
      >
        <Share2 className="h-3 w-3" /> Partilhar
      </Button>
    </div>
  );
}
