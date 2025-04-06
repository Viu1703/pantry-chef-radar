
export type Recipe = {
  id: string;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  tags: string[];
};

export const recipeData: Recipe[] = [
  {
    id: "1",
    title: "Simple Pasta Marinara",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1470&auto=format&fit=crop",
    description: "A quick and easy pasta dish with a flavorful tomato sauce.",
    ingredients: [
      "spaghetti",
      "olive oil",
      "garlic",
      "tomatoes",
      "onion",
      "basil",
      "salt",
      "pepper"
    ],
    instructions: [
      "Bring a large pot of salted water to a boil.",
      "Add spaghetti and cook according to package instructions until al dente.",
      "In a large pan, heat olive oil over medium heat.",
      "Add minced garlic and diced onions, sauté until translucent.",
      "Add diced tomatoes and cook until they break down, about 10 minutes.",
      "Season with salt, pepper, and torn basil leaves.",
      "Drain the pasta and add to the sauce, tossing to coat.",
      "Serve immediately with additional basil if desired."
    ],
    cookTime: 15,
    prepTime: 10,
    servings: 4,
    tags: ["pasta", "italian", "quick", "vegetarian"]
  },
  {
    id: "2",
    title: "Classic Omelette",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1510&auto=format&fit=crop",
    description: "A fluffy and versatile breakfast classic that's easy to customize.",
    ingredients: [
      "eggs",
      "butter",
      "salt",
      "pepper",
      "cheese"
    ],
    instructions: [
      "Crack eggs into a bowl and whisk until well combined.",
      "Season with salt and pepper.",
      "Heat a non-stick pan over medium heat and add butter.",
      "Once butter is melted, pour in the eggs.",
      "As the eggs begin to set, use a spatula to pull in the edges, allowing uncooked egg to flow underneath.",
      "When eggs are almost set, sprinkle cheese on one half.",
      "Fold the omelette in half and cook for another 30 seconds.",
      "Slide onto a plate and serve immediately."
    ],
    cookTime: 5,
    prepTime: 5,
    servings: 1,
    tags: ["breakfast", "quick", "vegetarian", "gluten-free"]
  },
  {
    id: "3",
    title: "Hearty Bean Soup",
    image: "https://images.unsplash.com/photo-1614522407266-5c29267df2f4?q=80&w=1470&auto=format&fit=crop",
    description: "A comforting and nutritious soup perfect for cold days.",
    ingredients: [
      "beans",
      "carrots",
      "celery",
      "onion",
      "garlic",
      "vegetable broth",
      "bay leaf",
      "thyme",
      "salt",
      "pepper",
      "olive oil"
    ],
    instructions: [
      "Heat olive oil in a large pot over medium heat.",
      "Add diced onions, carrots, and celery. Sauté until softened, about 5 minutes.",
      "Add minced garlic and cook for 30 seconds until fragrant.",
      "Add beans, vegetable broth, bay leaf, and thyme.",
      "Bring to a boil, then reduce heat and simmer for 30 minutes.",
      "Season with salt and pepper to taste.",
      "Remove bay leaf before serving.",
      "Serve hot with crusty bread if desired."
    ],
    cookTime: 40,
    prepTime: 15,
    servings: 6,
    tags: ["soup", "vegetarian", "vegan", "gluten-free", "healthy"]
  },
  {
    id: "4",
    title: "Simple Rice Pilaf",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1470&auto=format&fit=crop",
    description: "A flavorful rice dish that makes the perfect side for any meal.",
    ingredients: [
      "rice",
      "onion",
      "garlic",
      "vegetable broth",
      "butter",
      "bay leaf",
      "salt",
      "pepper"
    ],
    instructions: [
      "Melt butter in a medium saucepan over medium heat.",
      "Add diced onion and sauté until translucent, about 3 minutes.",
      "Add minced garlic and cook for 30 seconds until fragrant.",
      "Add rice and stir to coat with butter.",
      "Pour in vegetable broth and add bay leaf, salt, and pepper.",
      "Bring to a boil, then reduce heat to low, cover, and simmer for 18 minutes.",
      "Remove from heat and let stand, covered, for 5 minutes.",
      "Fluff with a fork before serving."
    ],
    cookTime: 25,
    prepTime: 10,
    servings: 4,
    tags: ["side dish", "vegetarian", "gluten-free"]
  },
  {
    id: "5",
    title: "Quick Avocado Toast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=1572&auto=format&fit=crop",
    description: "A simple, nutritious breakfast or snack ready in minutes.",
    ingredients: [
      "bread",
      "avocado",
      "lemon juice",
      "salt",
      "pepper",
      "red pepper flakes"
    ],
    instructions: [
      "Toast bread until golden and crisp.",
      "Cut avocado in half, remove pit, and scoop flesh into a bowl.",
      "Mash avocado with a fork and mix in lemon juice, salt, and pepper.",
      "Spread mashed avocado onto toast.",
      "Sprinkle with red pepper flakes if desired.",
      "Serve immediately."
    ],
    cookTime: 3,
    prepTime: 5,
    servings: 1,
    tags: ["breakfast", "vegetarian", "vegan", "quick"]
  },
  {
    id: "6",
    title: "Basic Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1380&auto=format&fit=crop",
    description: "Fluffy, golden pancakes perfect for a weekend breakfast.",
    ingredients: [
      "flour",
      "sugar",
      "baking powder",
      "salt",
      "milk",
      "eggs",
      "butter"
    ],
    instructions: [
      "In a large bowl, whisk together flour, sugar, baking powder, and salt.",
      "In another bowl, whisk together milk, eggs, and melted butter.",
      "Pour wet ingredients into dry ingredients and stir just until combined.",
      "Heat a non-stick pan or griddle over medium heat.",
      "Pour 1/4 cup of batter for each pancake.",
      "Cook until bubbles form on the surface, then flip and cook until golden.",
      "Serve warm with maple syrup, fruit, or your favorite toppings."
    ],
    cookTime: 10,
    prepTime: 10,
    servings: 4,
    tags: ["breakfast", "vegetarian", "sweet"]
  }
];

export const categories = [
  "Fruits",
  "Vegetables",
  "Meat",
  "Seafood",
  "Dairy",
  "Grains",
  "Baking",
  "Spices",
  "Condiments",
  "Frozen",
  "Canned",
  "Beverages",
  "Other"
];
