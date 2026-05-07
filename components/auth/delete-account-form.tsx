'use client';

import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { deleteAccount } from '@/app/profile/actions';

export function DeleteAccountForm() {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Tens a certeza absoluta que queres excluir a tua conta? Esta ação é irreversível.')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteAccount();
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao excluir a conta.');
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      className="rounded-none font-bold uppercase tracking-wide gap-2 shrink-0"
      onClick={() => void handleDelete()}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      Excluir Permanentemente
    </Button>
  );
}
