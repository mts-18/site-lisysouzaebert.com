import WhatsAppIcon from "./WhatsAppIcon";

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/message/ULYP23T5JMLEI1"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl transition-smooth hover:scale-110"
      title="Conversar no WhatsApp"
    >
      <WhatsAppIcon size={32} />
    </a>
  );
};

export default FloatingWhatsApp;
