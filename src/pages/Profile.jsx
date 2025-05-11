
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Trophy, Brain, Star, Award, Target, Zap, CalendarDays, UserCheck2, Edit3 } from "lucide-react";
import { format, getDate, getMonth, getYear, startOfMonth, getDaysInMonth, getDay } from "date-fns";
import { es } from "date-fns/locale";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";
import { affinityQuestions } from "@/lib/affinityData"; 

function Profile() {
  const { user } = useAuth();

  const cognitiveProfile = user?.cognitiveProfile || {};
  const cognitiveData = [
    { subject: "Memoria", value: cognitiveProfile.memoria || 0 },
    { subject: "Atención", value: cognitiveProfile.atencion || 0 },
    { subject: "Lógica", value: cognitiveProfile.logica || 0 },
    { subject: "Velocidad", value: cognitiveProfile.velocidad || 0 },
    { subject: "Planificación", value: cognitiveProfile.planificacion || 0 }
  ];

  const activityHistory = user?.activityHistory || [];
  const achievements = user?.achievements || [];
  const userAffinityProfile = user?.affinityProfile || {};

  const today = new Date();
  const currentMonth = getMonth(today);
  const currentYear = getYear(today);
  const firstDayOfMonth = startOfMonth(today);
  const daysInMonth = getDaysInMonth(today);
  
  let startingDayOfWeek = getDay(firstDayOfMonth); 
  startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek -1; 

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push({ key: `empty-${i}`, isEmpty: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = date.toISOString().split('T')[0];
    const activity = activityHistory.find(h => h.date === dateStr);
    calendarDays.push({
      key: dateStr,
      date,
      dayOfMonth: day,
      active: activity?.completed || false,
      isToday: getDate(date) === getDate(today) && getMonth(date) === currentMonth && getYear(date) === currentYear
    });
  }

  const getIconComponent = (iconName) => {
    const icons = { Trophy, Brain, Star, Award, Target, Zap, CalendarDays, UserCheck2 };
    return icons[iconName] || Brain;
  };

  if (!user) {
    return (
      <div className="container py-8 text-center">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 p-6 shrink-0">
            <Brain className="h-full w-full text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-xl text-muted-foreground">Nivel {user.level}</p>
            {user.age && <p className="text-md text-muted-foreground">{user.name === "Valentina Hortal" ? 65 : user.age} años</p>}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="card lg:col-span-1">
            <h2 className="mb-4 text-2xl font-semibold">Perfil Cognitivo</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={cognitiveData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Habilidades"
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card lg:col-span-1">
            <h2 className="mb-4 text-2xl font-semibold">Estadísticas</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Puntos Totales</span>
                <span className="font-semibold">{user.points}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Racha Actual</span>
                <span className="font-semibold">{user.streak} días</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ranking</span>
                <span className="font-semibold">
                  {user.ranking} de 200
                </span>
              </div>
            </div>
          </div>
          
          {Object.keys(userAffinityProfile).length > 0 && (
            <div className="card lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Mis Intereses</h2>
                <UserCheck2 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-3">
                {affinityQuestions.map(q => {
                  if (userAffinityProfile[q.id]) {
                    return (
                      <div key={q.id}>
                        <p className="text-sm font-medium text-muted-foreground">{q.label}</p>
                        <p className="font-semibold">{userAffinityProfile[q.id]}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-semibold">Calendario de Actividad</h2>
             <span className="text-lg font-medium text-primary">{format(today, "MMMM yyyy", { locale: es })}</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(dayName => (
              <div key={dayName} className="font-semibold text-muted-foreground">{dayName}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => (
              day.isEmpty ? <div key={day.key}></div> :
              <div
                key={day.key}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm
                  ${day.active ? "bg-primary text-primary-foreground" : "bg-muted"}
                  ${day.isToday ? "ring-2 ring-primary ring-offset-2" : ""}
                `}
                title={format(day.date, "d 'de' MMMM", { locale: es })}
              >
                {day.dayOfMonth}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Logros</h2>
          {achievements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => {
                const Icon = getIconComponent(achievement.icon);
                const achievementDate = achievement.date ? new Date(achievement.date) : null;
                const formattedDate = achievementDate && !isNaN(achievementDate)
                  ? format(achievementDate, "d 'de' MMMM, yyyy", { locale: es })
                  : "Fecha no disponible";
                  
                return (
                  <motion.div
                    key={achievement.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card"
                  >
                    <div className="flex items-center space-x-4">
                      <Icon className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formattedDate}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Aún no has desbloqueado logros. ¡Sigue jugando!</p>
          )}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            <Edit3 className="mr-2 h-5 w-5" /> Editar Perfil
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
