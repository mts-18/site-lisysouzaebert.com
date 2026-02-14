import { Heart, Sparkles, Moon } from "lucide-react";
import lisyPortrait from "@/assets/lisy-portrait.jpg";

const About = () => {
  return (
    <section id="sobre" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Sobre <span className="text-gradient-gold">Mim</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma jornada dedicada ao desenvolvimento pessoal e à transformação espiritual
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center mb-16">
            <div className="animate-fade-in">
              <div className="relative max-w-[460px] md:max-w-[520px] mx-auto">
                <div className="absolute -inset-8 bg-gradient-to-br from-yellow-400/60 via-amber-400/60 to-yellow-600/40 rounded-3xl blur-3xl opacity-80"></div>
                <div className="relative bg-background rounded-2xl shadow-elegant overflow-hidden">
                  <img 
                    src={lisyPortrait} 
                    alt="Lisy Souza Ebert - Terapeuta, Consultora e Mentora em Desenvolvimento Humano"
                    className="w-full h-auto object-contain rounded-2xl"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 animate-fade-in-up">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Lisy Souza Ebert é terapeuta, consultora, mentora e palestrante atuante nas áreas de desenvolvimento humano e estratégia de marca, imagem e negócios, unindo conhecimentos de inteligência emocional e espiritual, neurociência comportamental, psicologia analítica, branding e comunicação para despertar o poder da consciência como ferramenta de transformação pessoal e profissional.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Através de uma abordagem única que integra autoconhecimento, liderança e posicionamento, mostrando que toda transformação envolve corpo, mente e espírito em equilíbrio.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Sua missão é ajudar pessoas a se expressarem a partir da sua essência, a alinharem propósito e performance, e a manifestarem uma presença autêntica e poderosa no mundo.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-background rounded-2xl shadow-elegant hover:shadow-gold transition-smooth animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">Acolhimento</h3>
              <p className="text-muted-foreground">
                Espaço seguro e acolhedor para sua jornada de transformação
              </p>
            </div>

            <div className="text-center p-8 bg-background rounded-2xl shadow-elegant hover:shadow-gold transition-smooth animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">Transformação</h3>
              <p className="text-muted-foreground">
                Práticas personalizadas para seu desenvolvimento pessoal
              </p>
            </div>

            <div className="text-center p-8 bg-background rounded-2xl shadow-elegant hover:shadow-gold transition-smooth animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Moon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">Equilíbrio</h3>
              <p className="text-muted-foreground">
                Harmonia entre corpo, mente e espírito
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
