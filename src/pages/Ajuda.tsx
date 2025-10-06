import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle, Search, MessageCircle, Mail, BookOpen, Video, FileText } from "lucide-react";

const Ajuda = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "Como usar o Scanner AI?",
      answer: "Para usar o Scanner AI, basta capturar ou fazer upload de uma imagem do gráfico que deseja analisar. Selecione o ativo (Forex, Crypto ou Stocks), o timeframe e o modelo de IA preferido. A análise será feita automaticamente e você receberá uma previsão com nível de confiança.",
    },
    {
      question: "Quais ativos são suportados?",
      answer: "Atualmente suportamos três tipos de ativos: Forex (pares de moedas), Criptomoedas (Bitcoin, Ethereum, etc.) e Ações (Apple, Google, Microsoft, etc.). Cada categoria possui vários ativos disponíveis para análise.",
    },
    {
      question: "Como funciona a planilha de gerenciamento?",
      answer: "A planilha permite que você registre sua banca inicial e todas as operações (lucros e prejuízos). O sistema calcula automaticamente seu saldo atual, total de lucros, perdas e a porcentagem de ganho/perda. As operações são organizadas por data para facilitar o acompanhamento.",
    },
    {
      question: "O que significa o nível de confiança?",
      answer: "O nível de confiança indica a certeza do modelo de IA sobre a previsão. Quanto maior a porcentagem, mais confiante está o modelo. Valores acima de 70% são considerados alta confiança, entre 50-70% média confiança, e abaixo de 50% baixa confiança.",
    },
    {
      question: "Qual modelo de IA devo escolher?",
      answer: "Temos dois modelos disponíveis: DeepSeek e Llama 3. O DeepSeek é otimizado para análises técnicas detalhadas, enquanto o Llama 3 oferece análises mais rápidas. Recomendamos testar ambos e escolher o que melhor se adequa ao seu estilo de trading.",
    },
    {
      question: "Como alterar as configurações do app?",
      answer: "Acesse o menu no canto superior direito (seu avatar) e selecione 'Configurações'. Lá você pode ajustar notificações, sons, tema, idioma e outras preferências do aplicativo.",
    },
    {
      question: "Posso usar o app offline?",
      answer: "O Scanner AI precisa de conexão com a internet para realizar as análises, pois utiliza modelos de IA em nuvem. No entanto, você pode visualizar análises anteriores e gerenciar sua planilha offline.",
    },
    {
      question: "Como interpretar os resultados da análise?",
      answer: "A análise fornece uma previsão (CALL para compra ou PUT para venda), o nível de confiança e uma análise detalhada. Leia atentamente a análise técnica fornecida, que inclui padrões identificados, níveis de suporte/resistência e recomendações.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-primary/10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary tracking-tight">
                Central de Ajuda
              </h1>
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Encontre respostas para suas dúvidas
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Search Box */}
        <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por palavras-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-primary/20 h-12"
            />
          </div>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all cursor-pointer text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-1">Tutoriais</h3>
            <p className="text-xs text-muted-foreground">Guias passo a passo</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all cursor-pointer text-center">
            <Video className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-1">Vídeos</h3>
            <p className="text-xs text-muted-foreground">Aprenda assistindo</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all cursor-pointer text-center">
            <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-1">Documentação</h3>
            <p className="text-xs text-muted-foreground">Referência completa</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all cursor-pointer text-center">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-1">Comunidade</h3>
            <p className="text-xs text-muted-foreground">Fórum de discussões</p>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Perguntas Frequentes
          </h2>

          {filteredFaqs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma pergunta encontrada para "{searchQuery}"
            </p>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-primary/10 rounded-lg px-4 bg-white/5"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Card>

        {/* Contact Support */}
        <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 mt-8">
          <h3 className="text-lg font-bold mb-4">Ainda precisa de ajuda?</h3>
          <p className="text-muted-foreground mb-6">
            Nossa equipe de suporte está pronta para ajudar você.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              <MessageCircle className="h-4 w-4 mr-2" />
              Abrir Chat
            </Button>
            <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/10">
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Ajuda;
