# moranaUI

minimalist, batteries included microframework for React.

### Motivation

Over the last 2 years I worked with a couple React frameworks,
mainly for mobile PWA apps.

Each of them had its pros and cons, but they all had one thing
in common: they required building a custom abstraction on top to
archieve the target app requirements

So yeah, as every JS dev should, I rolled my own framework to
fulfill my needs.

### Features

- Custom built Router with pages caching and transitions.
- Pages lifecycles hooks (onEnter, onLeave).
- Page structural components - Header, Content, Footer.
- FullScreenOverlays, Modals, Drawers generic components.
- Bunch of usefull hooks for detecting various events (drag, overscroll, swipe, etc.).
- Pull to refresh.
- Customization via CSS modules.
- Built with minimalism in mind.
- 46kB bunlde size (13 kB gzipped).

### Setup

this monorepo is split into `lib` and `example_app` npm workspaces, to setup dependencies:
```
npm i
```

then to run `example_app`:
```
cd example_app
npm run dev
```

run lib build watcher
```
cd lib
npm run build:watch
```

build lib with proper imports aliases (from root dir)
```
npm run build:lib
npm run build:resolve-imports-aliases
```

### Tests

library has some sort of test coverage, but at this stage of its development and due to time it hasn't been pushed further.

to run lib's tests suite:
```
npm run test:lib
```
