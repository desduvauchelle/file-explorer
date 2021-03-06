# File explorer

The best file explorer for all platforms.

## Screenshot

![Screenshot](https://github.com/desduvauchelle/file-explorer/raw/master/instructions/assets/screenshot.png)

## Install

- **Note: requires a node version >= 6 and an npm version >= 3.**

First, clone the repo via git:

```bash
git clone https://github.com/desduvauchelle/file-explorer.git
```

And then install dependencies.

```bash
$ npm install
```

## Run

Run these two commands **simultaneously** in different console tabs.

```bash
$ npm run hot-server
$ npm run start-hot
```

or run two servers with one command

```bash
$ npm run dev
```

## Editor Configuration

**Atom**

```bash
apm install editorconfig es6-javascript atom-ternjs javascript-snippets linter linter-eslint language-babel autocomplete-modules
```

**Sublime**

- <https://github.com/sindresorhus/editorconfig-sublime#readme>
- <https://github.com/SublimeLinter/SublimeLinter3>
- <https://github.com/roadhump/SublimeLinter-eslint>
- <https://github.com/babel/babel-sublime>

**Others**

- [ESLint](http://eslint.org/docs/user-guide/integrations#editors)
- Babel Syntax Plugin


## Packaging

To package apps for the local platform:

```bash
$ npm run package
```

To package apps for all platforms:

First, refer to [Multi Platform Build](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build) for dependencies.

Then,

```bash
$ npm run package-all
```

To package apps with options:

```bash
$ npm run package -- --[option]
```

## Further commands

To run the application without packaging run

```bash
$ npm run build
$ npm start
```

To run End-to-End Test

```bash
$ npm run build
$ npm run test-e2e
```

To format the code style to fit our code style

```bash
$ npm run esformatter
```

## Options

See [electron-builder CLI Usage](https://github.com/electron-userland/electron-builder#cli-usage)

## Module Structure

This boilerplate uses a [two package.json structure](https://github.com/electron-userland/electron-builder#two-packagejson-structure).

1. If the module is native to a platform or otherwise should be included with the published package (i.e. bcrypt, openbci), it should be listed under `dependencies` in `./app/package.json`.
2. If a module is `import`ed by another module, include it in `dependencies` in `./package.json`. See [this ESLint rule](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md).
3. Otherwise, modules used for building, testing and debugging should be included in `devDependencies` in `./package.json`.

## Help wanted

If you are interested in the project, we're open. You can fork and push a pull request or if you help even more, you can become a contributor. Reach out to us in the issues section.