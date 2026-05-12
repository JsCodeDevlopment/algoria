'use client';

import { useEffect, useState, useTransition } from 'react';
import { 
  listCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '@/lib/actions/admin';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

export default function CategoriesAdminClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  
  // State for Create/Edit
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of category or 'new'
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  function loadCategories() {
    startTransition(async () => {
      const data = await listCategories();
      setCategories(data as Category[]);
    });
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (cat: Category) => {
    setIsEditing(cat.id);
    setFormData({ 
      name: cat.name, 
      slug: cat.slug, 
      description: cat.description || '' 
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      let result;
      if (isEditing === 'new') {
        result = await createCategory(formData);
      } else if (isEditing) {
        result = await updateCategory(isEditing, formData);
      }

      if (result?.error) {
        setFeedback({ type: 'error', msg: result.error });
      } else {
        setFeedback({ type: 'success', msg: isEditing === 'new' ? 'Categoria criada!' : 'Categoria atualizada!' });
        handleCancel();
        loadCategories();
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres eliminar esta categoria?')) return;
    
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.error) {
        setFeedback({ type: 'error', msg: result.error });
      } else {
        setFeedback({ type: 'success', msg: 'Categoria eliminada.' });
        loadCategories();
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase text-foreground">
            Gestão de Categorias
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define e organiza os tópicos oficiais da plataforma.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing('new')}
            className="flex items-center gap-2 h-9 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Nova Categoria
          </button>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Form Editor (Inline) */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="p-6 border border-primary/20 bg-primary/5 rounded-xl space-y-4 animate-in slide-in-from-top-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-primary">
            {isEditing === 'new' ? 'Criar Nova Categoria' : 'Editar Categoria'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Nome da Categoria</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, name: val, slug: generateSlug(val) });
                }}
                placeholder="Ex: Sistemas Distribuídos"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Slug (URL)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-mono focus:border-primary outline-none"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Descrição (Opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="h-9 px-4 text-xs font-bold uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 h-9 bg-primary px-6 rounded-lg text-xs font-black uppercase text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> {isEditing === 'new' ? 'Guardar Categoria' : 'Atualizar'}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-background/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px] text-muted-foreground">Nome</th>
                <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px] text-muted-foreground">Slug</th>
                <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px] text-muted-foreground">Descrição</th>
                <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-[10px] text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.length === 0 && !isPending ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground text-xs uppercase font-bold tracking-widest">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="transition-colors hover:bg-accent/50 group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs max-w-xs truncate">
                      {cat.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
