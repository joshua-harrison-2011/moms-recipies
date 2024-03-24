// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'; // 'ipc-example';

import { NewRecipe, Recipe } from './recipeCsvApi';

export type Channels = string;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  recipeApi: {
    ping: () => {
      return ipcRenderer.invoke('ping');
    },
    getAllRecipies: () => {
      return ipcRenderer.invoke('get-all-recipies');
    },
    updateRecipe: (modifiedRecipe: Recipe) => {
      return ipcRenderer.invoke('update-recipe', modifiedRecipe);
    },
    addRecipe: (newRecipe: NewRecipe) => {
      return ipcRenderer.invoke('add-recipe', newRecipe);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
export type ElectronHandler = typeof electronHandler;
