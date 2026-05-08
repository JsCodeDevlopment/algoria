"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import type { CompanyProject, Experience, Role } from "./types";

interface ExperienceManagerProps {
  experiences: Experience[];
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
  onUpdateExperience: (
    index: number,
    field: keyof Experience,
    value: any,
  ) => void;
  onAddRole: (expIndex: number) => void;
  onRemoveRole: (expIndex: number, roleIndex: number) => void;
  onUpdateRole: (
    expIndex: number,
    roleIndex: number,
    field: keyof Role,
    value: string | boolean,
  ) => void;
  onAddCompanyProject: (expIndex: number) => void;
  onRemoveCompanyProject: (expIndex: number, projIndex: number) => void;
  onUpdateCompanyProject: (
    expIndex: number,
    projIndex: number,
    field: keyof CompanyProject,
    value: string,
  ) => void;
  calculateDuration: (start: string, end: string, current: boolean) => string;
  calculateTotalExperience: (exp: Experience) => string;
}

export function ExperienceManager({
  experiences,
  onAddExperience,
  onRemoveExperience,
  onUpdateExperience,
  onAddRole,
  onRemoveRole,
  onUpdateRole,
  onAddCompanyProject,
  onRemoveCompanyProject,
  onUpdateCompanyProject,
  calculateDuration,
  calculateTotalExperience,
}: ExperienceManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground">
            <Briefcase className="h-5 w-5" /> Percurso Profissional
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mt-1">
            Agrupa por empresa e adiciona promoções ou projetos internos.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddExperience}
          className="h-9 rounded-none gap-2 text-[10px] uppercase font-black border-2 border-primary text-primary"
        >
          <Plus className="h-4 w-4" /> Nova Empresa
        </Button>
      </div>

      <div className="space-y-12">
        {experiences.map((exp, expIdx) => (
          <div
            key={expIdx}
            className="relative border-l-2 border-border pl-8 space-y-8"
          >
            <button
              type="button"
              onClick={() => onRemoveExperience(expIdx)}
              className="absolute -left-[11px] top-0 h-5 w-5 flex items-center justify-center bg-destructive text-white rounded-none shadow-sm"
            >
              <Trash2 className="h-3 w-3" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nome da Empresa"
                value={exp.company}
                onChange={(e) =>
                  onUpdateExperience(expIdx, "company", e.target.value)
                }
                className="rounded-none border-border font-bold uppercase tracking-tight h-12"
              />
              <Input
                placeholder="Localização (Ex: Lisboa, Remoto)"
                value={exp.location || ""}
                onChange={(e) =>
                  onUpdateExperience(expIdx, "location", e.target.value)
                }
                className="rounded-none border-border h-12"
              />
            </div>

            <div className="space-y-4 pl-4 border-l border-muted">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Cargos e Progressão
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddRole(expIdx)}
                  className="h-6 text-[9px] uppercase font-bold gap-1 text-primary"
                >
                  <Plus className="h-3 w-3" /> Adicionar Cargo
                </Button>
              </div>
              {exp.roles.map((role, roleIdx) => (
                <div
                  key={roleIdx}
                  className="relative group space-y-3 bg-muted/20 p-4 border border-border"
                >
                  {exp.roles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveRole(expIdx, roleIdx)}
                      className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Título (Ex: Senior Developer)"
                      value={role.title}
                      onChange={(e) =>
                        onUpdateRole(expIdx, roleIdx, "title", e.target.value)
                      }
                      className="rounded-none h-10 font-bold"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={role.startDate}
                        onChange={(e) =>
                          onUpdateRole(
                            expIdx,
                            roleIdx,
                            "startDate",
                            e.target.value,
                          )
                        }
                        className="rounded-none h-10 text-xs"
                      />
                      <span className="text-muted-foreground">—</span>
                      {role.current && roleIdx === 0 ? (
                        <div className="flex-1 h-10 flex items-center px-3 border border-dashed border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary">
                          Atualmente
                        </div>
                      ) : (
                        <Input
                          type="date"
                          value={role.endDate}
                          onChange={(e) =>
                            onUpdateRole(
                              expIdx,
                              roleIdx,
                              "endDate",
                              e.target.value,
                            )
                          }
                          className="rounded-none h-10 text-xs"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {roleIdx === 0 ? (
                        <>
                          <input
                            type="checkbox"
                            id={`current-${expIdx}-${roleIdx}`}
                            checked={role.current}
                            onChange={(e) =>
                              onUpdateRole(
                                expIdx,
                                roleIdx,
                                "current",
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4 rounded-none border-border accent-primary"
                          />
                          <label
                            htmlFor={`current-${expIdx}-${roleIdx}`}
                            className="text-[10px] font-black uppercase tracking-widest cursor-pointer select-none"
                          >
                            Trabalho aqui atualmente
                          </label>
                        </>
                      ) : (
                        <div className="h-4" />
                      )}
                    </div>

                    {role.startDate && (
                      <div className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">
                        Duração:{" "}
                        {calculateDuration(
                          role.startDate,
                          role.endDate,
                          role.current,
                        )}
                      </div>
                    )}
                  </div>

                  <textarea
                    placeholder="Responsabilidades e conquistas"
                    value={role.description}
                    onChange={(e) =>
                      onUpdateRole(
                        expIdx,
                        roleIdx,
                        "description",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-none border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 px-4 py-2 bg-primary/5 border-l-2 border-primary flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Tempo total na {exp.company || "empresa"}
              </span>
              <span className="text-[10px] font-black text-foreground">
                {calculateTotalExperience(exp)}
              </span>
            </div>

            <div className="space-y-4 pl-4 border-l border-muted">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Projetos em Destaque nesta Empresa
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddCompanyProject(expIdx)}
                  className="h-6 text-[9px] uppercase font-bold gap-1 text-primary"
                >
                  <Plus className="h-3 w-3" /> Adicionar Projeto
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exp.projects.map((proj, projIdx) => (
                  <div
                    key={projIdx}
                    className="relative group space-y-2 bg-background p-4 border border-border shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => onRemoveCompanyProject(expIdx, projIdx)}
                      className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <Input
                      placeholder="Título do Projeto"
                      value={proj.title}
                      onChange={(e) =>
                        onUpdateCompanyProject(
                          expIdx,
                          projIdx,
                          "title",
                          e.target.value,
                        )
                      }
                      className="rounded-none h-8 text-xs font-bold"
                    />
                    <Input
                      placeholder="URL da Imagem"
                      value={proj.imageUrl}
                      onChange={(e) =>
                        onUpdateCompanyProject(
                          expIdx,
                          projIdx,
                          "imageUrl",
                          e.target.value,
                        )
                      }
                      className="rounded-none h-8 text-[10px]"
                    />
                    <Input
                      placeholder="Link (Opcional)"
                      value={proj.link}
                      onChange={(e) =>
                        onUpdateCompanyProject(
                          expIdx,
                          projIdx,
                          "link",
                          e.target.value,
                        )
                      }
                      className="rounded-none h-8 text-[10px]"
                    />
                    <textarea
                      placeholder="Descrição curta"
                      value={proj.description}
                      onChange={(e) =>
                        onUpdateCompanyProject(
                          expIdx,
                          projIdx,
                          "description",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-none border border-border bg-background px-2 py-1 text-xs h-16"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            Nenhuma experiência adicionada.
          </p>
        )}
      </div>
      <input
        type="hidden"
        name="experiences"
        value={JSON.stringify(experiences)}
      />
    </div>
  );
}
