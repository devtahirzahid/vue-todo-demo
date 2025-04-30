# Vue Todo App

A modern todo application built with Vue 3, featuring drag-and-drop functionality, local storage persistence, and a clean UI.

## Features

- Add, complete, and delete todos
- Drag and drop to reorder items
- Move items between active and completed lists
- Persistent storage using localStorage
- Responsive design
- Toast notifications

## Prerequisites

- Node.js (v14 or higher)
- Yarn package manager

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/devtahirzahid/vue-todo-demo.git
cd vue-todo-demo
```

2. Install dependencies using Yarn:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

4. Build for production:

```bash
yarn build
```

## Project Structure

- `src/App.vue` - Main application component
- `src/main.js` - Application entry point
- `public/` - Static assets

## Dependencies

- Vue 3
- vuedraggable - For drag and drop functionality
- vue3-toastify - For toast notifications

## Development

The development server will start at `http://localhost:5173` by default.

## Production Build

To create a production build, run:

```bash
yarn build
```

The built files will be in the `dist` directory.

## License

MIT
