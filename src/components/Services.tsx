import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Briefcase, TrendingUp, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Sparkles,
    title: "Atendimentos Terapêuticos Individuais e Coletivos",
    description: "Transforme padrões emocionais, reequilibre sua energia e desperte sua consciência.",
    fullText: "Baseados na integração entre corpo, mente e espírito, promovem clareza emocional, expansão de consciência e realinhamento vibracional. Indicado para quem busca equilíbrio emocional, propósito e cura interior.",
    therapies: [
      "Mesa Crística do Infinito",
      "Canalização de Mentores Espirituais",
      "Desenho energético pessoal",
      "Terapia com Arquétipos"
    ],
    format: "online ou presencial (individual ou em grupo)",
    duration: "até 50 minutos",
    highlight: "O autoconhecimento é o caminho que transforma energia em consciência.",
  },
  {
    icon: Briefcase,
    title: "Consultoria de Marca e Imagem Pessoal",
    description: "Conecte sua imagem à sua essência e comunique sua energia com autenticidade.",
    fullText: "Consultoria estratégica e posicionamento para pessoas e profissionais que desejam alinhar quem são, o que sentem e o que comunicam, criando uma presença coerente, magnética e consciente.",
    therapies: [
      "Arquétipos de Marca e Personalidade",
      "Branding Pessoal e Comunicação Digital",
      "Construção de uma Presença Autêntica",
      "Imagem e Estilo com Propósito"
    ],
    format: "online",
    duration: null,
    publicTarget: "empreendedores, terapeutas, líderes e profissionais",
  },
  {
    icon: TrendingUp,
    title: "Mentoria de Desenvolvimento Pessoal e Profissional",
    description: "Expanda sua consciência e eleve seu poder pessoal.",
    fullText: "Mentoria profunda para integrar inteligência emocional, presença pessoal e liderança consciente.",
    therapies: [
      "Autogestão emocional e comportamental",
      "Tomada de decisão consciente",
      "Integração entre propósito e ação",
      "Desenvolvimento de liderança"
    ],
    format: "individual e personalizado",
    duration: null,
    highlight: "A verdadeira evolução é viver alinhado à própria frequência.",
  },
  {
    icon: Presentation,
    title: "Workshops e Palestras para Empreendedores e Líderes",
    description: "Desenvolvimento humano e gestão emocional para ambientes conscientes.",
    fullText: "Palestras e experiências corporativas com foco em neurociência, inteligência emocional e espiritual.",
    therapies: [
      "Autogestão Emocional",
      "Energia, Emoção e Comportamento no Trabalho",
      "Comunicação Consciente e Relações Humanas",
      "Liderança Energética e Inteligência Espiritual"
    ],
    format: "presencial ou online",
    duration: null,
    benefits: "redução do estresse, fortalecimento de equipes, melhora da comunicação e produtividade",
  },
];

const Services = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="servicos" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              A sua transformação com maior{" "}
              <span className="text-gradient-spiritual">consciência e presença</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Meus atendimentos e experiências são guiados por uma visão integrada do ser humano, unindo Neurociência Comportamental, Comunicação Pessoal e Empresarial, Inteligência Emocional e Espiritual e Terapias Energéticas.
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4">
              Cada serviço é um convite à reconexão com a essência e à expressão autêntica do seu potencial.
            </p>
          </div>

          <div className="space-y-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={index}
                  className="border-border hover:border-primary/50 transition-smooth hover:shadow-gold bg-card animate-scale-in overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="font-heading text-2xl mb-3">{service.title}</CardTitle>
                        <p className="text-lg text-foreground/90 mb-3 font-medium">{service.description}</p>
                        <CardDescription className="text-base leading-relaxed">
                          {service.fullText}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">
                        {service.title.includes("Consultoria") ? "Abordagem:" : 
                         service.title.includes("Mentoria") ? "Conteúdos:" :
                         service.title.includes("Workshops") ? "Temas principais:" : "Terapias aplicadas:"}
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {service.therapies.map((therapy, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1.5">•</span>
                            <span className="text-muted-foreground">{therapy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {service.benefits && (
                      <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                        <p className="text-sm">
                          <strong className="text-accent">Benefícios:</strong>{" "}
                          <span className="text-muted-foreground">{service.benefits}</span>
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">Formato:</span>
                        <span className="text-muted-foreground">{service.format}</span>
                      </div>
                      {service.duration && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">Duração:</span>
                          <span className="text-accent font-medium">{service.duration}</span>
                        </div>
                      )}
                      {service.publicTarget && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">Público:</span>
                          <span className="text-muted-foreground">{service.publicTarget}</span>
                        </div>
                      )}
                    </div>

                    {service.highlight && (
                      <div className="pt-4 border-t border-border">
                        <p className="font-heading text-lg font-bold italic text-gradient-gold">
                          "{service.highlight}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center p-8 md:p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl border border-primary/20 animate-fade-in">
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Agende seu atendimento, mentoria ou palestra
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sinta-se à vontade para entrar em contato e escolher o serviço que mais ressoa com o seu momento.
            </p>
            <Button
              size="lg"
              onClick={() => scrollToSection("contato")}
              className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-gold transition-smooth text-base px-10 py-6"
            >
              Entrar em Contato
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
