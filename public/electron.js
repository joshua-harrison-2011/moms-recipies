const path = require('path');
const util = require('util')

const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron');
const isDev = require('electron-is-dev');

const sqlite3 = require('sqlite3').verbose();

function getDB() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      isDev
        ? path.join(__dirname, '../recipies.db.dev') // my root folder if in dev mode
        : path.join(process.resourcesPath, 'db/TODO.db'), // the resources path if in production build
      (err) => {
        if (err) {
          console.log(`Database Error: ${err}`);
          reject(err);
        } else {
          resolve(db);
        }
      }
    );
  })
}

const dbQueryAll = (sql, params) => {
  return new Promise(async (resolve, reject) => {
    let db = await getDB();
    db.all(sql, params, function(err, rows){
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
      db.close();
    })
  })
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve( __dirname, 'preload.js')
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// ((OPTIONAL)) Setting the location for the userdata folder created by an Electron app. It default to the AppData folder if you don't set it.
app.setPath(
  'userData',
  isDev
    ? path.join(app.getAppPath(), 'userdata/') // In development it creates the userdata folder where package.json is
    : path.join(process.resourcesPath, 'userdata/') // In production it creates userdata folder in the resources folder
);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  ipcMain.handle("ping", async () => {
    // db.all('select * FROM recipe', [], function(err, rows){
    //   console.log("tables 1");
    //   console.log("err", err);
    //   console.log(rows, rows)
    // });
    // console.log(rows);
    return "Pong from electron.js";
  });

  ipcMain.handle("get-all-recipies", async () => {
    const rows = await dbQueryAll("SELECT * FROM recipe", []);
    return rows;
  });

  const validateRecipe = (recipe) => {
    if (!recipe.name || recipe.name.length < 1) {
      throw new Error("Invalid recipe name");
    }
    if (!recipe.magazine || recipe.magazine.length < 1) {
      throw new Error("Invalid magazine name");
    }
    if (!recipe.page || recipe.page < 1) {
      throw new Error("Invalid page")
    }
    if (!recipe.category || recipe.category.length < 1) {
      throw new Error("Invalid category name");
    }
  };

  ipcMain.handle("add-recipe", async (event, recipe) => {
    validateRecipe(recipe);
    await dbQueryAll("INSERT INTO recipe (name, magazine, page, category, notes) VALUES (?, ?, ?, ?, ?)", [
      recipe.name,
      recipe.magazine,
      recipe.page,
      recipe.category,
      recipe.notes
    ]);
  });

  ipcMain.handle("delete-recipe", async (event, recipeId) => {
    if (!recipeId) {
      throw new Error("Invalid recipe id");
    }
    await dbQueryAll("DELETE FROM recipe WHERE id = ?, ?", [
      recipeId
    ]);
  });

  ipcMain.handle("update-recipe", async (event, recipeId, recipe) => {
    if (!recipeId) {
      throw new Error("Invalid recipe id");
    }
    validateRecipe(recipe);

    await dbQueryAll("UPDATE recipe SET name = ?, magazine = ?, page = ?, category = ?, notes = ? WHERE id = ?", [
      recipe.name,
      recipe.magazine,
      recipe.page,
      recipe.category,
      recipe.notes,
      recipeId
    ]);
  });

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});