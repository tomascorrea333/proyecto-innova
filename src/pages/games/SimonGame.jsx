
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function SimonGame() {
  const { toast } = useToast();
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [activeColor, setActiveColor] = useState(null);

  const colors = [
    { id: 0, color: "bg-red-500", activeColor: "bg-white", sound: 261.63 }, // Do
    { id: 1, color: "bg-blue-500", activeColor: "bg-white", sound: 293.66 }, // Re
    { id: 2, color: "bg-green-500", activeColor: "bg-white", sound: 329.63 }, // Mi
    { id: 3, color: "bg-yellow-500", activeColor: "bg-white", sound: 349.23 }, // Fa
  ];

  const playSound = (frequency) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const generateNewSequence = () => {
    return [Math.floor(Math.random() * 4)];
  };

  const startGame = () => {
    const newSequence = generateNewSequence();
    setSequence(newSequence);
    setPlayerSequence([]);
    setIsPlaying(true);
    setScore(0);
    showSequence(newSequence);
  };

  const showSequence = async (currentSequence) => {
    setIsShowingSequence(true);
    setActiveColor(null);
    
    // Espera inicial antes de mostrar la secuencia
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < currentSequence.length; i++) {
      // Espera entre cada color
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Reproduce el sonido y activa el color
      const colorIndex = currentSequence[i];
      playSound(colors[colorIndex].sound);
      setActiveColor(colorIndex);
      
      // Mantiene el color activo
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Desactiva el color
      setActiveColor(null);
      
      // Pequeña pausa entre colores
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Espera final antes de permitir la entrada del jugador
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsShowingSequence(false);
  };

  const handleButtonClick = (colorIndex) => {
    if (isShowingSequence || !isPlaying) return;

    playSound(colors[colorIndex].sound);
    setActiveColor(colorIndex);
    setTimeout(() => setActiveColor(null), 200);

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;
    if (sequence[currentIndex] !== colorIndex) {
      toast({
        variant: "destructive",
        title: "¡Game Over!",
        description: `Puntuación final: ${score}`,
      });
      setIsPlaying(false);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setPlayerSequence([]);
      setTimeout(() => showSequence(newSequence), 1000);
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
            <h1 className="text-3xl font-bold">Memoria Secuencial</h1>
            <p className="mt-2 text-xl text-muted-foreground">
              Repite la secuencia de colores
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">Nivel: {score + 1}</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-8">
          <div className="grid grid-cols-2 gap-4">
            {colors.map((color, index) => (
              <motion.button
                key={color.id}
                id={`button-${index}`}
                className={`h-32 w-32 rounded-lg ${activeColor === index ? color.activeColor : color.color} shadow-lg transition-all
                  hover:brightness-110 active:brightness-90 disabled:opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleButtonClick(index)}
                disabled={isShowingSequence || !isPlaying}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={startGame}
              disabled={isShowingSequence}
              className="px-8"
            >
              {isPlaying ? "Reiniciar" : "Comenzar"}
            </Button>
          </div>

          {!isPlaying && score > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-2xl font-semibold">¡Juego terminado!</p>
              <p className="text-xl text-muted-foreground">
                Puntuación final: {score}
              </p>
            </motion.div>
          )}

          {isShowingSequence && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xl font-semibold text-primary"
            >
              ¡Observa la secuencia!
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default SimonGame;
