import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onUpload: (imageData: string) => void;
}

export const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                onUpload(event.target.result as string);
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error pasting image:", error);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Grande área de colar para desktop */}
      <button
        onClick={handlePaste}
        className="w-full min-h-[500px] relative group overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary-glow/5 to-primary/5 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 hover:bg-primary/5"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
          {/* Ícone e título principal */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              <Upload className="h-20 w-20 text-primary relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black tracking-[0.2em] uppercase text-foreground">
                COLAR SCREENSHOT
              </h3>
              <p className="text-lg text-muted-foreground tracking-wider">
                Pressione Ctrl+V ou clique aqui
              </p>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-primary/10">
            <p className="text-sm text-muted-foreground text-center tracking-wide">
              Capture seu gráfico e cole aqui para análise instantânea
            </p>
          </div>

          {/* Botão alternativo de upload */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="mt-4 px-6 py-3 rounded-xl border border-primary/30 hover:border-primary/60 bg-black/30 hover:bg-primary/10 transition-all duration-300"
          >
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-foreground/80 hover:text-foreground">
              Ou fazer upload de arquivo
            </span>
          </button>
        </div>
      </button>
    </div>
  );
};
