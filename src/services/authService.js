
import { 
  initialCognitiveProfile, 
  mockAchievements, 
  mockActivityHistory,
  mockDailyRoutine,
  mockUserPosts,
  mockOtherUsersWithAffinity
} from '@/contexts/mockUserData';

export const getUserFromStorage = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const saveUserToStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUserFromStorage = () => {
  localStorage.removeItem("user");
};

export const getInitialUserForLogin = (email) => ({
  id: "1",
  email,
  name: "Lionel Messi", 
  avatarInitial: "LM",
  age: 78,
  points: 1250,
  level: 12,
  cognitiveProfile: { ...initialCognitiveProfile, memoria: 85, atencion: 70, logica: 90, velocidad: 75, planificacion: 80 },
  achievements: [...mockAchievements],
  activityHistory: [...mockActivityHistory],
  streak: 7,
  ranking: 5,
  totalUsers: mockOtherUsersWithAffinity.length + 1,
  dailyRoutine: { ...mockDailyRoutine },
  affinityProfile: null, 
  posts: [...mockUserPosts], 
});

export const getInitialUserForRegistration = (email, name) => ({
  id: Date.now().toString(),
  email,
  name,
  avatarInitial: name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "UA",
  age: null,
  points: 0,
  level: 1,
  cognitiveProfile: { ...initialCognitiveProfile },
  achievements: [],
  activityHistory: [{date: new Date().toISOString().split('T')[0], completed: false}],
  streak: 0,
  ranking: mockOtherUsersWithAffinity.length + 2, 
  totalUsers: mockOtherUsersWithAffinity.length + 2, 
  dailyRoutine: {
    recommended: [
      { type: "memory", title: "Memoria Visual", completed: false },
      { type: "attention", title: "Atención Selectiva", completed: false },
      { type: "daily", title: "Reto del Día", completed: false }
    ]
  },
  affinityProfile: null,
  posts: [],
});


export const loginUser = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (email && password) { 
    return getInitialUserForLogin(email);
  } else {
    throw new Error("Credenciales inválidas");
  }
};

export const registerUser = async (email, password, name) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (email && password && name) {
    return getInitialUserForRegistration(email, name);
  } else {
    throw new Error("Todos los campos son requeridos para el registro.");
  }
};

export const updateUserProgressService = (currentUser, gameType, score) => {
  const newUser = { ...currentUser, cognitiveProfile: { ...currentUser.cognitiveProfile }, achievements: [...currentUser.achievements], activityHistory: [...currentUser.activityHistory] };
  
  if (gameType in newUser.cognitiveProfile) {
    newUser.cognitiveProfile[gameType] = Math.min(
      100,
      (newUser.cognitiveProfile[gameType] || 0) + score * 0.1 
    );
  }

  newUser.points += score;
  newUser.level = Math.floor(newUser.points / 100) + 1;

  const today = new Date().toISOString().split('T')[0];
  const todayActivityIndex = newUser.activityHistory.findIndex(h => h.date === today);
  if (todayActivityIndex !== -1) {
      if(!newUser.activityHistory[todayActivityIndex].completed) {
          newUser.activityHistory[todayActivityIndex].completed = true;
      }
  } else {
    newUser.activityHistory.push({ date: today, completed: true });
  }
  
  let currentStreak = 0;
  const sortedHistory = [...newUser.activityHistory].sort((a,b) => new Date(b.date) - new Date(a.date));
  
  for(let i=0; i<sortedHistory.length; i++){
    const activityDate = new Date(sortedHistory[i].date);
    const checkDate = new Date();
    checkDate.setDate(new Date(today).getDate() - i); 
    if(sortedHistory[i].completed && 
       activityDate.getFullYear() === checkDate.getFullYear() &&
       activityDate.getMonth() === checkDate.getMonth() &&
       activityDate.getDate() === checkDate.getDate()){
        currentStreak++;
    } else {
        break;
    }
  }
  newUser.streak = currentStreak;

  if (score > 50 && !newUser.achievements.find(a => a.id === "score_gt_50")) {
    newUser.achievements.push({
      id: "score_gt_50", 
      title: "Puntuación Alta",
      description: "Obtuviste más de 50 puntos en un juego",
      icon: "Zap", 
      unlocked: true,
      date: today
    });
  }
   if (newUser.streak >= 5 && !newUser.achievements.find(a => a.id === "streak_5_days")) {
     newUser.achievements.push({
      id: "streak_5_days",
      title: "Racha de 5 días",
      description: "Completaste actividades por 5 días seguidos",
      icon: "Target",
      unlocked: true,
      date: today
    });
   }
  return newUser;
};

export const updateUserAffinityProfileService = (currentUser, affinityProfile) => {
  return { ...currentUser, affinityProfile };
};

export const updateUserSocialPostsService = (currentUser, newPostsCollection) => {
  const updatedUser = { ...currentUser };
  updatedUser.posts = [];
  for (const tabKey in newPostsCollection) {
    if (Array.isArray(newPostsCollection[tabKey])) {
      updatedUser.posts.push(...newPostsCollection[tabKey]);
    }
  }
  return updatedUser;
};
