import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BookOpen, Save } from "lucide-react";
import { toast } from "sonner";

interface NotesPanelProps {
  symbol?: string;
}

export const NotesPanel = ({ symbol }: NotesPanelProps) => {
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  const storageKey = `trading-notes-${symbol || "general"}`;

  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, notes);
    toast.success("Anotações salvas com sucesso!");
  };

  const handleClear = () => {
    setNotes("");
    localStorage.removeItem(storageKey);
    toast.success("Anotações apagadas!");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <BookOpen className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Bloco de Notas</SheetTitle>
          <SheetDescription>
            Anote suas observações e estratégias de trading
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6 h-[calc(100vh-180px)]">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escreva suas anotações aqui..."
            className="flex-1 resize-none font-mono"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClear}>
              Limpar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
