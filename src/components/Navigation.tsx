import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed z-50 transition-all duration-500 ease-out left-1/2 -translate-x-1/2 ${isScrolled
          ? "top-4 w-[95%] md:w-[85%] lg:w-[75%] rounded-full bg-background/70 backdrop-blur-md shadow-lg border border-white/10 py-2"
          : "top-0 w-full bg-transparent py-4 md:py-6"
        }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className={`font-heading font-bold text-gradient-gold cursor-pointer transition-all duration-500 ${isScrolled ? "text-2xl" : "text-3xl"
              }`}
          >
            Lisy Souza Ebert
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground/80 hover:text-primary transition-fast font-medium text-sm lg:text-base"
            >
              Home
            </Link>
            <Link
              to="/blog"
              className="text-foreground/80 hover:text-primary transition-fast font-medium text-sm lg:text-base"
            >
              Blog
            </Link>
            <Link
              to="/sobre"
              className="text-foreground/80 hover:text-primary transition-fast font-medium text-sm lg:text-base"
            >
              Sobre
            </Link>
            <Link
              to="/servicos"
              className="text-foreground/80 hover:text-primary transition-fast font-medium text-sm lg:text-base"
            >
              Serviços
            </Link>
            <Link
              to="/contato"
            >
              <Button
                size={isScrolled ? "sm" : "default"}
                className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-gold transition-all duration-500"
              >
                Contato
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-4 mx-2 bg-background/95 backdrop-blur-md shadow-elegant animate-fade-in-up rounded-2xl overflow-hidden border border-white/10">
            <div className="flex flex-col gap-4 p-6">
              <Link
                to="/"
                className="text-foreground/80 hover:text-primary transition-fast font-medium text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="text-foreground/80 hover:text-primary transition-fast font-medium text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/sobre"
                className="text-foreground/80 hover:text-primary transition-fast font-medium text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                to="/servicos"
                className="text-foreground/80 hover:text-primary transition-fast font-medium text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Serviços
              </Link>
              <Link
                to="/contato"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-gold transition-smooth w-full"
                >
                  Contato
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
