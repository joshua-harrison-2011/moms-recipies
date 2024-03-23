import React from 'react';

import { darkTheme, Provider, Flex, ActionButton } from '@adobe/react-spectrum';

import Recipe from './Recipe';
import RecipeList from './RecipeList';
import AddEditRecipe from './AddEditRecipe';

import './App.css';

export default function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    window.electron.recipes
      .getAllRecipies()
      .then(setRecipes)
      .catch(console.error);
  }, []);

  const categoryOptions = React.useMemo(() => {
    const items = Array.from(new Set(recipes.map((r: Recipe) => r.category)));
    items.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    return items.map((m) => ({
      id: m,
      name: m,
    }));
  }, [recipes]);

  const magazineOptions = React.useMemo(() => {
    const items = Array.from(new Set(recipes.map((r: Recipe) => r.magazine)));
    items.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    return items.map((m) => ({
      id: m,
      name: m,
    }));
  }, [recipes]);

  const filteredRecipies = React.useMemo(() => {
    return [...recipes];
  }, [recipes]);

  return (
    <Provider theme={darkTheme}>
      <Flex direction="column" marginStart="size-300" marginEnd="size-300">
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          marginTop="size-300"
        >
          <div id="title">{`Mom's Recipes`}</div>
          <ActionButton>New Recipe</ActionButton>
        </Flex>

        <RecipeList
          recipes={filteredRecipies}
          categoryOptions={categoryOptions}
          magazineOptions={magazineOptions}
        />
      </Flex>
    </Provider>
  );
}
