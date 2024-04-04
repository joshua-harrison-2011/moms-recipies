import React from 'react';

import {
  darkTheme,
  ActionButton,
  DialogTrigger,
  Flex,
  Provider,
} from '@adobe/react-spectrum';

import { ToastContainer } from '@react-spectrum/toast';

import Recipe from './Recipe';
import RecipeList from './RecipeList';
// import AddEditRecipeDialog from './AddEditRecipeDialog';

import './App.css';

export default function App() {
  const [recipes, setRecipes] = React.useState([]);
  const [refreshRecipes, setRefreshRecipes] = React.useState(new Date());
  const triggerRecipeRefresh = React.useCallback(() => {
    setRefreshRecipes(new Date());
  }, []);

  // Load the recipes through the electron bridge
  React.useEffect(() => {
    window.electron.recipeApi
      .getAllRecipies()
      .then(setRecipes)
      .catch(console.error);
  }, [refreshRecipes]);

  // When the recipes change, update the list of categories
  const categoryOptions = React.useMemo(() => {
    const items = Array.from(new Set(recipes.map((r: Recipe) => r.category)));
    items.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return items.map((m) => ({
      id: m,
      name: m,
    }));
  }, [recipes]);

  // When the recipes change, update the list of magazines
  const magazineOptions = React.useMemo(() => {
    const items = Array.from(new Set(recipes.map((r: Recipe) => r.magazine)));
    items.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return items.map((m) => ({
      id: m,
      name: m,
    }));
  }, [recipes]);

  return (
    <Provider theme={darkTheme}>
      <Flex
        direction="column"
        marginStart="size-300"
        marginEnd="size-300"
        height="100vh"
      >
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          marginTop="size-300"
        >
          <div id="title">{`Mom's Recipes`}</div>
          {/* <DialogTrigger type="modal">
            <ActionButton>New Recipe</ActionButton>
            {(close: Function) => (
              <AddEditRecipeDialog
                recipe={undefined}
                close={() => {
                  triggerRecipeRefresh();
                  close();
                }}
                categoryOptions={categoryOptions}
                magazineOptions={magazineOptions}
              />
            )}
          </DialogTrigger> */}
        </Flex>

        <RecipeList
          recipes={recipes}
          categoryOptions={categoryOptions}
          magazineOptions={magazineOptions}
          triggerRecipeRefresh={triggerRecipeRefresh}
        />
      </Flex>
      <ToastContainer />
    </Provider>
  );
}
