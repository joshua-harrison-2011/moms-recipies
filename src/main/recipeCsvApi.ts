const fs = require('fs');
const { parse } = require('csv-parse');

export interface NewRecipe {
  name: string;
  magazine: string;
  page: number;
  category: string;
  notes: String;
}

export interface Recipe extends NewRecipe {
  id: number;
}

export default class RecipeCsvApi {
  recipeFile: string;

  constructor(recipeFile: string, originalRecipeFile: string) {
    this.recipeFile = recipeFile;
    if (!fs.existsSync(this.recipeFile)) {
      fs.copyFileSync(originalRecipeFile, this.recipeFile);
    }
  }

  getRecipes(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      const recipes: Recipe[] = [];
      fs.createReadStream(this.recipeFile)
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', (recipe: Recipe) => {
          recipes.push({
            ...recipe,
            id: parseInt(`${recipe.id}`, 10),
            page: parseInt(`${recipe.page}`, 10),
          });
        })
        .on('end', () => {
          recipes.sort((a, b) => (a.id < b.id ? -1 : 1));
          resolve(recipes);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });
  }

  saveRecipes(recipes: Recipe[]): Promise<boolean> {
    let fileData = 'id,name,magazine,page,category,notes\n';
    recipes.forEach((recipe) => {
      fileData += `${[
        recipe.id,
        `"${recipe.name}"`,
        `"${recipe.magazine}"`,
        recipe.page,
        `"${recipe.category}"`,
        `"${recipe.notes}"`,
      ].join(',')}\n`;
    });
    return new Promise((resolve, reject) => {
      fs.writeFile(this.recipeFile, fileData, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  validateRecipe(recipe: Recipe | NewRecipe): void {
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
