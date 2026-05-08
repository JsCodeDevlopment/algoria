"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());

    startTransition(() => {
      router.push(`/explorer?${params.toString()}`);
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        className="rounded-none border-2 border-border hover:border-primary transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]"
      >
        <ChevronLeft size={18} />
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Página
        </span>
        <div className="h-10 w-10 flex items-center justify-center border-2 border-primary bg-primary/10 text-sm font-black text-primary">
          {currentPage}
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          de {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        className="rounded-none border-2 border-border hover:border-primary transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]"
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}
