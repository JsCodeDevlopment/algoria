"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  bio: string;
}

export function ExpandableBio({ bio }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongBio = bio.length > 400;

  return (
    <div className="relative">
      <div 
        className={`text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap transition-all duration-500 overflow-hidden ${
          !isExpanded && isLongBio ? "max-h-32" : "max-h-[2000px]"
        }`}
      >
        {bio}
        {!isExpanded && isLongBio && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>
      
      {isLongBio && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
        >
          {isExpanded ? (
            <>Ver menos <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Ler bio completa <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}
    </div>
  );
}
