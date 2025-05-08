
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function DailyChallenge() {
  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Reto del Día</h1>
            <p className="mt-2 text-xl text-muted-foreground">
              Completa el desafío diario y gana puntos extra
            </p>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-center space-x-4">
            <Brain className="h-12 w-12 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Ejercicio de Memoria</h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Memoriza y repite la siguiente secuencia de números
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-4xl font-bold tracking-wider">4 - 7 - 2 - 9 - 5</p>
          </div>

          <div className="mt-8 flex justify-center">
            <Button size="lg" className="px-8">
              Comenzar Desafío
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <h3 className="text-xl font-semibold">Recompensa del Día</h3>
            <p className="mt-2 text-muted-foreground">
              Completa el reto y gana 50 puntos extra
            </p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold">Tu Racha Actual</h3>
            <p className="mt-2 text-muted-foreground">
              Has completado 3 días seguidos. ¡Sigue así!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DailyChallenge;
