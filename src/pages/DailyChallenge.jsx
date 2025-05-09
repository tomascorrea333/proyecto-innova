
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, ArrowLeft, PlayCircle, CheckCircle, XCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function DailyChallenge() {
  const { user, updateUserProgress } = useAuth();
  const { toast } = useToast();

  const [showResultDialog, setShowResultDialog] = useState(false);
  const [challengeOutcome, setChallengeOutcome] = useState(null);
  const [showSequenceInputDialog, setShowSequenceInputDialog] = useState(false);
  const [userSequenceInput, setUserSequenceInput] = useState("");

  const [currentChallenge, setCurrentChallenge] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const challengeForToday = user?.dailyRoutine?.recommended?.find(r => r.type === 'daily_sequence_memory' && r.date === today);
    
    if (challengeForToday) {
      setCurrentChallenge(challengeForToday);
    } else {
      const newSequence = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
      const newChallenge = {
        type: 'daily_sequence_memory',
        title: "Ejercicio de Secuencia Numérica",
        description: "Memoriza la secuencia de números y luego ingrésala.",
        sequence: newSequence,
        completed: false,
        date: today,
      };
      setCurrentChallenge(newChallenge);
      // Aquí podrías guardar este nuevo reto en el estado global del usuario si fuera persistente
      // Por ahora, solo se maneja localmente en esta página.
    }
  }, [user?.dailyRoutine]);


  const handleStartChallenge = () => {
    if (currentChallenge?.completed) {
      toast({
        title: "Reto ya completado",
        description: "¡Ya has completado el reto de hoy! Vuelve mañana para uno nuevo.",
      });
      return;
    }
    setShowSequenceInputDialog(true);
  };

  const handleSubmitSequence = () => {
    setShowSequenceInputDialog(false);
    if (userSequenceInput === currentChallenge?.sequence) {
      setChallengeOutcome("success");
      toast({ title: "¡Correcto!", description: "Has ingresado la secuencia correctamente." });
      if (!currentChallenge?.completed) {
        updateUserProgress('daily_challenge_sequence', 75); // Puntos por reto de secuencia
         // Marcar como completado (si se guardara en AuthContext)
        setCurrentChallenge(prev => ({...prev, completed: true}));
      }
    } else {
      setChallengeOutcome("failure");
      toast({ variant: "destructive", title: "Incorrecto", description: `La secuencia correcta era ${currentChallenge?.sequence}. ¡Inténtalo de nuevo mañana!` });
    }
    setShowResultDialog(true);
    setUserSequenceInput("");
  };
  
  useEffect(() => {
    // Este useEffect es para manejar resultados de otros tipos de retos si se navega desde ellos.
    // Para el reto de secuencia, el resultado se maneja directamente en handleSubmitSequence.
    const challengeResultFromOtherGame = sessionStorage.getItem('challengeResult');
    if (challengeResultFromOtherGame && currentChallenge?.type !== 'daily_sequence_memory') {
      const outcome = JSON.parse(challengeResultFromOtherGame);
      setChallengeOutcome(outcome.success ? "success" : "failure");
      setShowResultDialog(true);
      if (outcome.success && !currentChallenge?.completed) {
         // Asumiendo que otros retos dan 50 puntos
        updateUserProgress(currentChallenge?.type || 'daily_challenge', 50);
        setCurrentChallenge(prev => ({...prev, completed: true}));
      }
      sessionStorage.removeItem('challengeResult');
    }
  }, [user, currentChallenge, updateUserProgress]);


  if (!currentChallenge) {
    return (
      <div className="container py-8 text-center">
        <p>Cargando reto del día...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-2xl mx-auto"
      >
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Reto del Día</h1>
            <p className="mt-1 text-lg text-muted-foreground">
              Completa el desafío diario y gana puntos extra.
            </p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary/15 via-background to-secondary/15 p-8 text-center">
          <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-semibold mb-3">{currentChallenge.title}</h2>
          <p className="mt-2 text-xl text-muted-foreground mb-8">
            {currentChallenge.description}
          </p>
          
          {currentChallenge.sequence && (
            <div className="my-8">
              <p className="text-sm text-muted-foreground mb-2">Secuencia a recordar:</p>
              <p className="text-5xl font-bold tracking-widest text-primary">{currentChallenge.sequence}</p>
            </div>
          )}

          <Button size="lg" className="px-10 py-6 text-lg w-full sm:w-auto" onClick={handleStartChallenge}>
            <PlayCircle className="mr-2 h-6 w-6" />
            {currentChallenge.completed ? "Reto Completado" : "Comenzar Desafío"}
          </Button>
          {currentChallenge.completed && (
            <p className="text-sm text-green-600 mt-3">¡Ya completaste el reto de hoy!</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <h3 className="text-xl font-semibold">Recompensa del Día</h3>
            <p className="mt-2 text-muted-foreground">
              Completa el reto y gana <span className="font-bold text-primary">75 puntos extra</span>.
            </p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold">Tu Racha Actual</h3>
            <p className="mt-2 text-muted-foreground">
              Has completado <span className="font-bold text-primary">{user?.streak || 0} días seguidos</span>. ¡Sigue así!
            </p>
          </div>
        </div>
      </motion.div>

      <Dialog open={showSequenceInputDialog} onOpenChange={setShowSequenceInputDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ingresa la Secuencia</DialogTitle>
            <DialogDescription>
              Escribe la secuencia de números que memorizaste.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="text"
              placeholder="Ej: 12345"
              value={userSequenceInput}
              onChange={(e) => setUserSequenceInput(e.target.value.replace(/[^0-9]/g, ''))}
              className="text-2xl text-center tracking-widest"
              maxLength={currentChallenge?.sequence?.length || 5}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmitSequence} disabled={userSequenceInput.length !== (currentChallenge?.sequence?.length || 5)}>
              <Send className="mr-2 h-4 w-4" /> Verificar Secuencia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              {challengeOutcome === "success" ? (
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              ) : (
                <XCircle className="h-8 w-8 text-red-500 mr-3" />
              )}
              {challengeOutcome === "success" ? "¡Reto Completado!" : "Reto Fallido"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {challengeOutcome === "success"
                ? `¡Excelente trabajo! Has superado el reto del día y ganado ${currentChallenge?.type === 'daily_sequence_memory' ? 75 : 50} puntos.`
                : `No te preocupes, ¡puedes intentarlo de nuevo mañana! ${currentChallenge?.type === 'daily_sequence_memory' ? `La secuencia correcta era ${currentChallenge.sequence}.` : 'Sigue practicando.' }`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowResultDialog(false)}>Entendido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export default DailyChallenge;
