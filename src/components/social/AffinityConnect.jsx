
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserCheck2 } from 'lucide-react';

const AffinityConnect = ({ user, matches, percentage, onShowAffinityDialog }) => {
  if (!user) return null;

  if (!user.affinityProfile) {
    return (
      <motion.div 
        className="card bg-blue-50 border-blue-200 p-6 text-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
      >
        <UserCheck2 className="h-10 w-10 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold mb-2 text-blue-700">¡Conecta con otros!</h2>
        <p className="text-muted-foreground mb-4">Completa tu perfil de afinidad para descubrir personas con intereses similares.</p>
        <Button onClick={onShowAffinityDialog} variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-100">Completar Perfil de Afinidad</Button>
      </motion.div>
    );
  }

  if (matches.length === 0) {
     return (
         <motion.div 
            className="card p-6 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
             <h2 className="text-2xl font-semibold mb-3">Explora la comunidad</h2>
            <p className="text-muted-foreground mb-4">Aún no encontramos coincidencias exactas, ¡pero sigue explorando y participando!</p>
            <p className="text-sm text-muted-foreground">Te pareces con el {percentage}% de los usuarios en la comunidad.</p>
            <Button variant="link" onClick={onShowAffinityDialog} className="mt-3">Editar mi perfil de afinidad</Button>
         </motion.div>
     );
  }

  return (
    <motion.div 
      className="card p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-3">Nos parecemos en...</h2>
      <p className="text-muted-foreground mb-4">Te pareces con el {percentage}% de los usuarios en la comunidad.</p>
      <div className="space-y-3">
        {matches.map(match => (
          <div key={match.user.id} className="p-3 bg-secondary/50 rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{match.user.name} <span className="text-xs text-muted-foreground">({match.count} afinidades)</span></p>
              <p className="text-sm text-primary">Intereses: {match.points.join(', ')}</p>
            </div>
            <Button variant="outline" size="sm">Ver Publicaciones</Button>
          </div>
        ))}
      </div>
      <Button variant="link" onClick={onShowAffinityDialog} className="mt-3">Editar mi perfil de afinidad</Button>
    </motion.div>
  );
};

export default AffinityConnect;
