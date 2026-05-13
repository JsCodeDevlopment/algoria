"use client";

import { useState } from "react";
import { Edit2, Check, ExternalLink, RefreshCw, ChevronLeft, ChevronRight, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput } from "../../content/_components/form-elements";

interface InventoryItem {
  id: string;
  contentId: string;
  pricingCategory: string;
  contentTitle: string;
  contentType: string;
  contentSlug: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
  isPending: boolean;
  onUpdateCategory: (id: string, category: string) => Promise<void>;
  onSync: () => Promise<void>;
  onMakeFree: (contentId: string) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

export function InventoryTable({
  items,
  isPending,
  onUpdateCategory,
  onSync,
  onMakeFree,
}: InventoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempCategory, setTempCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  async function handleSave(id: string) {
    if (!tempCategory.trim()) return;
    await onUpdateCategory(id, tempCategory.trim());
    setEditingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          Catálogo de Conteúdo Pago
        </h2>
        <Button
          onClick={onSync}
          variant="outline"
          size="sm"
          disabled={isPending}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          Sincronizar Conteúdo Pro
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                Conteúdo
              </th>
              <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                Tipo
              </th>
              <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                Categoria de Pricing
              </th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedItems.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-bold text-foreground">
                    {item.contentTitle}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {item.contentSlug}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-none bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight text-secondary-foreground">
                    {item.contentType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2">
                      <TextInput
                        value={tempCategory}
                        onChange={setTempCategory}
                        placeholder="ex: Estrutura de Dados"
                        className="h-8"
                      />
                      <button
                        onClick={() => handleSave(item.id)}
                        className="p-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <span className="text-muted-foreground italic">
                        {item.pricingCategory}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setTempCategory(item.pricingCategory);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      onClick={() => onMakeFree(item.contentId)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-emerald-600"
                      title="Tornar Free"
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <a
                        href={`/admin/content/${item.contentId}/edit`}
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground italic"
                >
                  Nenhum conteúdo Pro encontrado. Marque conteúdos como Pro na
                  lista de conteúdos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-xs text-muted-foreground">
            Mostrando {startIndex + 1} a{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, items.length)} de{" "}
            {items.length} itens
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-xs font-bold">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
