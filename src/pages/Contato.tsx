import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Phone, Loader2, CheckCircle2 } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import InstagramIcon from "@/components/InstagramIcon";
import { createLead, type LeadPayload } from "@/lib/api";

// Função para formatar telefone
const formatPhone = (value: string) => {
  if (!value) return '';
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara (XX) XXXXX-XXXX
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

const formSchema = z.object({
  name: z.string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome muito longo" }),
  email: z.string()
    .trim()
    .email({ message: "E-mail inválido" })
    .max(255, { message: "E-mail muito longo" }),
  whatsapp: z.string()
    .trim()
    .min(10, { message: "WhatsApp inválido" })
    .max(20, { message: "WhatsApp muito longo" })
    .regex(/^[\d\s()+\-]+$/, { message: "Use apenas números e caracteres válidos" }),
  service: z.string({
    required_error: "Selecione um serviço",
  }).min(1, { message: "Selecione um serviço" }),
  message: z.string()
    .trim()
    .min(10, { message: "Mensagem muito curta" })
    .max(1000, { message: "Mensagem deve ter no máximo 1000 caracteres" }),
});

type FormValues = z.infer<typeof formSchema>;

const Contato = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const payload: LeadPayload = {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        service: data.service,
        message: data.message,
      };

      await createLead(payload);

      setSubmitSuccess(true);
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Retornarei o mais breve possível.",
      });
      form.reset();

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente mais tarde ou entre em contato por WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 animate-fade-in-up">
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                  Envie sua <span className="text-gradient-gold">mensagem</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Preencha o formulário abaixo e retornarei o mais breve possível.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h3 className="font-heading text-2xl font-semibold mb-8">
                      Informações de Contato
                    </h3>
                    
                    <div className="space-y-6">
                      {/* 1. WhatsApp */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <WhatsAppIcon size={20} className="text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">WhatsApp</p>
                          <a href="https://wa.me/message/ULYP23T5JMLEI1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-fast">
                            (51) 99898-1667
                          </a>
                        </div>
                      </div>

                      {/* 2. Instagram */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <InstagramIcon size={20} className="text-pink-500" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">Instagram</p>
                          <a href="https://www.instagram.com/lisysouzaebert?igsh=MTB4ZTIzNm9zYWtqYw==&utm_source=ig_contact_invite" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-fast">
                            @lisysouzaebert
                          </a>
                        </div>
                      </div>

                      
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
                    <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                      <strong className="text-foreground">Horário de atendimento:</strong><br />
                      Segunda a Sexta: 9h às 18h<br />
                      Sábado: 9h às 13h
                    </p>
                    
                    {/* Botões de redes sociais */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="https://www.instagram.com/lisysouzaebert?igsh=MTB0ZTIzNm9zYWtqYw==&utm_source=ig_contact_invite"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-smooth text-sm font-medium"
                      >
                        <InstagramIcon size={16} />
                        Siga no Instagram
                      </a>
                      <a
                        href="https://wa.me/message/ULYP23T5JMLEI1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:shadow-lg transition-smooth text-sm font-medium"
                      >
                        <WhatsAppIcon size={16} />
                        Conversar no WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in-up">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 bg-background rounded-2xl shadow-elegant">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Seu nome"
                                className="bg-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="seu@email.com"
                                className="bg-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="(00) 00000-0000"
                                className="bg-background"
                                value={formatPhone(field.value || '')}
                                onChange={(e) => {
                                  const formatted = formatPhone(e.target.value);
                                  field.onChange(formatted);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selecione o serviço de interesse</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Escolha um serviço" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background z-50">
                                <SelectItem value="terapeutico">Atendimento Terapêutico</SelectItem>
                                <SelectItem value="consultoria">Consultoria de Marca e Imagem</SelectItem>
                                <SelectItem value="mentoria">Mentoria</SelectItem>
                                <SelectItem value="workshop">Workshop/Palestra</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Como posso ajudá-lo em sua jornada?"
                                rows={4}
                                className="bg-background resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isSubmitting || submitSuccess}
                        className="w-full bg-primary hover:bg-primary-glow text-primary-foreground shadow-gold transition-smooth disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : submitSuccess ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mensagem enviada com sucesso!
                          </>
                        ) : (
                          "Enviar mensagem"
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
