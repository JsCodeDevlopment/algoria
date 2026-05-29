'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { deleteAccount } from '@/app/profile/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function DeleteAccountForm() {
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteAccount();
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao excluir a conta.');
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          className="rounded-none font-bold uppercase tracking-wide gap-2 shrink-0"
        >
          <Trash2 className="h-4 w-4" />
          Excluir Permanentemente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-destructive/20 border-2 rounded-none bg-background p-6">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-widest text-destructive text-lg font-black flex items-center gap-2">
            <Trash2 className="h-5 w-5" /> Excluir Conta
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-4 leading-relaxed">
            Tens a certeza absoluta que queres excluir a tua conta? 
            <br /><br />
            Esta ação é <strong>irreversível</strong>. Todo o teu progresso, resultados de testes, assinatura ativa e dados do perfil serão apagados permanentemente dos nossos servidores e do teu dispositivo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-3 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            className="rounded-none uppercase tracking-widest text-[10px] font-bold flex-1"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-none uppercase tracking-widest text-[10px] font-bold flex-1 gap-2"
            onClick={() => void handleDelete()}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Sim, Excluir Tudo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
