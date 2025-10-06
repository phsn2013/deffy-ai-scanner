import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import deepseekIcon from "@/assets/deepseek-icon.webp";
import llama3Icon from "@/assets/llama3-icon.webp";

export type AIModel = "gpt-5" | "gpt-4" | "gemini" | "deepseek" | "llama-3";

interface ModelOption {
  id: AIModel;
  name: string;
  description: string;
  icon: string;
}

const AI_MODELS: ModelOption[] = [
  { 
    id: "gpt-5", 
    name: "GPT-5", 
    description: "OpenAI GPT-5",
    icon: "https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png"
  },
  { 
    id: "gpt-4", 
    name: "GPT-4", 
    description: "OpenAI GPT-4",
    icon: "https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png"
  },
  { 
    id: "gemini", 
    name: "GEMINI", 
    description: "Google Gemini",
    icon: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
  },
  { 
    id: "deepseek", 
    name: "DEEPSEEK", 
    description: "DeepSeek AI",
    icon: deepseekIcon
  },
  { 
    id: "llama-3", 
    name: "Llama 3", 
    description: "Meta Llama 3",
    icon: llama3Icon
  },
];

interface ModelSelectorProps {
  value: AIModel;
  onChange: (value: AIModel) => void;
}

export const ModelSelector = ({ value, onChange }: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredModels = AI_MODELS.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModelSelect = (modelId: AIModel) => {
    onChange(modelId);
    setOpen(false);
  };

  const getDisplayValue = () => {
    const selectedModel = AI_MODELS.find(m => m.id === value);
    return selectedModel?.name || "Select";
  };

  const selectedModel = AI_MODELS.find(m => m.id === value);

  return (
    <div className="w-full space-y-2 md:space-y-3">
      <label className="block text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-primary">
        AI Model
      </label>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="w-full bg-white/5 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 transition-all rounded-xl h-10 md:h-12 text-foreground font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform justify-center"
          >
            {selectedModel && (
              <img 
                src={selectedModel.icon} 
                alt={selectedModel.name}
                className="w-6 h-6 md:w-8 md:h-8 rounded object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-2 border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Selecionar Modelo de IA</DialogTitle>
          </DialogHeader>
          
          {/* Search Input */}
          <div className="relative">
            <button
              type="button"
              onClick={() => searchInputRef.current?.focus()}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>
            <Input
              ref={searchInputRef}
              placeholder="Buscar modelo"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-primary/20 text-foreground"
              autoFocus={false}
              autoComplete="off"
              inputMode="none"
              onFocus={(e) => {
                // Força o teclado a aparecer apenas quando necessário
                e.currentTarget.setAttribute('inputMode', 'text');
              }}
              onBlur={(e) => {
                // Reseta para evitar abertura automática do teclado
                e.currentTarget.setAttribute('inputMode', 'none');
              }}
            />
          </div>

          {/* Model List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  value === model.id 
                    ? 'bg-primary/20 border-2 border-primary/40' 
                    : 'bg-transparent hover:bg-primary/10 border-2 border-transparent'
                }`}
              >
                <img 
                  src={model.icon} 
                  alt={model.name}
                  className="w-10 h-10 rounded object-contain bg-white/5 p-1"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${model.name}&background=random`;
                  }}
                />
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-foreground">{model.name}</p>
                  <p className="text-xs text-muted-foreground">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
