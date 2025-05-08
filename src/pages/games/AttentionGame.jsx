
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function AttentionGame() {
  const { toast } = useToast();
  const [targetNumber, setTargetNumber] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    generateNewRound();
  };

  const generateNewRound = () => {
    const newTarget = Math.floor(Math.random() * 9) + 1;
    const newNumbers = Array(16).fill(null).map(() => Math.floor(Math.random() * 9) + 1);
    // Asegurarse de que el número objetivo aparezca al menos una vez
    newNumbers[Math.floor(Math.random() * 16)] = newTarget;
    
    setTargetNumber(newTarget);
    setNumbers(newNumbers);
  };

  const handleNumberClick = (number) => {
    if (!gameActive) return;

    if (number === targetNumber) {
      setScore(prev => prev + 10);
      toast({
        title: "¡Correcto!",
        description: "+10 puntos",
      });
      generateNewRound();
    } else {
      setScore(prev => Math.max(0, prev - 5));
      toast({
        variant: "destructive",
        title: "Incorrecto",
        description: "-5 puntos",
      });
    }
  };

  const endGame = () => {
    setGameActive(false);
    toast({
      title: "¡Juego terminado!",
      description: `Puntuación final: ${score}`,
    });
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
            <h1 className="text-3xl font-bold">Atención Selectiva</h1>
            <p className="mt-2 text-xl text-muted-foreground">
              Encuentra todos los números {targetNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">Tiempo: {timeLeft}s</p>
            <p className="text-lg font-medium">Puntuación: {score}</p>
          </div>
        </div>

        {!gameActive ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-xl text-center">
              Encuentra todos los números objetivo lo más rápido posible.
            </p>
            <Button size="lg" onClick={startGame}>
              Comenzar Juego
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {numbers.map((number, index) => (
              <motion.div
                key={index}
                className="card aspect-square flex items-center justify-center text-4xl cursor-pointer"
                onClick={() => handleNumberClick(number)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {number}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AttentionGame;
