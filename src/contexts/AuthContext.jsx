
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  loginUser,
  registerUser,
  updateUserProgressService,
  updateUserAffinityProfileService,
  updateUserSocialPostsService,
  getUserFromStorage,
  saveUserToStorage,
  clearUserFromStorage
} from "@/services/authService";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAffinityModalOnLogin, setShowAffinityModalOnLogin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const loggedInUser = await loginUser(email, password);
      saveUserToStorage(loggedInUser);
      setUser(loggedInUser);
      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión exitosamente.",
      });
      if (!loggedInUser.affinityProfile) {
        setShowAffinityModalOnLogin(true); 
      }
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: error.message || "Por favor verifica tus credenciales.",
      });
    }
  };

  const register = async (email, password, name) => {
    try {
      const newUser = await registerUser(email, password, name);
      saveUserToStorage(newUser);
      setUser(newUser);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada.",
      });
      setShowAffinityModalOnLogin(true); 
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: error.message || "Por favor intenta nuevamente.",
      });
    }
  };

  const updateUserProgress = (gameType, score) => {
    if (!user) return;
    const updatedUser = updateUserProgressService(user, gameType, score);
    saveUserToStorage(updatedUser);
    setUser(updatedUser);
  };

  const updateUserAffinityProfile = (affinityProfile) => {
    if (!user) return;
    const updatedUser = updateUserAffinityProfileService(user, affinityProfile);
    saveUserToStorage(updatedUser);
    setUser(updatedUser);
    setShowAffinityModalOnLogin(false); 
    toast({
      title: "Perfil de afinidad guardado",
      description: "Tus preferencias se han actualizado.",
    });
  };
  
  const updateUserSocialPosts = (newPostsCollection) => {
    if (!user) return;
    const updatedUser = updateUserSocialPostsService(user, newPostsCollection);
    saveUserToStorage(updatedUser);
    setUser(updatedUser);
  };

  const logout = () => {
    clearUserFromStorage();
    setUser(null);
    navigate("/");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
  };

  const clearShowAffinityModal = () => {
    setShowAffinityModalOnLogin(false);
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateUserProgress,
    updateUserAffinityProfile,
    updateUserSocialPosts,
    showAffinityModalOnLogin,
    clearShowAffinityModal
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
