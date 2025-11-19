# System Patterns

The application will be a single-page application (SPA) built with Next.js and React. The 3D rendering will be handled by `three.js` and `@react-three/fiber`.

The main components will be:
- `GameBoard`: The main component that houses the 3D scene and the game logic.
- `Cube`: A component representing a single cube with a number value.
- `Score`: A UI component to display the current score.
- `GameOver`: A UI component to display the game over screen.

The game state will be managed within the `GameBoard` component.
