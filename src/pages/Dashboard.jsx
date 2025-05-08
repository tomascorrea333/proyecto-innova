
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Puzzle,
  Target,
  Zap,
  TrendingUp,
  Users,
  CalendarDays,
  Trophy,
  Star,
  Sparkles,
  CheckCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const games = [
  {
    title: "Memoria Visual",
    description: "Encuentra los pares de cartas iguales.",
    icon: <Puzzle className="h-8 w-8 text-primary" />,
    path: "/games/memory",
    category: "memory",
  },
  {
    title: "Atención Selectiva",
    description: "Encuentra el número indicado rápidamente.",
    icon: <Target className="h-8 w-8 text-primary" />,
    path: "/games/attention",
    category: "attention",
  },
  {
    title: "Planificación Estratégica",
    description: "Resuelve el puzzle de las Torres de Hanoi.",
    icon: <Brain className="h-8 w-8 text-primary" />,
    path: "/games/planning",
    category: "planning",
  },
  {
    title: "Memoria Secuencial",
    description: "Repite la secuencia de colores y sonidos.",
    icon: <Zap className="h-8 w-8 text-primary" />,
    path: "/games/simon",
    category: "simon",
  },
];

const weeklyProgressData = [
  { name: "Lun", score: 65 },
  { name: "Mar", score: 70 },
  { name: "Mié", score: 80 },
  { name: "Jue", score: 75 },
  { name: "Vie", score: 90 },
  { name: "Sáb", score: 85 },
  { name: "Dom", score: 95 },
];

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlayClick = (path) => {
    navigate(path);
  };

  const hasRecommendations = user?.dailyRoutine?.recommended && user.dailyRoutine.recommended.length > 0;
  const recommendedGames = hasRecommendations ? user.dailyRoutine.recommended : [];

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">
            ¡Hola, {user?.name || "Usuario"}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Listo para ejercitar tu mente hoy?
          </p>
        </div>

        {hasRecommendations && (
          <div className="card bg-gradient-to-r from-primary/10 to-primary/5">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-primary" /> Tu Rutina Diaria Sugerida
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedGames.map((rec, index) => {
                const gameDetails = games.find(g => g.category === rec.type) || { title: rec.title, path: rec.type === "daily" ? "/reto-del-dia" : "#", icon: <Brain className="h-8 w-8 text-primary" /> };
                let IconToRender;
                if (rec.type === "daily") {
                  IconToRender = <Zap className="h-8 w-8 text-primary" />;
                } else {
                  const foundGame = games.find(g => g.category === rec.type);
                  IconToRender = foundGame ? foundGame.icon : <Brain className="h-8 w-8 text-primary" />;
                }
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg flex items-center justify-between ${rec.completed ? 'bg-green-100 border-green-300' : 'bg-background border'}`}
                  >
                    <div className="flex items-center">
                       <div className="mr-3 p-2 bg-primary/10 rounded-full">{IconToRender}</div>
                      <div>
                        <h3 className="font-semibold">{gameDetails.title}</h3>
                        <p className="text-sm text-muted-foreground">{rec.completed ? "Completado" : "Pendiente"}</p>
                      </div>
                    </div>
                    {!rec.completed ? (
                      <Button size="sm" onClick={() => handlePlayClick(gameDetails.path)}>Jugar</Button>
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            className="card lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-primary" /> Progreso Semanal
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <CalendarDays className="h-6 w-6 mr-2 text-primary" /> Reto del Día
            </h2>
            <div className="text-center">
              <Zap className="h-16 w-16 text-yellow-400 mx-auto mb-2" />
              <p className="text-lg text-muted-foreground mb-4">
                Un nuevo desafío cognitivo te espera cada día.
              </p>
              <Button size="lg" onClick={() => handlePlayClick("/reto-del-dia")}>
                Ir al Desafío
              </Button>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          className="card bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <Star className="h-8 w-8 mr-3 text-yellow-300" /> CogniSenior Premium
              </h2>
              <p className="text-lg opacity-90 mb-4">
                Desbloquea juegos exclusivos, análisis detallados y más funciones para potenciar tu mente.
              </p>
            </div>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3 font-semibold"
              onClick={() => navigate("/premium")}
            >
              Descubre Premium
            </Button>
          </div>
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Nuestros Juegos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.title}
                className="card hover:shadow-primary/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    {game.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {game.description}
                  </p>
                  <Button onClick={() => handlePlayClick(game.path)}>
                    Jugar Ahora
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <motion.div
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-primary" /> Comunidad
            </h2>
            <p className="text-muted-foreground mb-4">
              Conecta con otros usuarios, comparte tus logros y participa en discusiones.
            </p>
            <Button onClick={() => navigate("/social")}>Ir a la Comunidad</Button>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-primary" /> Tus Logros
            </h2>
            <p className="text-muted-foreground mb-4">
              Revisa las medallas que has ganado y sigue progresando.
            </p>
            <Button onClick={() => navigate("/profile")}>Ver Mis Logros</Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
