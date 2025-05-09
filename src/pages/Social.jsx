
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, HeartHandshake as Handshake, Smile, MessageCircle as MessageCircleHeart, Send, Users, Gamepad2, Lightbulb, Award, MessagesSquare, Brain, UserCheck2, MessageCircle } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOtherUsersWithAffinity } from "@/contexts/mockUserData";
import { affinityQuestions } from "@/lib/affinityData";


const gamesForChat = [
  { id: "general", name: "General", icon: <MessagesSquare className="mr-2 h-5 w-5" /> },
  { id: "memory", name: "Memoria Visual", icon: <Gamepad2 className="mr-2 h-5 w-5" /> },
  { id: "attention", name: "Atención Selectiva", icon: <Gamepad2 className="mr-2 h-5 w-5" /> },
  { id: "planning", name: "Planificación", icon: <Gamepad2 className="mr-2 h-5 w-5" /> },
  { id: "simon", name: "Memoria Secuencial", icon: <Gamepad2 className="mr-2 h-5 w-5" /> },
];

const weeklyTopicsList = [
  "¿Qué consejo le darías a tu yo joven?",
  "¿Qué aroma te recuerda a tu niñez?",
  "¿Cuál fue tu juego favorito de la infancia?",
  "¿Qué aprendiste después de los 60?",
  "Comparte una tradición familiar que atesores.",
  "¿Cuál es el viaje más memorable que has hecho?"
];

const ReactionButton = ({ icon, label, count, onClick, userReacted }) => (
  <Button variant="ghost" size="sm" onClick={onClick} className={`flex items-center space-x-1 text-sm ${userReacted ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}>
    {icon}
    <span>{label} ({count})</span>
  </Button>
);


function Social() {
  const { user, updateUserAffinityProfile, updateUserSocialPosts, showAffinityModalOnLogin, clearShowAffinityModal } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  const initialPosts = useMemo(() => {
    const allPosts = [...(user?.posts || [])];
    mockOtherUsersWithAffinity.forEach(otherUser => {
      if (otherUser.posts && Array.isArray(otherUser.posts)) {
        allPosts.push(...otherUser.posts);
      }
    });
    
    const groupedByTab = gamesForChat.reduce((acc, game) => {
      acc[game.id] = [];
      return acc;
    }, {});

    allPosts.forEach(post => {
      const tabKey = post.tab || "general";
      if (groupedByTab[tabKey]) {
        groupedByTab[tabKey].push({
          ...post,
          reactions: post.reactions || { inspira: 0, abrazo: 0, alegra: 0, entiendo: 0 },
          userReactions: post.userReactions || {} 
        });
      }
    });
     for (const tab in groupedByTab) {
      groupedByTab[tab].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    return groupedByTab;
  }, [user?.posts]);

  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [currentWeeklyTopic, setCurrentWeeklyTopic] = useState("");
  const [postOfTheDay, setPostOfTheDay] = useState(null);
  const [showAffinityDialog, setShowAffinityDialog] = useState(false);
  const [affinityAnswers, setAffinityAnswers] = useState(user?.affinityProfile || {});
  const [affinityMatches, setAffinityMatches] = useState([]);


  useEffect(() => {
    const weekOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24 * 7));
    setCurrentWeeklyTopic(weeklyTopicsList[weekOfYear % weeklyTopicsList.length]);
  }, []);

  useEffect(() => {
    if (showAffinityModalOnLogin && user && !user.affinityProfile) {
      setShowAffinityDialog(true);
    }
  }, [showAffinityModalOnLogin, user]);
  
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);


  useEffect(() => {
    let topPost = null;
    let maxReactions = -1;

    Object.values(posts).flat().forEach(post => {
      const totalReactions = Object.values(post.reactions || {}).reduce((sum, count) => sum + count, 0);
      if (totalReactions > maxReactions) {
        maxReactions = totalReactions;
        topPost = post;
      }
    });
    setPostOfTheDay(topPost);
  }, [posts]);
  
  useEffect(() => {
    if (user?.affinityProfile) {
      const calculateMatches = () => {
        const matches = [];
        mockOtherUsersWithAffinity.forEach(other => {
          if (other.affinityProfile && other.id !== user.id) {
            let commonInterests = 0;
            let commonPoints = [];
            Object.keys(user.affinityProfile).forEach(key => {
              if (user.affinityProfile[key] === other.affinityProfile[key]) {
                commonInterests++;
                commonPoints.push(user.affinityProfile[key].split(" ")[0].toLowerCase());
              }
            });
            if (commonInterests > 1) { 
              matches.push({ user: other, count: commonInterests, points: commonPoints.slice(0,3) });
            }
          }
        });
        matches.sort((a,b) => b.count - a.count);
        setAffinityMatches(matches.slice(0, 3)); 
      };
      calculateMatches();
    }
  }, [user?.affinityProfile]);


  const handleWriteAboutTopic = () => {
    setNewPostContent(currentWeeklyTopic + "\n\n");
    const textarea = document.getElementById("newPostTextarea");
    if (textarea) textarea.focus();
  };
  
  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast({ variant: "destructive", title: "Publicación vacía", description: "Por favor escribe algo para compartir." });
      return;
    }
     if (!user) {
      toast({ variant: "destructive", title: "Usuario no autenticado", description: "Por favor, inicia sesión para publicar." });
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      author: user.name,
      avatarInitial: user.avatarInitial || user.name.split(" ").map(n => n[0]).join("").toUpperCase(),
      age: user.age,
      content: newPostContent,
      reactions: { inspira: 0, abrazo: 0, alegra: 0, entiendo: 0 },
      userReactions: {},
      commentsCount: 0,
      timestamp: new Date().toISOString(),
      tab: activeTab
    };

    const updatedPostsForTab = [newPost, ...(posts[activeTab] || [])];
    const newPostsState = { ...posts, [activeTab]: updatedPostsForTab };
    setPosts(newPostsState);
        
    const allUserPostsByTab = {};
    gamesForChat.forEach(game => {
        allUserPostsByTab[game.id] = newPostsState[game.id] ? newPostsState[game.id].filter(p => p.userId === user.id) : [];
    });
    updateUserSocialPosts(allUserPostsByTab);

    setNewPostContent("");
    toast({ title: "¡Publicación creada!", description: "Tu mensaje ha sido compartido." });
  };

  const handleReaction = (postId, tabId, reactionType) => {
    if (!user) return;
    setPosts(prevPosts => {
      const newPosts = { ...prevPosts };
      newPosts[tabId] = newPosts[tabId].map(post => {
        if (post.id === postId) {
          const updatedPost = { ...post, reactions: { ...post.reactions }, userReactions: { ...post.userReactions } };
          const userReactedType = updatedPost.userReactions?.[user.id];

          if (userReactedType === reactionType) { 
            updatedPost.reactions[reactionType] = Math.max(0, (updatedPost.reactions[reactionType] || 0) - 1);
            delete updatedPost.userReactions?.[user.id];
          } else {
            if (userReactedType) { 
              updatedPost.reactions[userReactedType] = Math.max(0, (updatedPost.reactions[userReactedType] || 0) - 1);
            }
            updatedPost.reactions[reactionType] = (updatedPost.reactions[reactionType] || 0) + 1;
            updatedPost.userReactions[user.id] = reactionType;
          }
          return updatedPost;
        }
        return post;
      });
      return newPosts;
    });
  };
  
  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "ahora";
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
  };

  const handleAffinityFormSubmit = () => {
    if (Object.keys(affinityAnswers).length < affinityQuestions.length) {
        toast({ variant: "destructive", title: "Formulario incompleto", description: "Por favor responde todas las preguntas." });
        return;
    }
    updateUserAffinityProfile(affinityAnswers);
    setShowAffinityDialog(false);
    clearShowAffinityModal(); 
  };
  
  const handleCloseAffinityDialog = () => {
    setShowAffinityDialog(false);
    clearShowAffinityModal();
    if (!user?.affinityProfile) {
        toast({
            title: "Perfil de afinidad pendiente",
            description: "Puedes completarlo más tarde desde tu perfil o aquí en la sección social.",
            duration: 5000,
        });
    }
  }

  const communityAffinityPercentage = useMemo(() => {
    if (!user?.affinityProfile) return 0;
    let totalPossibleMatches = 0;
    let actualMatches = 0;
    mockOtherUsersWithAffinity.forEach(other => {
      if (other.affinityProfile && other.id !== user.id) {
        Object.keys(user.affinityProfile).forEach(key => {
          totalPossibleMatches++;
          if (user.affinityProfile[key] === other.affinityProfile[key]) {
            actualMatches++;
          }
        });
      }
    });
    return totalPossibleMatches > 0 ? Math.round((actualMatches / totalPossibleMatches) * 100) : 30 + Math.floor(Math.random()*15); 
  }, [user?.affinityProfile]);


  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center">Comunidad CogniSenior</h1>

        {currentWeeklyTopic && (
          <motion.div 
            className="card bg-gradient-to-r from-primary/10 to-secondary/10 p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-semibold mb-1">Tema de esta semana:</h2>
            <p className="text-2xl font-bold text-primary mb-4">"{currentWeeklyTopic}"</p>
            <Button onClick={handleWriteAboutTopic} size="lg">
              <Send className="mr-2 h-5 w-5" /> Escribir sobre este tema
            </Button>
          </motion.div>
        )}

        {postOfTheDay && (
           <motion.div 
            className="card border-2 border-yellow-400 bg-yellow-50 p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
           >
            <div className="flex items-center mb-3">
              <Award className="h-8 w-8 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-yellow-700">Reflexión Destacada del Día</h2>
            </div>
            <p className="text-lg italic text-gray-700 mb-2">"{postOfTheDay.content.substring(0,150)}{postOfTheDay.content.length > 150 ? '...' : ''}"</p>
            <p className="text-right font-semibold text-gray-600">– {postOfTheDay.author}{postOfTheDay.age ? `, ${postOfTheDay.age} años` : ''}</p>
          </motion.div>
        )}

        {!user?.affinityProfile && (
            <motion.div 
                className="card bg-blue-50 border-blue-200 p-6 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
                <UserCheck2 className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2 text-blue-700">¡Conecta con otros!</h2>
                <p className="text-muted-foreground mb-4">Completa tu perfil de afinidad para descubrir personas con intereses similares.</p>
                <Button onClick={() => setShowAffinityDialog(true)} variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-100">Completar Perfil de Afinidad</Button>
            </motion.div>
        )}
        
        {user?.affinityProfile && affinityMatches.length > 0 && (
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-3">Nos parecemos en...</h2>
            <p className="text-muted-foreground mb-4">Te pareces con el {communityAffinityPercentage}% de los usuarios en la comunidad.</p>
            <div className="space-y-3">
              {affinityMatches.map(match => (
                <div key={match.user.id} className="p-3 bg-secondary/50 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{match.user.name} <span className="text-xs text-muted-foreground">({match.count} afinidades)</span></p>
                    <p className="text-sm text-primary">Intereses: {match.points.join(', ')}</p>
                  </div>
                  <Button variant="outline" size="sm">Ver Publicaciones</Button>
                </div>
              ))}
            </div>
             <Button variant="link" onClick={() => setShowAffinityDialog(true)} className="mt-3">Editar mi perfil de afinidad</Button>
          </motion.div>
        )}


        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
            {gamesForChat.map(gameTab => (
              <TabsTrigger key={gameTab.id} value={gameTab.id} className="text-xs sm:text-sm flex items-center">
                {gameTab.icon} {gameTab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {gamesForChat.map(gameTab => (
            <TabsContent key={gameTab.id} value={gameTab.id}>
              <div className="card mb-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold shrink-0">
                    {user?.avatarInitial || <Brain />}
                  </div>
                  <div className="flex-1">
                    <Textarea
                      id="newPostTextarea"
                      placeholder={`Comparte algo sobre ${gameTab.name}, ${user?.name || 'amigo'}...`}
                      className="text-lg min-h-[80px] mb-2"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                    <Button size="lg" onClick={handleCreatePost} className="w-full md:w-auto">
                      <Send className="mr-2 h-5 w-5" /> Publicar en {gameTab.name}
                    </Button>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4">Publicaciones en {gameTab.name}</h2>
              {(posts[gameTab.id] && posts[gameTab.id].length > 0) ? (
                <div className="space-y-6">
                  {posts[gameTab.id].map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-semibold shrink-0">
                          {post.avatarInitial}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">{post.author} {post.age ? <span className="text-sm text-muted-foreground">({post.age} años)</span> : ''}</h3>
                              <p className="text-xs text-muted-foreground">{timeSince(post.timestamp)}</p>
                            </div>
                            <p className="text-lg whitespace-pre-wrap mt-1">{post.content}</p>
                          </div>
                          <div className="flex flex-wrap gap-x-1 gap-y-1 pt-2 border-t border-border">
                            <ReactionButton icon={<Heart className="h-5 w-5" />} label="Me inspira" count={post.reactions.inspira || 0} onClick={() => handleReaction(post.id, gameTab.id, 'inspira')} userReacted={post.userReactions?.[user?.id] === 'inspira'} />
                            <ReactionButton icon={<Handshake className="h-5 w-5" />} label="Te abrazo" count={post.reactions.abrazo || 0} onClick={() => handleReaction(post.id, gameTab.id, 'abrazo')} userReacted={post.userReactions?.[user?.id] === 'abrazo'} />
                            <ReactionButton icon={<Smile className="h-5 w-5" />} label="Me alegra" count={post.reactions.alegra || 0} onClick={() => handleReaction(post.id, gameTab.id, 'alegra')} userReacted={post.userReactions?.[user?.id] === 'alegra'} />
                            <ReactionButton icon={<MessageCircleHeart className="h-5 w-5" />} label="Te entiendo" count={post.reactions.entiendo || 0} onClick={() => handleReaction(post.id, gameTab.id, 'entiendo')} userReacted={post.userReactions?.[user?.id] === 'entiendo'} />
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-sm"><MessageCircle className="mr-1 h-5 w-5" /> Comentar ({post.commentsCount || 0})</Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No hay publicaciones en {gameTab.name} todavía. ¡Sé el primero!</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      <Dialog open={showAffinityDialog} onOpenChange={setShowAffinityDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Completa tu Perfil de Afinidad</DialogTitle>
            <DialogDescription>
              Ayúdanos a conocerte mejor para conectar con personas afines. Tus respuestas son privadas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {affinityQuestions.map(q => (
              <div key={q.id} className="space-y-3">
                <Label htmlFor={q.id} className="text-lg font-semibold">{q.label}</Label>
                <RadioGroup 
                    id={q.id} 
                    value={affinityAnswers[q.id] || ""}
                    onValueChange={(value) => setAffinityAnswers(prev => ({...prev, [q.id]: value}))}
                    className="space-y-2"
                >
                  {q.options.map(opt => (
                    <div key={opt} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-accent border border-transparent hover:border-primary/30 cursor-pointer transition-colors duration-150 bg-background hover:shadow-md">
                      <RadioGroupItem value={opt} id={`${q.id}-${opt}`} className="h-6 w-6 text-primary focus:ring-primary focus:ring-offset-2"/>
                      <Label htmlFor={`${q.id}-${opt}`} className="font-normal text-xl cursor-pointer flex-1 text-foreground">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseAffinityDialog}>Quizás más tarde</Button>
            <Button type="button" onClick={handleAffinityFormSubmit}>Guardar Perfil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default Social;
