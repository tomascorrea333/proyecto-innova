
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Brain, Zap, ShieldCheck, BarChartBig } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";


const PremiumPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const benefits = [
    { icon: <Star className="h-6 w-6 text-yellow-400" />, text: "Acceso a todos los juegos exclusivos" },
    { icon: <Brain className="h-6 w-6 text-blue-400" />, text: "Planes de entrenamiento personalizados" },
    { icon: <BarChartBig className="h-6 w-6 text-green-400" />, text: "Análisis de progreso detallado y avanzado" },
    { icon: <Zap className="h-6 w-6 text-purple-400" />, text: "Nuevos desafíos y contenido cada mes" },
    { icon: <ShieldCheck className="h-6 w-6 text-red-400" />, text: "Soporte prioritario y sin anuncios" },
  ];

  const handleSubscribe = () => {
    toast({
      title: "¡Gracias por tu interés!",
      description: "La funcionalidad de pago con Stripe se integrará pronto. Por ahora, esta es una demostración.",
    });
  };

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="inline-block p-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full mb-6">
          <Star className="h-12 w-12 text-white" fill="white" />
        </div>
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
          Desbloquea tu Potencial con EternaMente Premium
        </h1>
        <p className="text-xl text-muted-foreground mb-10">
          Lleva tu entrenamiento cognitivo al siguiente nivel con herramientas avanzadas, contenido exclusivo y una experiencia personalizada.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-1 gap-8 items-center mb-12">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4"
        >
          <h2 className="text-3xl font-bold mb-4 text-center md:text-left">Beneficios Exclusivos de Premium:</h2>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className="flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
              <span className="text-lg">{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="card bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 md:p-12 text-center"
      >
        <h2 className="text-4xl font-bold mb-4">¡Únete a Premium Hoy!</h2>
        <p className="text-2xl opacity-90 mb-2">Plan Mensual</p>
        <p className="text-5xl font-extrabold mb-6">
          $9.99 <span className="text-xl font-normal opacity-80">/mes</span>
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-10 py-8 font-bold shadow-lg transform hover:scale-105 transition-transform"
          onClick={handleSubscribe}
        >
          <Star className="mr-2 h-6 w-6" /> Suscríbete Ahora
        </Button>
        <p className="text-sm opacity-70 mt-4">Cancela en cualquier momento.</p>
      </motion.div>

      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.7, duration: 0.5 }}
         className="text-center mt-12"
      >
        <Button variant="link" onClick={() => navigate("/dashboard")}>
          Volver al Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default PremiumPage;
