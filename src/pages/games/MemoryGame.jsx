
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

function MemoryGame() {
  const { toast } = useToast();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);

  const cardImages = [
    { id: 1, content: "🌞" },
    { id: 2, content: "🌺" },
    { id: 3, content: "🎨" },
    { id: 4, content: "🎭" },
    { id: 5, content: "🎪" },
    { id: 6, content: "🎯" },
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }));
    setCards(duplicatedCards);
    setFlipped([]);
    setMatched([]);
    setScore(0);
  };

  const handleCardClick = (uniqueId) => {
    if (disabled || flipped.length === 2 || flipped.includes(uniqueId) || matched.includes(uniqueId)) return;

    setFlipped([...flipped, uniqueId]);

    if (flipped.length === 1) {
      setDisabled(true);
      const firstCard = cards.find(card => card.uniqueId === flipped[0]);
      const secondCard = cards.find(card => card.uniqueId === uniqueId);

      if (firstCard.id === secondCard.id) {
        setMatched([...matched, flipped[0], uniqueId]);
        setScore(score + 10);
        setFlipped([]);
        setDisabled(false);
        
        if (matched.length === cards.length - 2) {
          toast({
            title: "¡Felicitaciones!",
            description: "Has completado el juego de memoria.",
          });
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Memoria Visual</h1>
            <p className="mt-2 text-xl text-muted-foreground">
              Encuentra los pares coincidentes
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">Puntuación: {score}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map(card => (
            <motion.div
              key={card.uniqueId}
              className={`card aspect-square flex items-center justify-center text-4xl cursor-pointer
                ${(flipped.includes(card.uniqueId) || matched.includes(card.uniqueId)) ? 'bg-primary/10' : 'bg-primary'}
              `}
              onClick={() => handleCardClick(card.uniqueId)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {(flipped.includes(card.uniqueId) || matched.includes(card.uniqueId)) ? card.content : '?'}
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={initializeGame}>
            Reiniciar Juego
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default MemoryGame;
