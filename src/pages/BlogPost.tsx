import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { fetchBlogPost, deleteBlogPost, BlogPost } from '@/lib/api';
import { useAuthContext } from '@/providers/AuthProvider';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const data = await fetchBlogPost(id);
        if (!data) throw new Error('Post não encontrado');
        setPost(data);
      } catch (err) {
        console.error('Erro ao carregar post:', err);
        setError('Não foi possível carregar o post. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const token = (import.meta.env.VITE_ADMIN_SECRET as string) || '';
      await deleteBlogPost(token, id);
      navigate('/blog');
    } catch (err) {
      console.error('Erro ao excluir post:', err);
      alert('Não foi possível excluir o post. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Erro ao carregar o post</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/blog">Voltar para o blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Post não encontrado</h2>
          <p className="text-muted-foreground mb-6">O post que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/blog">Voltar para o blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/blog" className="flex items-center gap-2">
            ← Voltar para o blog
          </Link>
        </Button>

        <article>
          <header className="mb-8">
            {post.title && (
              <div
                className="text-4xl font-heading font-bold text-foreground mb-4 prose prose-2xl max-w-none prose-headings:text-foreground prose-headings:m-0 prose-p:m-0"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />
            )}
            <p className="text-muted-foreground">
              Publicado em {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </header>

          {post.image_url && (
            <div className="mb-8 rounded-3xl overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}

          {post.video_url && (
            <div className={`mb-8 rounded-3xl overflow-hidden bg-black border border-border mx-auto shadow-xl relative z-10 ${post.video_vertical ? 'max-w-[400px] aspect-[9/16]' : 'aspect-video'}`}>
              {post.video_url.includes('drive.google.com') ? (
                <iframe
                  src={post.video_url.split('/view')[0] + '/preview'}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : post.video_url.includes('wistia.com') ? (
                <iframe
                  src={`https://fast.wistia.net/embed/iframe/${post.video_url.split('/').pop()}`}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : post.video_url.includes('youtube.com') || post.video_url.includes('youtu.be') ? (
                <iframe
                  src={post.video_url.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : post.video_url.includes('vimeo.com') ? (
                <iframe
                  src={`https://player.vimeo.com/video/${post.video_url.split('/').pop()}`}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  allowFullScreen
                ></iframe>
              ) : post.video_url.includes('.mp4') || post.video_url.includes('.webm') || post.video_url.includes('.ogg') ? (
                <video
                  src={post.video_url}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={post.video_url}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          )}

          {post.content && (
            <div
              className="prose prose-lg max-w-none text-foreground prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground/90 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {authenticated && (
            <div className="mt-12 pt-6 border-t border-border flex gap-4">
              <Button asChild variant="outline">
                <Link to={`/blog/editar/${post.id}`}>
                  Editar Post
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Excluir Post
              </Button>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
