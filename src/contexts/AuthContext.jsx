
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulación de login con datos más completos
      const mockUser = {
        id: "1",
        email,
        name: "Elena García",
        points: 1250,
        level: 12,
        cognitiveProfile: {
          memoria: 85,
          atencion: 70,
          logica: 90,
          velocidad: 75,
          planificacion: 80
        },
        achievements: [
          {
            id: 1,
            title: "Primera Victoria",
            description: "Completaste tu primer juego",
            icon: "Trophy",
            unlocked: true,
            date: "2025-04-15"
          },
          {
            id: 2,
            title: "Mente Ágil",
            description: "Alcanzaste 100 puntos",
            icon: "Brain",
            unlocked: true,
            date: "2025-04-16"
          },
          {
            id: 3,
            title: "Maestro de la Memoria",
            description: "Superaste 5 niveles en Memoria Visual",
            icon: "Star",
            unlocked: true,
            date: "2025-04-20"
          },
           {
            id: 4,
            title: "Racha de 5 días",
            description: "Completaste actividades por 5 días seguidos",
            icon: "Target",
            unlocked: true,
            date: "2025-05-05"
          }
        ],
        activityHistory: [
          { date: "2025-04-20", completed: true },
          { date: "2025-04-21", completed: true },
          { date: "2025-04-22", completed: true },
          { date: "2025-04-23", completed: false },
          { date: "2025-04-24", completed: true },
          { date: "2025-04-25", completed: true },
          { date: "2025-04-26", completed: true },
          { date: "2025-04-27", completed: true },
          { date: "2025-04-28", completed: true },
          { date: "2025-04-29", completed: false },
          { date: "2025-04-30", completed: true },
          { date: "2025-05-01", completed: true },
          { date: "2025-05-02", completed: true },
          { date: "2025-05-03", completed: true },
          { date: "2025-05-04", completed: true },
          { date: "2025-05-05", completed: true },
        ],
        streak: 7,
        ranking: 5,
        totalUsers: 150,
        dailyRoutine: {
          recommended: [
            { type: "memory", title: "Memoria Visual", completed: true },
            { type: "simon", title: "Memoria Secuencial", completed: false },
            { type: "daily", title: "Reto del Día", completed: false }
          ]
        }
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión exitosamente.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: "Por favor verifica tus credenciales.",
      });
    }
  };

  const register = async (email, password, name) => {
    try {
      // Simulación de registro con datos iniciales más completos
      const mockUser = {
        id: Date.now().toString(),
        email,
        name,
        points: 0,
        level: 1,
        cognitiveProfile: {
          memoria: 50,
          atencion: 50,
          logica: 50,
          velocidad: 50,
          planificacion: 50
        },
        achievements: [],
        activityHistory: [{date: new Date().toISOString().split('T')[0], completed: false}],
        streak: 0,
        ranking: 151, // Nuevo usuario, último en el ranking
        totalUsers: 151, // Total de usuarios incrementado
        dailyRoutine: {
          recommended: [
            { type: "memory", title: "Memoria Visual", completed: false },
            { type: "attention", title: "Atención Selectiva", completed: false },
            { type: "daily", title: "Reto del Día", completed: false }
          ]
        }
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: "Por favor intenta nuevamente.",
      });
    }
  };

  const updateUserProgress = (gameType, score) => {
    if (!user) return;

    const newUser = { ...user };
    
    // Actualizar perfil cognitivo
    if (gameType in newUser.cognitiveProfile) {
      newUser.cognitiveProfile[gameType] = Math.min(
        100,
        (newUser.cognitiveProfile[gameType] || 0) + score * 0.1 
      );
    }

    // Actualizar puntos y nivel
    newUser.points += score;
    newUser.level = Math.floor(newUser.points / 100) + 1;

    // Actualizar historial de actividad
    const today = new Date().toISOString().split('T')[0];
    const todayActivity = newUser.activityHistory.find(h => h.date === today);
    if (todayActivity) {
        if(!todayActivity.completed) {
            todayActivity.completed = true;
        }
    } else {
      newUser.activityHistory.push({ date: today, completed: true });
    }
    
    // Actualizar racha (simplificado)
    let currentStreak = 0;
    const sortedHistory = [...newUser.activityHistory].sort((a,b) => new Date(b.date) - new Date(a.date));
    for(let i=0; i<sortedHistory.length; i++){
        const activityDate = new Date(sortedHistory[i].date);
        const checkDate = new Date();
        checkDate.setDate(today.getDate() - i);
        if(sortedHistory[i].completed && activityDate.toISOString().split('T')[0] === checkDate.toISOString().split('T')[0]){
            currentStreak++;
        } else {
            break;
        }
    }
    newUser.streak = currentStreak;


    // Verificar logros
    if (score > 50 && !newUser.achievements.find(a => a.id === 5)) {
      newUser.achievements.push({
        id: 5, // Nuevo ID para logro de puntuación alta
        title: "Puntuación Alta",
        description: "Obtuviste más de 50 puntos en un juego",
        icon: "Zap", // Icono diferente
        unlocked: true,
        date: today
      });
    }
     if (newUser.streak >= 5 && !newUser.achievements.find(a => a.id === 4)) {
       newUser.achievements.push({
        id: 4,
        title: "Racha de 5 días",
        description: "Completaste actividades por 5 días seguidos",
        icon: "Target",
        unlocked: true,
        date: today
      });
    }


    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateUserProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
