
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const AffinityDialog = ({ open, onOpenChange, questions, answers, onAnswersChange, onSubmit, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Completa tu Perfil de Afinidad</DialogTitle>
          <DialogDescription>
            Ayúdanos a conocerte mejor para conectar con personas afines. Tus respuestas son privadas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {questions.map(q => (
            <div key={q.id} className="space-y-3">
              <Label htmlFor={q.id} className="text-lg font-semibold">{q.label}</Label>
              <RadioGroup 
                  id={q.id} 
                  value={answers[q.id] || ""}
                  onValueChange={(value) => onAnswersChange(prev => ({...prev, [q.id]: value}))}
                  className="space-y-2"
              >
                {q.options.map(opt => (
                  <div key={opt} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent border border-transparent hover:border-primary/30 affinity-option-item">
                    <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                    <Label htmlFor={`${q.id}-${opt}`} className="font-normal text-lg cursor-pointer flex-1">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
        <DialogFooter className="mt-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Quizás más tarde</Button>
          <Button type="button" size="lg" onClick={onSubmit}>Guardar Perfil</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AffinityDialog;
