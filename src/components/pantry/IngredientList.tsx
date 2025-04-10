
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePantry } from "@/context/PantryContext";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Search, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";

const IngredientList: React.FC = () => {
  const { ingredients, removeIngredient, clearPantry, loading } = usePantry();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ingredient.category && ingredient.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleClearPantry = () => {
    clearPantry();
    setIsDialogOpen(false);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Your Pantry</CardTitle>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={ingredients.length === 0}>
                Clear All
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear your entire pantry?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This will remove all ingredients from your pantry. This action cannot be undone.
              </p>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearPantry}>
                  Clear Pantry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ingredients..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading your pantry...</span>
          </div>
        ) : ingredients.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your pantry is empty. Add some ingredients to get started!
            </AlertDescription>
          </Alert>
        ) : filteredIngredients.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No ingredients match your search.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {filteredIngredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="ingredient-card flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{ingredient.name}</h3>
                  <div className="flex gap-2 mt-1 items-center">
                    {ingredient.category && (
                      <Badge variant="secondary" className="text-xs">{ingredient.category}</Badge>
                    )}
                    {ingredient.amount && (
                      <span className="text-xs text-muted-foreground">{ingredient.amount}</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeIngredient(ingredient.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove {ingredient.name}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IngredientList;
