
export const initialCognitiveProfile = {
  memoria: 50,
  atencion: 50,
  logica: 50,
  velocidad: 50,
  planificacion: 50
};

export const mockAchievements = [
  {
    id: "first_win",
    title: "Primera Victoria",
    description: "Completaste tu primer juego",
    icon: "Trophy",
    unlocked: true,
    date: "2025-04-15"
  },
  {
    id: "agile_mind",
    title: "Mente Ágil",
    description: "Alcanzaste 100 puntos",
    icon: "Brain",
    unlocked: true,
    date: "2025-04-16"
  },
  {
    id: "memory_master",
    title: "Maestro de la Memoria",
    description: "Superaste 5 niveles en Memoria Visual",
    icon: "Star",
    unlocked: true,
    date: "2025-04-20"
  },
  {
    id: "streak_5_days_initial", 
    title: "Racha de 5 días",
    description: "Completaste actividades por 5 días seguidos",
    icon: "Target",
    unlocked: true,
    date: "2025-05-05"
  }
];

export const mockActivityHistory = [
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
];

const todayDate = new Date().toISOString().split('T')[0];
const defaultSequence = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');

export const mockDailyRoutine = {
  recommended: [
    { type: "memory", title: "Memoria Visual", completed: true, gamePath: "/games/memory", description: "Encuentra los pares de cartas iguales." },
    { type: "simon", title: "Memoria Secuencial (Simon)", completed: false, gamePath: "/games/simon", description: "Sigue la secuencia de luces y sonidos." },
    { 
      type: "attention", 
      title: "Atención Selectiva", 
      completed: false, 
      gamePath: null, // No navega a un juego, se resuelve en DailyChallenge
      description: "Memoriza la secuencia de números y luego ingrésala.",
      sequence: defaultSequence, // Se genera una secuencia por defecto
      date: todayDate // Asegura que el reto es para hoy
    }
  ]
};

export const mockUserPosts = [
    { 
        id: "post1_lm_gen", 
        userId: "1", author: "Valentina Hortal", avatarInitial: "VH", age: 65,
        content: "¡Qué bueno encontrar un espacio para nosotros! Saludos a todos.", 
        reactions: { inspira: 10, abrazo: 5, alegra: 15, entiendo: 2 }, commentsCount: 2, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), tab: "general"
    },
    { 
        id: "post2_lm_mem", 
        userId: "1", author: "Valentina Hortal", avatarInitial: "VH", age: 65,
        content: "El juego de memoria visual me está costando un poco, ¡pero no me rindo!", 
        reactions: { inspira: 5, abrazo: 2, alegra: 3, entiendo: 1 }, commentsCount: 0, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), tab: "memory"
    }
];

export const mockOtherUsersWithAffinity = [
  {
    id: "2",
    name: "Carmen López",
    avatarInitial: "CL",
    age: 61,
    affinityProfile: {
      relax: "Leer 📚",
      phrase: "Me gusta ayudar a otros",
      topics: "Infancia y Recuerdos",
      connect: "Escuchar sus historias",
      humor: "Sutil e ingenioso"
    },
    posts: [
      { 
        id: "post1_cl_gen", 
        userId: "2", author: "Carmen López", avatarInitial: "CL", age: 61,
        content: "Hoy terminé mi primer juego de memoria. Me siento más joven y capaz. ¡Qué alegría!", 
        reactions: { inspira: 25, abrazo: 10, alegra: 30, entiendo: 5 }, commentsCount: 5, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), tab: "general"
      },
      { 
        id: "post2_cl_mem", 
        userId: "2", author: "Carmen López", avatarInitial: "CL", age: 61,
        content: "El juego de Memoria Visual es mi favorito, ¿cuál es el tuyo? Siempre me entretiene.", 
        reactions: { inspira: 12, abrazo: 3, alegra: 18, entiendo: 2 }, commentsCount: 3, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), tab: "memory"
      },
      { 
        id: "post3_cl_att", 
        userId: "2", author: "Carmen López", avatarInitial: "CL", age: 61,
        content: "¡Qué rápido hay que ser en el juego de Atención Selectiva! Un buen desafío.", 
        reactions: { inspira: 9, abrazo: 1, alegra: 11, entiendo: 3 }, commentsCount: 1, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), tab: "attention"
      }
    ]
  },
  {
    id: "3",
    name: "Roberto Fernandez",
    avatarInitial: "RF",
    age: 67,
    affinityProfile: {
      relax: "Caminar 🌳",
      phrase: "Disfruto recordar el pasado",
      topics: "Humor y Anécdotas",
      connect: "Compartir las mías",
      humor: "Contar chistes"
    },
    posts: [
       { 
        id: "post1_rf_gen", 
        userId: "3", author: "Roberto Fernandez", avatarInitial: "RF", age: 67,
        content: "¿Alguien más recuerda los programas de radio antiguos? Esos sí que eran buenos tiempos.", 
        reactions: { inspira: 8, abrazo: 3, alegra: 12, entiendo: 6 }, commentsCount: 1, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), tab: "general"
      },
      { 
        id: "post2_rf_att", 
        userId: "3", author: "Roberto Fernandez", avatarInitial: "RF", age: 67,
        content: "El juego de Atención Selectiva me ayuda a concentrarme. ¡Muy útil para la mente!", 
        reactions: { inspira: 7, abrazo: 1, alegra: 9, entiendo: 4 }, commentsCount: 0, 
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), tab: "attention"
      },
      { 
        id: "post3_rf_plan", 
        userId: "3", author: "Roberto Fernandez", avatarInitial: "RF", age: 67,
        content: "Intentando mejorar mi estrategia en el juego de Planificación. ¡No es tan fácil como parece!", 
        reactions: { inspira: 5, abrazo: 2, alegra: 6, entiendo: 2 }, commentsCount: 1, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(), tab: "planning"
      }
    ]
  },
  {
    id: "4",
    name: "Ana Torres",
    avatarInitial: "AT",
    age: 63,
    affinityProfile: {
      relax: "Escuchar música 🎵",
      phrase: "Siempre aprendo algo nuevo",
      topics: "Sabiduría de Vida",
      connect: "Aprender juntos",
      humor: "Observacional y cotidiano"
    },
    posts: [
       { 
        id: "post1_at_gen", 
        userId: "4", author: "Ana Torres", avatarInitial: "AT", age: 63,
        content: "Descubrí una nueva canción que me transportó a mi juventud. La música es mágica.", 
        reactions: { inspira: 15, abrazo: 8, alegra: 20, entiendo: 3 }, commentsCount: 2, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), tab: "general"
      },
      { 
        id: "post2_at_simon", 
        userId: "4", author: "Ana Torres", avatarInitial: "AT", age: 63,
        content: "Me divierto mucho con el juego de Simon, ¡es un desafío para la memoria y los reflejos!", 
        reactions: { inspira: 10, abrazo: 5, alegra: 15, entiendo: 1 }, commentsCount: 1, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), tab: "simon"
      },
      { 
        id: "post3_at_plan", 
        userId: "4", author: "Ana Torres", avatarInitial: "AT", age: 63,
        content: "El juego de Planificación es excelente para pensar estrategias. ¿Algún consejo para los niveles más altos?", 
        reactions: { inspira: 6, abrazo: 2, alegra: 8, entiendo: 0 }, commentsCount: 0, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), tab: "planning"
      },
      { 
        id: "post4_at_mem", 
        userId: "4", author: "Ana Torres", avatarInitial: "AT", age: 63,
        content: "Cada día intento un poco el juego de Memoria Visual. ¡Siento que mejora mi agilidad mental!", 
        reactions: { inspira: 11, abrazo: 4, alegra: 16, entiendo: 2 }, commentsCount: 1, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(), tab: "memory"
      }
    ]
  }
];
