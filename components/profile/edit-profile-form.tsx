'use client';

import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { updateProfile } from '@/app/profile/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function EditProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateProfile(formData);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="headline" className="text-xs font-bold uppercase text-muted-foreground tracking-wide">Headline Profissional</label>
        <Input 
          id="headline" 
          name="headline" 
          placeholder="Ex: Engenheiro de Software na TechCorp" 
          defaultValue={profile?.headline || ''}
          className="rounded-none border-border"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-xs font-bold uppercase text-muted-foreground tracking-wide">Sobre Mim (Bio)</label>
        <textarea 
          id="bio" 
          name="bio" 
          rows={4}
          placeholder="Um breve resumo sobre a tua experiência e objetivos."
          defaultValue={profile?.bio || ''}
          className="w-full rounded-none border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="githubUrl" className="text-xs font-bold uppercase text-muted-foreground tracking-wide">URL do GitHub</label>
          <Input 
            id="githubUrl" 
            name="githubUrl" 
            type="url"
            placeholder="https://github.com/..." 
            defaultValue={profile?.githubUrl || ''}
            className="rounded-none border-border"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="linkedinUrl" className="text-xs font-bold uppercase text-muted-foreground tracking-wide">URL do LinkedIn</label>
          <Input 
            id="linkedinUrl" 
            name="linkedinUrl" 
            type="url"
            placeholder="https://linkedin.com/in/..." 
            defaultValue={profile?.linkedinUrl || ''}
            className="rounded-none border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="technologies" className="text-xs font-bold uppercase text-muted-foreground tracking-wide">Tecnologias (separadas por vírgula)</label>
        <Input 
          id="technologies" 
          name="technologies" 
          placeholder="React, TypeScript, Node.js, Go" 
          defaultValue={profile?.technologies?.join(', ') || ''}
          className="rounded-none border-border"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full md:w-auto rounded-none font-bold uppercase tracking-wide gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar Perfil
      </Button>
    </form>
  );
}
