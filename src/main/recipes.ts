import internal from "stream";

const fs = require('fs');
const { parse } = require('csv-parse');

interface Recipe {
  id?: number;
  name: string;
  magazine: string;
  page: number;
  category: string;
  notes: String;
}

export default class Recipes {
  recipeFile: string;

  constructor(recipeFile: string) {
    this.recipeFile = recipeFile;
  }

  getRecipes() {
    return new Promise((resolve, reject) => {
      const recipes: Recipe[] = [];
      fs.createReadStream(this.recipeFile)
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', (recipe: Recipe) => {
          recipes.push(recipe);
        })
        .on('end', () => {
          resolve(recipes);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });
  }

  static validateRecipe(recipe: Recipe): void {
    if (!recipe.name || recipe.name.length < 1) {
      throw new Error('Invalid recipe name');
    }
    if (!recipe.magazine || recipe.magazine.length < 1) {
      throw new Error('Invalid magazine name');
    }
    if (!recipe.page || recipe.page < 1) {
      throw new Error('Invalid page');
    }
    if (!recipe.category || recipe.category.length < 1) {
      throw new Error('Invalid category name');
    }
  }
}
