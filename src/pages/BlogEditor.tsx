import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchBlogPost, createBlogPost, updateBlogPost, uploadBlogImage } from '@/lib/api';
import { useAuthContext } from '@/providers/AuthProvider';
import RichTextEditor from '@/components/RichTextEditor';

const formSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')),
  video_url: z.string().optional().or(z.literal('')),
  video_vertical: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function BlogEditor() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { authenticated } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      image_url: '',
      video_url: '',
      video_vertical: false,
    },
  });

  // Carregar post existente se estiver editando
  useEffect(() => {
    if (!isEditing || !id) return;

    const loadPost = async () => {
      try {
        const data = await fetchBlogPost(id);
        if (!data) throw new Error('Post não encontrado');

        reset({
          title: data.title,
          content: data.content,
          image_url: data.image_url || '',
          video_url: data.video_url || '',
          video_vertical: data.video_vertical || false,
        });

        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      } catch (error) {
        console.error('Erro ao carregar post:', error);
        alert('Não foi possível carregar o post. Tente novamente.');
        navigate('/blog');
      }
    };

    loadPost();
  }, [id, isEditing, navigate, reset]);

  // Atualizar preview da imagem quando a URL mudar
  const imageUrl = watch('image_url');
  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageUrl]);

  const videoUrl = watch('video_url');
  const isVertical = watch('video_vertical');

  // Auto-detect orientation for direct video links
  useEffect(() => {
    if (videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('vimeo.com') && !videoUrl.includes('drive.google.com')) {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.onloadedmetadata = () => {
        if (video.videoHeight > video.videoWidth) {
          setValue('video_vertical', true);
        } else {
          setValue('video_vertical', false);
        }
      };
    }
  }, [videoUrl, setValue]);

  // Verificar autenticação
  useEffect(() => {
    if (!authenticated) {
      navigate('/admin');
    }
  }, [authenticated, navigate]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const token = (import.meta.env.VITE_ADMIN_SECRET as string) || '';
      const response = await uploadBlogImage(token, file);

      if (!response.success || !response.url) throw new Error(response.message);
      setValue('image_url', response.url);
      setImagePreview(response.url);
    } catch (error: any) {
      alert(error.message || 'Erro no upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!authenticated) return;

    try {
      setIsSubmitting(true);

      const token = (import.meta.env.VITE_ADMIN_SECRET as string) || '';
      const payload = { ...data, published: true };

      if (isEditing && id) {
        await updateBlogPost(token, id, payload);
        alert('Post atualizado com sucesso!');
      } else {
        await createBlogPost(token, payload);
        alert('Post criado com sucesso!');
      }

      navigate('/blog');
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      alert('Não foi possível salvar o post. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            {isEditing ? 'Editar Post' : 'Novo Post'}
          </h1>
          <Button variant="ghost" asChild>
            <Link to="/blog">Cancelar</Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="title" className="mb-2 block">Título</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  minHeight="80px"
                  maxHeight="150px"
                />
              )}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="content" className="mb-2 block">Conteúdo</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div>
            <Label>
              <span className="block mb-2">Imagem do post</span>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="cursor-pointer"
              />
            </Label>
            {uploading && <p className="mt-2 text-sm text-muted-foreground">Enviando imagem...</p>}

            <div className="mt-4">
              <Label>Pré-visualização da imagem</Label>
              {imagePreview ? (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Pré-visualização"
                    className="max-h-64 w-auto rounded-lg border border-border"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-500"
                    onClick={() => { setValue('image_url', ''); setImagePreview(null); }}
                  >
                    Remover imagem
                  </Button>
                </div>
              ) : (
                <div className="mt-2 p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
                  <p className="text-muted-foreground text-sm">Nenhuma imagem selecionada</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="video_url">URL do Vídeo (YouTube, Vimeo ou link direto)</Label>
            <Input
              id="video_url"
              placeholder="Ex: https://www.youtube.com/watch?v=..."
              {...register('video_url')}
              className="mt-1"
            />

            <div className="mt-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="video_vertical"
                {...register('video_vertical')}
                className="h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
              />
              <Label htmlFor="video_vertical" className="cursor-pointer">
                Este vídeo está na Vertical? (Formato Celular/Reels)
              </Label>
            </div>

            <div className="mt-4">
              <Label>Pré-visualização do conteúdo em vídeo</Label>
              {videoUrl ? (
                <div className={`mt-2 rounded-lg overflow-hidden border border-border bg-black mx-auto ${isVertical ? 'max-w-[320px] aspect-[9/16]' : 'w-full aspect-video'}`}>
                  {videoUrl.includes('drive.google.com') ? (
                    <iframe
                      src={videoUrl.split('/view')[0] + '/preview'}
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  ) : videoUrl.includes('wistia.com') ? (
                    <iframe
                      src={`https://fast.wistia.net/embed/iframe/${videoUrl.split('/').pop()}`}
                      className="w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  ) : videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={videoUrl.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : videoUrl.includes('vimeo.com') ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${videoUrl.split('/').pop()}`}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : videoUrl.includes('.mp4') || videoUrl.includes('.webm') || videoUrl.includes('.ogg') ? (
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    /* Fallback Universal: Tenta carregar qualquer link como Iframe (Funciona para Vturb, PandaVideo, etc) */
                    <iframe
                      src={videoUrl}
                      className="w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              ) : (
                <div className="mt-2 p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
                  <p className="text-muted-foreground text-sm">Insira um link para ver a prévia</p>
                </div>
              )}
            </div>
          </div>



          <div className="flex justify-end space-x-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/blog')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
