
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Target, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Games() {
  const navigate = useNavigate();
  const [games] = useState([
    {
      id: 1,
      title: "Memoria Visual",
      description: "Ejercita tu memoria recordando patrones y secuencias",
      icon: Brain,
      difficulty: "Fácil",
      duration: "5 min",
      route: "/games/memory"
    },
    {
      id: 2,
      title: "Atención Selectiva",
      description: "Mejora tu concentración encontrando objetos específicos",
      icon: Target,
      difficulty: "Medio",
      duration: "7 min",
      route: "/games/attention"
    },
    {
      id: 3,
      title: "Planificación",
      description: "Desarrolla estrategias para resolver rompecabezas",
      icon: Clock,
      difficulty: "Difícil",
      duration: "10 min",
      route: "/games/planning"
    },
    {
      id: 4,
      title: "Memoria Secuencial",
      description: "Repite secuencias de colores y sonidos cada vez más largas",
      icon: Zap,
      difficulty: "Medio",
      duration: "5 min",
      route: "/games/simon"
    }
  ]);

  const handlePlayClick = (route) => {
    navigate(route);
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Juegos Cognitivos</h1>
          <p className="mt-2 text-xl text-muted-foreground">
            Selecciona un juego para comenzar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card group cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <game.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{game.title}</h3>
                    <p className="text-muted-foreground">{game.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <span>Dificultad: {game.difficulty}</span>
                      <span>Duración: {game.duration}</span>
                    </div>
                    <Button onClick={() => handlePlayClick(game.route)}>
                      Jugar
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">¿Necesitas ayuda?</h2>
              <p className="text-muted-foreground">
                Mira el tutorial de cómo jugar
              </p>
            </div>
            <Button variant="outline" size="lg">
              Ver Tutorial
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Games;
