# 🐙 express-generator-template

This module allows you to start using express with Node es-2015 and stage-0 features very quickly.

It has some dev ops implemented on the npm package:

### - lint : [babel-standard](https://www.npmjs.com/package/babel-standard)
```
npm run lint
```
Is not working actually.

### - dev : [nodemon](https://nodemon.io/)
```
npm run dev
```
Hotreloading running, with lint and ignoring public/js folder.

### - start : [babel-node](https://babeljs.io/docs/usage/cli/#babel-node)
```
npm start
```
Runs the server with babel-node (kind of node but transpiling before) and with "dev" enviroment flags. babel-node works together with .babelrc file, the same as babel-cli.

### ! ! ! important ! ! !
Babel-node is <strong>not</strong> [babel-node](https://www.npmjs.com/package/babel-node). Don't try to install it manually, it's just a dependency installed from [babel-cli]((https://babeljs.io/docs/usage/cli)).

### - build : [babel](https://babeljs.io/)
```
npm run build
```
For production build only.

### - serve : [node](https://nodejs.org)
```
npm run serve
```
For production serve only, running real Node.

# getting started

If you haven't <strong>yarn</strong> on your computer, you could [easily get it](https://yarnpkg.com/en/docs/install).

If you want to start coding just clone this repo, get into and run:
```
yarn install && npm run dev
```

Try to make a change on any file at /src folder. I suggest getting into /src/controllers/index.js to make a very fast and understandable change.
