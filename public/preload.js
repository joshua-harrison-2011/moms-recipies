const { ipcRenderer, contextBridge } = require('electron');

// const path = require('path');

// const isDev = require('electron-is-dev');
// const sqlite3 = require('sqlite3');

//console.log(__dirname);

contextBridge.exposeInMainWorld('api', {
  // Invoke Methods
  testInvoke: (args) => ipcRenderer.invoke('test-invoke', args),
  // Send Methods
  testSend: (args) => ipcRenderer.send('test-send', args),
  testReceive: (callback) => ipcRenderer.on('test-receive', (event, data) => { callback(data) }),
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