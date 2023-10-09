const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  ping: () => {
    return ipcRenderer.invoke('ping');
  },
  getAllRecipies: () => {
    return ipcRenderer.invoke('get-all-recipies');
  },
  deleteRecipe: (recipeId) => {
    return ipcRenderer.invoke('delete-recipe', recipeId);
  },
  updateRecipe: async (recipeId, recipe) => {
    return ipcRenderer.invoke('update-recipe', recipeId, recipe);
  },
  addRecipe: (recipe) => {
    return ipcRenderer.invoke('add-recipe', recipe);
  }
});