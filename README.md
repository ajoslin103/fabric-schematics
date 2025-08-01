# Fabric Schematics

A schematic and diagram visualization library for [fabric.js](https://fabricjs.com/) canvases, with advanced grid system for precise coordinate-based drawing.

`fabric-schematics` evolved from `fabric-layers-core` which was based on the excellent original work of [IndoorJS](https://github.com/mudin/indoorjs) by [Mudin](https://github.com/mudin).

---

## ✨ Classes

```
Base (EventEmitter2)
├── Map (+ ModesMixin)
│   ├── Grid
│   └── Point
```

This library focuses on providing schematic and diagram components, starting with an advanced coordinate grid system. Future versions will include connectors, markers, and measurement tools.

## 🚀 Running the Grid Demo

To explore the grid functionality, follow these steps:

1. **Install Dependencies**
   ```bash
   nvm i && yarn install
   ```

2. **Build the Library**
   ```bash
   nvm i && yarn build
   ```

3. **Open the Demo**
   - Open `grid-demo.html` directly in your browser
   - The demo includes:
     - Interactive grid with zoom/pan functionality
     - Coordinate display
     - Zoom level controls
     - Reset view button

4. **Development Workflow**
   - `nvm i && yarn build:watch`
   - Make changes to the source code
   - Refresh the browser to see changes


## Publishing

To publish a new version, run:

```bash
yarn test
```

```bash
yarn build
```

if no errors, run:

```bash
yarn release
```

```bash
git push --follow-tags origin main && npm publish
```

You will be prompted to enter a One-Time-Password (OTP) from your GitHub account.


## 🤝 Contributing

PRs and issues are welcome!
1. Fork & `git clone`
2. `yarn install`
3. `yarn dev` – watch/build
4. Add tests in `test/` and run `yarn test`

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) spec; CI will lint commit messages.

---

## 📄 Licenses

MIT © 2025 [Allen Joslin](https://github.com/ajoslin103) (author of fabric-schematics)

MIT © 2022 [Mudin](https://github.com/mudin) (original author of IndoorJS)