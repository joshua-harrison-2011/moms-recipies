Mom's Recipes
=============

Year's ago, I wrote an app that allowed my mom to index the recipes from her cooking magazines. This was written in Adobe Air
and stored the recipes in a sqlite database.  Adobe Air has since been deprecated.

This application is written in Electron as I'm familiar with browser based technologies. It starts with Electron React Boilerplate
(see [here](README.orig.md)) as ERB keeps the installation size small-ish.

I wasn't able to get sqlite working, so a csv data store is used. For our purposes, it appears performant enough.

To run the app locally: `npm run start`
To package the app: `npm run package`.  This creates an executable installer in `release\build`.  
