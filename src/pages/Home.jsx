
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Activity, Users, Trophy } from "lucide-react";

function Home() {
  return (
    <div className="relative">
      <div className="section">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <motion.div
              className="flex flex-col justify-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl">
                  Mantén tu mente activa y saludable
                </h1>
                <p className="text-xl text-muted-foreground">
                  Ejercita tu cerebro con juegos divertidos, conecta con otros y
                  sigue tu progreso cognitivo.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Comenzar ahora
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Crear cuenta
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="card">
                <Brain className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">
                  Ejercicios Cognitivos
                </h3>
                <p className="text-muted-foreground">
                  Juegos diseñados para ejercitar tu memoria y atención.
                </p>
              </div>
              <div className="card">
                <Activity className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">
                  Seguimiento Personal
                </h3>
                <p className="text-muted-foreground">
                  Visualiza tu progreso y mejora continua.
                </p>
              </div>
              <div className="card">
                <Users className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">
                  Comunidad Activa
                </h3>
                <p className="text-muted-foreground">
                  Conecta y comparte con otros usuarios.
                </p>
              </div>
              <div className="card">
                <Trophy className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">
                  Sistema de Logros
                </h3>
                <p className="text-muted-foreground">
                  Gana puntos y sube de nivel mientras te diviertes.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
