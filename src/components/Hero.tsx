import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import palestraImg from "@/assets/palestra-lisy.jpg";

const Hero = () => {
  const [scrollPos, setScrollPos] = useState(0);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollPos(currentScroll);

      // Mostrar botões após rolar (300px)
      if (currentScroll > 300) {
        setShowButtons(true);
      } else {
        setShowButtons(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Blur aumenta suavemente, começando só após 250px de scroll
  const blurAmount = Math.min(Math.max((scrollPos - 250) * 0.04, 0), 12);

  return (
    <section
      id="home"
      className="min-h-screen py-32 flex flex-col items-center justify-start relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/50"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float -z-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float -z-10" style={{ animationDelay: "1s" }}></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center animate-fade-in mb-12">
          <h1
            className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-neutral-900 dark:text-neutral-100"
            style={{
              textShadow: "0 0 10px rgba(234,179,8,0.9), 0 0 20px rgba(234,179,8,0.7), 0 0 40px rgba(234,179,8,0.5), 0 0 60px rgba(250, 204, 21, 0.4)",
            }}
          >
            Transformar a consciência é transformar a realidade.
          </h1>
          <div className="w-28 h-2 mx-auto bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 rounded-full mb-8 opacity-80"></div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Descubra um caminho de equilíbrio, paz interior e desenvolvimento pessoal através de terapias espirituais personalizadas.
          </p>
        </div>

        {/* Container da Imagem + Botões Interativos */}
        <div className="relative w-full max-w-5xl perspective-1000 group">

          {/* Imagem com Blur dinâmico */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-out transform bg-black"
            style={{
              transform: `scale(${1 + scrollPos * 0.0005})`
            }}
          >
            <img
              src={palestraImg}
              alt="Lisy Souza Ebert Palestrando"
              className="w-full h-auto object-cover max-h-[60vh] md:max-h-[75vh] transition-all duration-200"
              style={{
                filter: `blur(${blurAmount}px) brightness(${showButtons ? 0.6 : 1})`,
              }}
            />
          </div>

          {/* Botões Centralizados SOBRE a imagem (aparecem no scroll) */}
          <div
            className={`
              absolute inset-0 flex flex-col items-center justify-center gap-6 z-20 transition-all duration-500
              ${showButtons ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}
          >
            <p className="text-white text-center max-w-2xl px-6 text-xl md:text-2xl font-light italic drop-shadow-md">
              "Reconecte-se com sua força interior — sessões que libertam bloqueios, elevam sua consciência e despertam um novo você."
            </p>

            <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-xl">
              <Link to="/contato">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-gold transition-transform hover:scale-105 text-base px-8 py-6 w-full sm:w-auto"
                >
                  Agendar Consulta
                </Button>
              </Link>
              <Link to="/sobre">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 hover:border-white transition-transform hover:scale-105 text-base px-8 py-6 w-full sm:w-auto backdrop-blur-sm bg-white/5"
                >
                  Conheça mais
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
