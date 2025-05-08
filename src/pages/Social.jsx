
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Heart, MessageCircle, Share2, Brain, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

function Social() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "María García",
      avatarInitial: "MG",
      content: "¿Cuál fue su juego favorito de la infancia? El mío era la rayuela 😊",
      reactions: 5,
      comments: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() 
    },
    {
      id: 2,
      author: "Carlos Rodríguez",
      avatarInitial: "CR",
      content: "¡Acabo de completar mi primer desafío de memoria! Me siento muy orgulloso 🎉",
      reactions: 8,
      comments: 4,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  ]);
  const [newPostContent, setNewPostContent] = useState("");

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast({
        variant: "destructive",
        title: "Publicación vacía",
        description: "Por favor escribe algo para compartir.",
      });
      return;
    }

    const newPost = {
      id: Date.now(),
      author: user?.name || "Usuario Anónimo",
      avatarInitial: user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "UA",
      content: newPostContent,
      reactions: 0,
      comments: 0,
      timestamp: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    toast({
      title: "¡Publicación creada!",
      description: "Tu mensaje ha sido compartido con la comunidad.",
    });
  };
  
  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "a";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min";
    return Math.floor(seconds) + "s";
  }


  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Comunidad CogniSenior</h1>
        </div>

        <div className="card">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold">
              {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : <Brain />}
            </div>
            <div className="flex-1">
              <Textarea
                placeholder={`¿Qué quieres compartir hoy, ${user?.name || 'amigo'}?`}
                className="text-lg min-h-[80px] mb-2"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <Button size="lg" onClick={handleCreatePost} className="w-full md:w-auto">
                <Send className="mr-2 h-5 w-5" />
                Publicar
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-semibold">
                  {post.avatarInitial}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{post.author}</h3>
                       <p className="text-xs text-muted-foreground">{timeSince(post.timestamp)}</p>
                    </div>
                    <p className="text-lg whitespace-pre-wrap">{post.content}</p>
                  </div>
                  <div className="flex space-x-2 pt-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Heart className="mr-2 h-5 w-5" />
                      Me inspira ({post.reactions})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Comentar ({post.comments})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Share2 className="mr-2 h-5 w-5" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Social;
