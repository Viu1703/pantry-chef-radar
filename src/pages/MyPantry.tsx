
import React from "react";
import Layout from "@/components/layout/Layout";
import IngredientForm from "@/components/pantry/IngredientForm";
import IngredientList from "@/components/pantry/IngredientList";

const MyPantry: React.FC = () => {
  return (
    <Layout title="My Pantry">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <IngredientForm />
        </div>
        <div className="md:col-span-2">
          <IngredientList />
        </div>
      </div>
    </Layout>
  );
};

export default MyPantry;
