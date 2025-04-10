
import { useContext } from "react";
import { PantryContext } from "@/context/PantryContext";

export const usePantry = () => {
  const context = useContext(PantryContext);
  if (context === undefined) {
    throw new Error("usePantry must be used within a PantryProvider");
  }
  return context;
};
