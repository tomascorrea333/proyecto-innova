
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

function AttentionGame() {
  const { toast } = useToast();
  const { updateUserProgress } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [targetNumber, setTargetNumber] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [foundTargetsThisRound, setFoundTargetsThisRound] = useState(0);
  const [totalTargetsThisRound, setTotalTargetsThisRound] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else if (timeLeft === 0 && gameActive) {
      endGame(false); 
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
    
    let currentTargetCount = newNumbers.filter(n => n === newTarget).length;
    const minTargets = 2;
    const maxTargets = 5; 

    while(currentTargetCount < minTargets || currentTargetCount > maxTargets) {
        const randomIndex = Math.floor(Math.random() * 16);
        if (currentTargetCount < minTargets && newNumbers[randomIndex] !== newTarget) {
            newNumbers[randomIndex] = newTarget;
            currentTargetCount++;
        } else if (currentTargetCount > maxTargets && newNumbers[randomIndex] === newTarget) {
            let replacementNumber;
            do {
                replacementNumber = Math.floor(Math.random() * 9) + 1;
            } while (replacementNumber === newTarget);
            newNumbers[randomIndex] = replacementNumber;
            currentTargetCount--;
        } else if (currentTargetCount < minTargets) { 
             newNumbers[randomIndex] = newTarget;
             currentTargetCount = newNumbers.filter(n => n === newTarget).length;
        } else { break; }
    }
    
    setTargetNumber(newTarget);
    setNumbers(newNumbers.map((num, idx) => ({ value: num, id: idx, found: false })));
    setFoundTargetsThisRound(0);
    setTotalTargetsThisRound(newNumbers.filter(n => n === newTarget).length);
  };

  const handleNumberClick = (clickedNumberObject) => {
    if (!gameActive || clickedNumberObject.found) return;

    if (clickedNumberObject.value === targetNumber) {
      setScore(prev => prev + 10);
      setNumbers(prevNumbers => 
        prevNumbers.map(numObj => 
          numObj.id === clickedNumberObject.id ? { ...numObj, found: true } : numObj
        )
      );
      const newFoundCount = foundTargetsThisRound + 1;
      setFoundTargetsThisRound(newFoundCount);
      
      if (newFoundCount === totalTargetsThisRound) {
        toast({
          title: "¡Ronda completada!",
          description: `+${totalTargetsThisRound * 10} puntos. Siguiente ronda.`,
        });
        generateNewRound();
      } else {
         toast({
          title: "¡Correcto!",
          description: "+10 puntos. Sigue buscando.",
        });
      }
    } else {
      setScore(prev => Math.max(0, prev - 5));
      toast({
        variant: "destructive",
        title: "Incorrecto",
        description: "-5 puntos",
      });
    }
  };

  const endGame = (manualStop = false) => {
    clearInterval(timerRef.current);
    setGameActive(false);
    const gameWon = score > 0; 
    toast({
      title: manualStop ? "Juego Pausado" : "¡Juego terminado!",
      description: `Puntuación final: ${score}.`,
    });
    updateUserProgress('attention', score);

    if (location.state?.fromChallenge && location.state.challengeType === 'attention_numbers' && !manualStop) {
        sessionStorage.setItem('challengeResult', JSON.stringify({ success: gameWon, score: score }));
        navigate('/reto-del-dia');
    }
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">Atención Selectiva</h1>
            {gameActive && targetNumber !== null && (
              <p className="mt-2 text-xl text-muted-foreground">
                Encuentra los números pedidos: <span className="font-bold text-primary">{targetNumber}</span>
              </p>
            )}
             {!gameActive && targetNumber === null && (
              <p className="mt-2 text-xl text-muted-foreground">
                Prepárate para encontrar los números.
              </p>
            )}
          </div>
          <div className="text-center sm:text-right">
            <p className="text-lg font-medium">Tiempo: {timeLeft}s</p>
            <p className="text-lg font-medium">Puntuación: {score}</p>
            {gameActive && <p className="text-sm text-muted-foreground">Encontrados: {foundTargetsThisRound}/{totalTargetsThisRound}</p>}
          </div>
        </div>

        {!gameActive ? (
          <div className="flex flex-col items-center space-y-6 text-center">
            <p className="text-xl">
              Haz clic en todos los números objetivo que aparezcan en la cuadrícula antes de que se acabe el tiempo.
            </p>
            <Button size="lg" className="px-8 py-6 text-lg" onClick={startGame}>
              Comenzar Juego
            </Button>
             {score > 0 && timeLeft === 0 && <p className="text-lg">Última Puntuación: {score}</p>}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {numbers.map((numberObj) => (
                <motion.button
                  key={numberObj.id}
                  disabled={numberObj.found}
                  className={`card aspect-square flex items-center justify-center text-3xl sm:text-4xl font-bold cursor-pointer 
                    focus:ring-2 focus:ring-primary focus:outline-none
                    ${numberObj.found ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed' : 'bg-card hover:bg-primary/10'}`}
                  onClick={() => handleNumberClick(numberObj)}
                  whileHover={{ scale: numberObj.found ? 1 : 1.05 }}
                  whileTap={{ scale: numberObj.found ? 1 : 0.95 }}
                >
                  {numberObj.found ? '✔️' : numberObj.value}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-center mt-6">
                <Button variant="outline" size="lg" onClick={() => endGame(true)}>Terminar Juego</Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AttentionGame;
