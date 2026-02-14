import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/providers/AuthProvider';
import { fetchBlogPosts, deleteBlogPost, BlogPost } from '@/lib/api';
import { toast } from 'sonner';
import { Trash2, Pencil } from 'lucide-react';
import { useRef } from 'react';
import Navigation from "@/components/Navigation";

function AutoplayVideo({ post }: { post: BlogPost }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => { });
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const getYoutubeUrl = (url: string) => {
    const baseUrl = url.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/');
    return `${baseUrl}?autoplay=1&mute=1&rel=0&controls=1&modestbranding=1`;
  };

  const getVimeoUrl = (url: string) => {
    return `https://player.vimeo.com/video/${url.split('/').pop()}?autoplay=1&muted=1&loop=1`;
  };

  const getWistiaUrl = (url: string) => {
    return `https://fast.wistia.net/embed/iframe/${url.split('/').pop()}?autoplay=true&muted=true`;
  };

  const getDriveUrl = (url: string) => {
    return url.split('/view')[0] + '/preview';
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center mb-4 relative z-10">
      <div className={`overflow-hidden bg-black shadow-md w-full ${post.video_vertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {post.video_url?.includes('drive.google.com') ? (
          <iframe
            src={getDriveUrl(post.video_url)}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : post.video_url?.includes('wistia.com') ? (
          <iframe
            src={getWistiaUrl(post.video_url)}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : post.video_url?.includes('youtube.com') || post.video_url?.includes('youtu.be') ? (
          <iframe
            src={getYoutubeUrl(post.video_url)}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : post.video_url?.includes('vimeo.com') ? (
          <iframe
            src={getVimeoUrl(post.video_url)}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          ></iframe>
        ) : post.video_url?.includes('.mp4') || post.video_url?.includes('.webm') || post.video_url?.includes('.ogg') ? (
          <video
            ref={videoRef}
            src={post.video_url}
            controls
            muted
            loop
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            src={post.video_url + (post.video_url?.includes('?') ? '&' : '?') + 'autoplay=1&muted=1'}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { authenticated } = useAuthContext();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setDeletingId(id);
      const token = (import.meta.env.VITE_ADMIN_SECRET as string) || '';

      await deleteBlogPost(token, id);

      // Atualizar a lista de posts localmente
      setPosts(posts.filter(post => post.id !== id));
      toast.success('Post excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      toast.error('Não foi possível excluir o post. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Admin vê tudo? Por enquanto a função fetchBlogPosts tem param publishedOnly=true por padrão.
        // Se quisermos que admin veja rascunhos, teríamos que passar false e alterar API para aceitar.
        // O original filtrava published=true. Manteremos assim.

        const response = await fetchBlogPosts(1, pageSize);
        const data = response.data || [];

        setPosts(data);
        setHasMore(data.length === pageSize);
        setPage(1);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const response = await fetchBlogPosts(nextPage, pageSize);
      const rows = response.data || [];

      setPosts((prev) => [...prev, ...rows]);
      setPage(nextPage);
      if (rows.length < pageSize) setHasMore(false);
    } catch (error) {
      console.error('Erro ao carregar mais posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-heading font-bold text-foreground">Inspirações & Reflexões</h1>
            </div>
            {authenticated && (
              <Button asChild>
                <Link to="/blog/novo">
                  Novo Post
                </Link>
              </Button>
            )}
          </div>

          <div className="space-y-20">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Card
                  key={post.id}
                  className={`hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] transition-all duration-500 overflow-hidden mx-auto rounded-[2.5rem] border-none bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] ${post.video_vertical && !post.title ? 'max-w-[380px]' : 'max-w-2xl'
                    }`}
                >
                  <CardHeader className={post.video_url && !post.title && !post.content ? 'p-0' : 'px-6 pt-6 pb-2'}>
                    <div className="flex justify-between items-start">
                      <div>
                        {post.title && (
                          <div
                            className="text-2xl font-heading mb-2 text-foreground/90 prose prose-slate max-w-none prose-headings:font-heading prose-headings:m-0 prose-p:m-0"
                            dangerouslySetInnerHTML={{ __html: post.title }}
                          />
                        )}
                      </div>
                      {authenticated && (
                        <div className="flex gap-2 p-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-violet-100 hover:text-violet-600 rounded-full"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/blog/editar/${post.id}`);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-violet-100 hover:text-violet-600 rounded-full"
                            onClick={(e) => handleDelete(post.id, e)}
                            disabled={deletingId === post.id}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  {post.content && (
                    <div className="px-6 py-2 mb-2">
                      <div
                        className={`text-muted-foreground prose prose-sm max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground/90 prose-p:text-base prose-p:leading-relaxed cursor-pointer transition-all duration-300 ${!expandedIds.has(post.id) ? 'max-h-[150px] overflow-hidden relative' : 'max-h-full'
                          }`}
                        onClick={() => toggleExpand(post.id)}
                      >
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        {!expandedIds.has(post.id) && (
                          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}
                      </div>
                    </div>
                  )}

                  {post.image_url && (
                    <div className="w-full flex justify-center mb-4">
                      <div className="w-full rounded-2xl overflow-hidden px-4">
                        <img
                          src={post.image_url}
                          alt={post.title || 'Imagem do post'}
                          loading="lazy"
                          className="w-full h-auto object-cover rounded-2xl shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  {post.video_url && <AutoplayVideo post={post} />}

                  <CardContent className="px-6 pb-4 pt-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-2 font-medium">
                      {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum post encontrado.</p>
                {authenticated && (
                  <Button asChild className="mt-4">
                    <Link to="/blog/novo">
                      Criar Primeiro Post
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <Button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Carregando...' : 'Carregar mais'}
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
