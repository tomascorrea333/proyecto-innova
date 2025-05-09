
import React from "react";
import { Button } from "@/components/ui/button";

const ReactionButton = ({ icon, label, count, onClick, userReacted }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    onClick={onClick} 
    className={`flex items-center space-x-1 text-sm ${userReacted ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-accent/50'}`}
  >
    {icon}
    <span>{label} ({count})</span>
  </Button>
);

export default ReactionButton;
