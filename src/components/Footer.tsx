import { Heart } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import InstagramIcon from "./InstagramIcon";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground/5 border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="font-heading text-xl font-semibold text-gradient-gold">
            Lisy Souza Ebert
          </div>
          
          <p className="text-muted-foreground text-sm">
            Transformando vidas através do autoconhecimento e desenvolvimento espiritual
          </p>

          {/* Botões de redes sociais */}
          <div className="flex items-center justify-center gap-4 py-4">
            <a
              href="https://www.instagram.com/lisysouzaebert?igsh=MTB4ZTIzNm9zYWtqYw==&utm_source=ig_contact_invite"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-smooth text-sm font-medium"
            >
              <InstagramIcon size={16} />
              Instagram
            </a>
            <a
              href="https://wa.me/message/ULYP23T5JMLEI1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:shadow-lg transition-smooth text-sm font-medium"
            >
              <WhatsAppIcon size={16} />
              WhatsApp
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
            <span>© {currentYear} - Feito com</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>para você</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
