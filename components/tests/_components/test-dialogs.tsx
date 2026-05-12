import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  showFinishDialog: boolean;
  setShowFinishDialog: (show: boolean) => void;
  showGiveUpDialog: boolean;
  setShowGiveUpDialog: (show: boolean) => void;
  onFinish: () => void;
  onGiveUp: () => void;
}

export function TestDialogs({
  showFinishDialog,
  setShowFinishDialog,
  showGiveUpDialog,
  setShowGiveUpDialog,
  onFinish,
  onGiveUp,
}: Props) {
  return (
    <>
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Simulado?</DialogTitle>
            <DialogDescription>
              Tens a certeza que queres finalizar o teste? Não poderás alterar
              as tuas respostas depois disto.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              className="rounded-none uppercase font-black text-xs"
              onClick={() => setShowFinishDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-none uppercase font-black text-xs"
              onClick={onFinish}
            >
              Confirmar e Finalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGiveUpDialog} onOpenChange={setShowGiveUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Desistir do Teste?
            </DialogTitle>
            <DialogDescription>
              Tens a certeza que queres desistir? Todo o teu progresso neste
              simulado será perdido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              className="rounded-none uppercase font-black text-xs"
              onClick={() => setShowGiveUpDialog(false)}
            >
              Continuar Teste
            </Button>
            <Button
              variant="destructive"
              className="rounded-none uppercase font-black text-xs"
              onClick={onGiveUp}
            >
              Sim, Desistir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
