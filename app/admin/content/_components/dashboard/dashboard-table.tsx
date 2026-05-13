"use client";

import Image from "next/image";
import Link from "next/link";
import { ContentRow, ContentStatus } from "../types";
import { STATUS_BADGES } from "./dashboard-types";

interface DashboardTableProps {
  rows: ContentRow[];
  isPending: boolean;
  onStatusUpdate: (id: string, status: ContentStatus) => void;
  onAccessUpdate: (id: string, access: "free" | "pro") => void;
  accessFilter?: string;
  isAdmin: boolean;
}

export function DashboardTable({
  rows,
  isPending,
  onStatusUpdate,
  onAccessUpdate,
  accessFilter,
  isAdmin,
}: DashboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Título
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Tipo
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Autor
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Versão
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Atualizado
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isPending && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Carregando...
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                      <svg
                        className="h-7 w-7 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm-3-3h.008v.008H9.75v-.008zm0 3h.008v.008H9.75v-.008z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Nenhum conteúdo encontrado
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isAdmin
                          ? "Os conteúdos aparecerão aqui após serem migrados."
                          : "Ainda não criaste nenhum conteúdo."}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const badge = STATUS_BADGES[row.status];
                return (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-accent/50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {row.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {row.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
                          {row.authorImage ? (
                            <Image
                              src={row.authorImage}
                              alt={row.authorName || ""}
                              width={24}
                              height={24}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">
                              {row.authorName?.[0] || "?"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {row.authorName || "Sistema"}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {row.authorId?.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      v{row.version}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {new Date(row.updatedAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/content/${row.id}/edit`}
                          className="inline-flex h-7 items-center rounded-md border border-border px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                        >
                          Editar
                        </Link>
                        {isAdmin && (
                          <Link
                            href={`/admin/content/${row.id}/review`}
                            className="inline-flex h-7 items-center rounded-md border border-border px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                          >
                            Revisar
                          </Link>
                        )}
                        {isAdmin && row.status === "PENDING_REVIEW" && (
                          <button
                            onClick={() => onStatusUpdate(row.id, "PUBLISHED")}
                            disabled={isPending}
                            className="inline-flex h-7 items-center rounded-md bg-emerald-500/10 px-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                          >
                            Publicar
                          </button>
                        )}
                        {isAdmin && row.access === "pro" && (
                          <button
                            onClick={() => onAccessUpdate(row.id, "free")}
                            disabled={isPending}
                            className="inline-flex h-7 items-center rounded-md bg-blue-500/10 px-2.5 text-xs font-bold tracking-tight text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-500/20 disabled:opacity-50 shadow-sm"
                          >
                            Tornar Gratuito
                          </button>
                        )}
                        {isAdmin && row.access === "free" && (
                          <button
                            onClick={() => onAccessUpdate(row.id, "pro")}
                            disabled={isPending}
                            className="inline-flex h-7 items-center rounded-md bg-amber-500/10 px-2.5 text-xs font-bold tracking-tight text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500/20 disabled:opacity-50 shadow-sm"
                          >
                            Tornar Pago
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
