
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Brain, Users, User, LogOut } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">CogniSenior</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="lg" className="text-lg px-6 py-6">
                  Inicio
                </Button>
              </Link>
              <Link to="/games">
                <Button variant="ghost" size="lg" className="text-lg px-6 py-6">
                  Juegos
                </Button>
              </Link>
              <Link to="/social">
                <Button variant="ghost" size="lg" className="text-lg px-6 py-6">
                  <Users className="mr-2 h-6 w-6" />
                  Social
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="lg" className="text-lg px-6 py-6">
                  <User className="mr-2 h-6 w-6" />
                  Perfil
                </Button>
              </Link>
              <Button onClick={logout} variant="ghost" size="lg" className="text-lg px-6 py-6">
                <LogOut className="mr-2 h-6 w-6" />
                Salir
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6">
                Ingresar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
