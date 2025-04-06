
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePantry } from "@/context/PantryContext";
import { categories } from "@/data/mockData";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const IngredientForm: React.FC = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const { addIngredient } = usePantry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;

    addIngredient({
      name: name.trim(),
      category,
      amount: amount.trim(),
    });

    // Reset form
    setName("");
    setCategory("");
    setAmount("");
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
            />
          </div>

          <div>
            <Label htmlFor="ingredient-category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
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
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Add to Pantry
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default IngredientForm;
