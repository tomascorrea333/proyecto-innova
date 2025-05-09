
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, MessageCircle, Heart, Smile, Users, Gamepad2, MessagesSquare, Brain } from 'lucide-react';
import ReactionButton from "@/components/social/ReactionButton"; 
import { timeSince } from "@/lib/utils";

const getIconForTab = (tabId) => {
  switch (tabId) {
    case "general": return <MessagesSquare className="mr-2 h-5 w-5" />;
    case "memory":
    case "attention":
    case "planning":
    case "simon":
      return <Gamepad2 className="mr-2 h-5 w-5" />;
    default: return <Brain className="mr-2 h-5 w-5" />;
  }
};


const PostTabs = ({ tabs, activeTab, onTabChange, posts, user, newPostContent, onNewPostContentChange, onCreatePost, onReaction }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
        {tabs.map(gameTab => (
          <TabsTrigger key={gameTab.id} value={gameTab.id} className="text-xs sm:text-sm flex items-center">
            {getIconForTab(gameTab.id)} {gameTab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(gameTab => (
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
                  onChange={(e) => onNewPostContentChange(e.target.value)}
                />
                <Button size="lg" onClick={() => onCreatePost(newPostContent, gameTab.id)} className="w-full md:w-auto">
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
                  key={post.id || index}
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
                        <ReactionButton icon={<Heart className="h-5 w-5" />} label="Me inspira" count={post.reactions?.inspira || 0} onClick={() => onReaction(post.id, gameTab.id, 'inspira')} userReacted={post.userReactions?.[user?.id] === 'inspira'} />
                        <ReactionButton icon={<Users className="h-5 w-5" />} label="Te abrazo" count={post.reactions?.abrazo || 0} onClick={() => onReaction(post.id, gameTab.id, 'abrazo')} userReacted={post.userReactions?.[user?.id] === 'abrazo'} />
                        <ReactionButton icon={<Smile className="h-5 w-5" />} label="Me alegra" count={post.reactions?.alegra || 0} onClick={() => onReaction(post.id, gameTab.id, 'alegra')} userReacted={post.userReactions?.[user?.id] === 'alegra'} />
                        <ReactionButton icon={<MessageCircle className="h-5 w-5" />} label="Te entiendo" count={post.reactions?.entiendo || 0} onClick={() => onReaction(post.id, gameTab.id, 'entiendo')} userReacted={post.userReactions?.[user?.id] === 'entiendo'} />
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
  );
};

export default PostTabs;
