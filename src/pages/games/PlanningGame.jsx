
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function PlanningGame() {
  const { toast } = useToast();
  const [towers, setTowers] = useState([[], [], []]);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (startTime && !gameWon) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, gameWon]);

  const initializeGame = () => {
    const initialTowers = [
      [4, 3, 2, 1], // Torre inicial con discos ordenados
      [], // Torre intermedia vacía
      [] // Torre final vacía
    ];
    setTowers(initialTowers);
    setMoves(0);
    setGameWon(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const handleTowerClick = (towerIndex) => {
    if (gameWon) return;

    if (selectedDisk === null) {
      // Si no hay disco seleccionado, intentamos seleccionar uno
      const tower = towers[towerIndex];
      if (tower.length > 0) {
        setSelectedDisk(towerIndex);
      }
    } else {
      // Si ya hay un disco seleccionado, intentamos moverlo
      const fromTower = towers[selectedDisk];
      const toTower = towers[towerIndex];
      const diskToMove = fromTower[fromTower.length - 1];
      const topDiskAtDestination = toTower[toTower.length - 1];

      if (toTower.length === 0 || diskToMove < topDiskAtDestination) {
        // Movimiento válido
        const newTowers = towers.map((t, i) => {
          if (i === selectedDisk) {
            return t.slice(0, -1);
          }
          if (i === towerIndex) {
            return [...t, diskToMove];
          }
          return t;
        });

        setTowers(newTowers);
        setMoves(moves + 1);
        
        // Verificar si el juego está ganado
        if (towerIndex === 2 && newTowers[2].length === 4) {
          setGameWon(true);
          toast({
            title: "¡Felicitaciones!",
            description: `Has completado el juego en ${moves + 1} movimientos!`,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Movimiento inválido",
          description: "No puedes colocar un disco más grande sobre uno más pequeño",
        });
      }
      setSelectedDisk(null);
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
            <h1 className="text-3xl font-bold">Torres de Hanoi</h1>
            <p className="mt-2 text-xl text-muted-foreground">
              Mueve todos los discos a la torre derecha
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">Movimientos: {moves}</p>
            <p className="text-lg font-medium">Tiempo: {formatTime(elapsedTime)}</p>
          </div>
        </div>

        <div className="flex justify-center space-x-8 h-64">
          {towers.map((tower, towerIndex) => (
            <motion.div
              key={towerIndex}
              className={`relative flex flex-col justify-end items-center w-1/4 border-b-4 border-primary
                ${selectedDisk === towerIndex ? 'bg-primary/10' : ''}
              `}
              onClick={() => handleTowerClick(towerIndex)}
            >
              {tower.map((diskSize, diskIndex) => (
                <motion.div
                  key={diskIndex}
                  className="h-8 rounded-lg bg-primary"
                  style={{
                    width: `${diskSize * 25}%`,
                    marginBottom: '4px'
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              ))}
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

export default PlanningGame;
