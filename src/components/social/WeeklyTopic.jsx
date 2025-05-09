
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lightbulb, Send } from 'lucide-react';

const WeeklyTopic = ({ topic, onWriteAboutTopic }) => {
  if (!topic) return null;

  return (
    <motion.div 
      className="card bg-gradient-to-r from-primary/10 to-secondary/10 p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
      <h2 className="text-xl font-semibold mb-1">Tema de esta semana:</h2>
      <p className="text-2xl font-bold text-primary mb-4">"{topic}"</p>
      <Button onClick={onWriteAboutTopic} size="lg">
        <Send className="mr-2 h-5 w-5" /> Escribir sobre este tema
      </Button>
    </motion.div>
  );
};

export default WeeklyTopic;
