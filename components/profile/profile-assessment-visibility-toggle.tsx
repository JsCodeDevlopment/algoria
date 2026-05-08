"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleAssessmentPublicVisibility } from "@/lib/actions/assessment";
import { cn } from "@/lib/utils";

interface Props {
  testSlug: string;
  initialIsPublic: boolean;
}

export function ProfileAssessmentVisibilityToggle({ testSlug, initialIsPublic }: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const result = await toggleAssessmentPublicVisibility(testSlug, !isPublic);
    if (result.success) {
      setIsPublic(!isPublic);
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "h-7 rounded-none px-2 text-[8px] font-black uppercase tracking-widest gap-1.5 transition-all",
        isPublic 
          ? "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isPublic ? (
        <>
          <Eye className="h-3 w-3" /> Público
        </>
      ) : (
        <>
          <EyeOff className="h-3 w-3" /> Privado
        </>
      )}
    </Button>
  );
}
