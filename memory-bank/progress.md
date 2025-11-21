# Progress

## Phase 1: Project Setup & Basic 3D Scene
- [x] **Project Initialization:**
    - [x] Set up a new Next.js project.
    - [x] Install necessary dependencies: `three`, `@react-three/fiber`, `@react-three/drei`.
- [x] **Basic 3D Scene:**
    - [x] Create a `Canvas` component from `@react-three/fiber`.
    - [x] Add basic lighting (`ambientLight`, `pointLight`).
    - [x] Add a simple `Box` mesh to confirm the 3D scene is working.
    - [x] Implement `OrbitControls` for camera manipulation.
- [x] **Component Structure:**
    - [x] Create a `components` directory.
    - [x] Create placeholder files for `GameBoard.tsx`, `Tile.tsx`, `Score.tsx`, and `GameOver.tsx`.
- [x] **Game Logic Stub:**
    - [x] Create a `lib` directory.
    - [x] Create a `game.ts` file with placeholder functions for game logic (e.g., `createInitialGrid`, `move`).

## Phase 2: Core Game Board and Logic
- [x] **Game State Management:**
    - [x] Define the data structure for the 3D game grid (e.g., a 3D array).
    - [x] Implement state management (e.g., using `useState` or a state management library) to hold the grid and tile values.
- [x] **Game Board Rendering:**
    - [x] Create a `GameBoard` component to render the 3D grid structure.
    - [x] Create a `Tile` component that visually represents a number cube.
    - [x] Dynamically render `Tile` components on the `GameBoard` based on the game state.
- [x] **Player Input:**
    - [x] Implement controls to move tiles along the X, Y, and Z axes (e.g., using keyboard arrow keys and WASD).
- [x] **Game Settings:**
    - [x] Add UI elements (e.g., buttons) to allow the player to choose the grid size (3x3 or 4x4).

## Phase 3: Tile Merging, Scoring, and Game Over
- [x] **Tile Movement and Merging:**
    - [x] Implement the logic for sliding tiles in a given direction.
    - [x] Implement the logic for merging two tiles of the same value.
    - [x] Update the game state after a move and merge.
- [x] **Scoring:**
    - [x] Update the score when tiles are merged.
    - [x] Implement a high score system that persists across games (e.g., using `localStorage`).
- [x] **Game Over Condition:**
    - [x] Implement the logic to detect when no more moves are possible.
    - [x] Display a "Game Over" message or screen.
    - [x] Add a "Restart" button to start a new game.

## Phase 4: Animations and Visual Polish
- [x] **Tile Animations:**
    - [x] Animate the movement of tiles as they slide from one position to another.
    - [x] Animate the appearance of new tiles (e.g., scaling up).
    - [x] Animate the merging of tiles (e.g., a pulse or scale effect).
- [x] **UI/UX Improvements:**
    - [x] Improve the styling of the score and game over screens.
    - [x] Add a title and instructions to the game.
    - [x] Choose a visually appealing color scheme for the tiles.
- [x] **3D Scene Enhancements:**
    - [x] Add a background or environment to the scene.
    - [x] Experiment with different lighting and shadow configurations.
    - [x] Add post-processing effects for a more polished look. (Note: Could not add Bloom effect due to dependency restrictions)

## Phase 5: Sound and Final Touches
- [x] **Sound Effects:**
    - [x] Add sound effects for tile movement, merging, and game over.
- [x] **Code Refinement:**
    - [x] Review and refactor the code for clarity, performance, and maintainability.
    - [x] Add comments where necessary.
- [x] **Deployment:**
    - [x] Deploy the game to a hosting service (e.g., Vercel, Netlify).

## Phase 6: Themes
- [x] **Theme Data Structure:**
    - [x] Define a data structure for themes (e.g., an object with colors for tiles, background, etc.).
    - [x] Create a few default themes (e.g., "Dark", "Light", "Synthwave").
- [x] **Theme Selection UI:**
    - [x] Add a UI element (e.g., a dropdown or buttons) to allow the user to select a theme.
- [x] **Apply Theme:**
    - [x] Refactor the components to use the colors from the selected theme.

## Phase 7: Custom Theme Editor
- [x] **Custom Theme State:**
    - [x] Add state to manage a custom theme.
    - [x] Save and load the custom theme from `localStorage`.
- [x] **Theme Editor UI:**
    - [x] Create a new `ThemeEditor` component.
    - [x] Add color pickers for background, text, and grid colors.
    - [x] Add color pickers for each tile value.
- [x] **Apply Custom Theme:**
    - [x] Add a "Custom" theme option to the theme selector.
    - [x] When selected, apply the user-defined custom theme.

## Phase 8: Next Tile Indicator
- [x] **Game Logic:**
    - [x] Modify the game state to include the value of the next tile.
    - [x] Update the `addRandomTile` function to use and update the next tile value.
- [x] **UI Component:**
    - [x] Create a `NextTile` component to display the upcoming tile.
- [x] **Integration:**
    - [x] Add the `NextTile` component to the main game page.