
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePantry } from "@/context/PantryContext";
import { categories } from "@/data/mockData";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const IngredientForm: React.FC = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addIngredient } = usePantry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;

    setIsSubmitting(true);
    
    try {
      console.log("Form submission:", { name, category, amount });
      
      await addIngredient({
        name: name.trim(),
        category,
        amount: amount.trim(),
      });

      // Reset form
      setName("");
      setCategory("");
      setAmount("");
    } catch (error) {
      console.error("Error submitting ingredient:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Ingredients</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ingredient-name">Ingredient Name</Label>
            <Input
              id="ingredient-name"
              placeholder="Enter ingredient name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="ingredient-category">Category</Label>
            <Select 
              value={category} 
              onValueChange={setCategory} 
              required
              disabled={isSubmitting}
            >
              <SelectTrigger id="ingredient-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ingredient-amount">Amount (optional)</Label>
            <Input
              id="ingredient-amount"
              placeholder="e.g., 2 cups, 500g"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !name || !category}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add to Pantry"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default IngredientForm;
