
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

function MemoryGame() {
  const { toast } = useToast();
  const { updateUserProgress } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const timerIntervalRef = useRef(null);

  const cardImages = [
    { id: 1, content: "🌞" }, { id: 2, content: "🌺" }, { id: 3, content: "🎨" },
    { id: 4, content: "🎭" }, { id: 5, content: "🎪" }, { id: 6, content: "🎯" },
    { id: 7, content: "🎈" }, { id: 8, content: "🎁" }
  ];

  const initializeGame = () => {
    const duplicatedCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }));
    setCards(duplicatedCards);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setElapsedTime(0);
    setGameCompleted(false);
    
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    const newStartTime = Date.now();
    setStartTime(newStartTime);

    timerIntervalRef.current = setInterval(() => {
      setElapsedTime(prevTime => {
        if (document.hidden || gameCompleted) { 
          return prevTime; 
        }
        return Math.floor((Date.now() - newStartTime) / 1000);
      });
    }, 1000);
  };

  useEffect(() => {
    initializeGame();
    
    const handleVisibilityChange = () => {
      if (!startTime || gameCompleted) return;

      if (document.hidden) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      } else {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = setInterval(() => {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);


  useEffect(() => {
    if (gameCompleted && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, [gameCompleted]);


  const handleCardClick = (uniqueId) => {
    if (disabled || flipped.length === 2 || flipped.includes(uniqueId) || matched.includes(uniqueId) || gameCompleted) return;

    setFlipped([...flipped, uniqueId]);

    if (flipped.length === 1) {
      setDisabled(true);
      const firstCard = cards.find(card => card.uniqueId === flipped[0]);
      const secondCard = cards.find(card => card.uniqueId === uniqueId);

      if (firstCard.id === secondCard.id) {
        const newMatched = [...matched, flipped[0], uniqueId];
        setMatched(newMatched);
        setScore(score + 10);
        setFlipped([]);
        setDisabled(false);
        
        if (newMatched.length === cards.length) {
          setGameCompleted(true);
          
          const finalTime = Math.floor((Date.now() - startTime) / 1000);
          setElapsedTime(finalTime); 
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          toast({
            title: "¡Felicitaciones!",
            description: `Has completado el juego en ${formatTime(finalTime)}. Puntuación: ${score + 10}.`,
          });
          updateUserProgress('memory', score + 10);
          
          if (location.state?.fromChallenge && location.state.challengeType === 'memory_pairs') {
            sessionStorage.setItem('challengeResult', JSON.stringify({ success: true, score: score + 10, time: finalTime }));
            navigate('/reto-del-dia');
          }
        }
      } else {
        setScore(prev => Math.max(0, prev - 2)); 
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <p className="text-lg font-medium">Tiempo: {formatTime(elapsedTime)}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map(card => (
            <motion.div
              key={card.uniqueId}
              className={`card aspect-square flex items-center justify-center cursor-pointer transition-colors duration-300
                ${(flipped.includes(card.uniqueId) || matched.includes(card.uniqueId)) ? 'bg-primary/20 text-primary-foreground text-4xl md:text-5xl' : 'bg-primary text-primary-foreground'}
                ${matched.includes(card.uniqueId) ? 'border-2 border-green-500 opacity-75' : ''}
              `}
              onClick={() => handleCardClick(card.uniqueId)}
              whileHover={{ scale: gameCompleted ? 1 : 1.05 }}
              whileTap={{ scale: gameCompleted ? 1 : 0.95 }}
            >
              {(flipped.includes(card.uniqueId) || matched.includes(card.uniqueId)) ? card.content : <span className="text-3xl text-gray-700">?</span>}
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
