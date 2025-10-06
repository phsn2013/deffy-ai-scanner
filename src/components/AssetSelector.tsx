import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Search, Info } from "lucide-react";
import btcIcon from "@/assets/crypto/btc.png";
import ethIcon from "@/assets/crypto/eth.png";
import adaIcon from "@/assets/crypto/ada.png";
import dogeIcon from "@/assets/crypto/doge.png";
import solIcon from "@/assets/crypto/sol.png";
import trxIcon from "@/assets/crypto/trx.png";
import usdtIcon from "@/assets/crypto/usdt.png";

export type AssetType = "forex" | "crypto" | "stocks";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  percentage?: string;
  icon: string;
}

const ASSETS: Asset[] = [
  // Forex
  { id: "eur-usd", name: "EUR/USD", symbol: "EUR/USD", type: "forex", percentage: "88%", icon: "🇪🇺🇺🇸" },
  { id: "gbp-usd", name: "GBP/USD", symbol: "GBP/USD", type: "forex", percentage: "85%", icon: "🇬🇧🇺🇸" },
  { id: "usd-jpy", name: "USD/JPY", symbol: "USD/JPY", type: "forex", percentage: "82%", icon: "🇺🇸🇯🇵" },
  { id: "aud-usd", name: "AUD/USD", symbol: "AUD/USD", type: "forex", percentage: "84%", icon: "🇦🇺🇺🇸" },
  { id: "usd-cad", name: "USD/CAD", symbol: "USD/CAD", type: "forex", percentage: "83%", icon: "🇺🇸🇨🇦" },
  
  // Crypto
  { id: "btc", name: "Bitcoin (OTC)", symbol: "BTC", type: "crypto", percentage: "88%", icon: btcIcon },
  { id: "eth", name: "Ethereum (OTC)", symbol: "ETH", type: "crypto", percentage: "89%", icon: ethIcon },
  { id: "cardano", name: "Cardano (OTC)", symbol: "ADA", type: "crypto", percentage: "90%", icon: adaIcon },
  { id: "doge", name: "Dogecoin (OTC)", symbol: "DOGE", type: "crypto", percentage: "85%", icon: dogeIcon },
  { id: "solana", name: "Solana (OTC)", symbol: "SOL", type: "crypto", percentage: "80%", icon: solIcon },
  { id: "tron", name: "TRON (OTC)", symbol: "TRX", type: "crypto", percentage: "89%", icon: trxIcon },
  { id: "usdt", name: "USDT (OTC)", symbol: "USDT", type: "crypto", percentage: "88%", icon: usdtIcon },
  
  // Stocks
  { id: "aapl", name: "Apple Inc.", symbol: "AAPL", type: "stocks", percentage: "92%", icon: "https://logo.clearbit.com/apple.com" },
  { id: "googl", name: "Alphabet Inc.", symbol: "GOOGL", type: "stocks", percentage: "90%", icon: "https://logo.clearbit.com/google.com" },
  { id: "msft", name: "Microsoft Corp.", symbol: "MSFT", type: "stocks", percentage: "91%", icon: "https://logo.clearbit.com/microsoft.com" },
  { id: "tsla", name: "Tesla Inc.", symbol: "TSLA", type: "stocks", percentage: "87%", icon: "https://logo.clearbit.com/tesla.com" },
  { id: "amzn", name: "Amazon Inc.", symbol: "AMZN", type: "stocks", percentage: "89%", icon: "https://logo.clearbit.com/amazon.com" },
  { id: "meta", name: "Meta Platforms", symbol: "META", type: "stocks", percentage: "88%", icon: "https://logo.clearbit.com/meta.com" },
];

interface AssetSelectorProps {
  value: AssetType;
  onChange: (value: AssetType) => void;
}

export const AssetSelector = ({ value, onChange }: AssetSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | AssetType>("all");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(
    ASSETS.find(a => a.type === value && a.id === "btc") || null
  );

  const filteredAssets = ASSETS.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || asset.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    onChange(asset.type);
    setOpen(false);
  };

  const getDisplayValue = () => {
    if (!selectedAsset) return "Selecionar";
    
    if (selectedAsset.type === "forex") {
      return (
        <div className="text-lg">
          {selectedAsset.icon}
        </div>
      );
    }
    
    return (
      <img 
        src={selectedAsset.icon} 
        alt={selectedAsset.name}
        className="w-6 h-6 object-contain"
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${selectedAsset.symbol}&background=random`;
        }}
      />
    );
  };

  return (
    <div className="w-full space-y-2 md:space-y-3">
      <label className="block text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-primary">
        Asset
      </label>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="w-full bg-white/5 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 transition-all rounded-xl h-10 md:h-12 text-foreground font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform justify-center"
          >
            {getDisplayValue()}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-2 border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Buscar</DialogTitle>
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
              placeholder="Buscar por nome"
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

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as "all" | AssetType)}>
            <TabsList className="grid w-full grid-cols-4 bg-white/5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="forex">Forex</TabsTrigger>
              <TabsTrigger value="stocks">Ações</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
              <div className="space-y-1">
                <div className="grid grid-cols-2 text-xs text-muted-foreground px-2 mb-2">
                  <span>Ativos</span>
                  <span className="text-right">Pagamento</span>
                </div>
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleAssetSelect(asset)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-transparent hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {asset.type === "forex" ? (
                        <div className="w-8 h-8 flex items-center justify-center text-lg">
                          {asset.icon}
                        </div>
                      ) : (
                        <img 
                          src={asset.icon} 
                          alt={asset.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${asset.symbol}&background=random`;
                          }}
                        />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">Binário</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-green-500">{asset.percentage}</span>
                      <button className="p-1 rounded-full border border-primary/20 hover:bg-primary/10">
                        <Info className="h-4 w-4" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};
