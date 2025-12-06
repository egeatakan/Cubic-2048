'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Vector2, Vector3 } from 'three';
import { useGesture } from '@use-gesture/react';
import { GameBoard } from './GameBoard';
import { Score } from './Score';
import { GameOver } from './GameOver';
import { Instructions } from './Instructions';
import { Background } from './Background';
import { ThemeEditor } from './ThemeEditor';
import { NextTile } from './NextTile';
import { createInitialGrid, Grid, addRandomTile, move, Direction, isGameOver, generateNextTileValue } from '../lib/game';
import { playGameOverSound } from '../lib/audio';
import { themes, Theme } from '../lib/themes';

// Helper component to report camera vectors
function CameraReporter({ onCameraUpdate }: { onCameraUpdate: (fwd: Vector2, right: Vector2) => void }) {
  const { camera } = useThree();
  const forward = new Vector3();
  const right = new Vector3();

  useFrame(() => {
    // Get camera's forward direction
    camera.getWorldDirection(forward);
    // Project onto XY plane and normalize
    const forward2D = new Vector2(forward.x, forward.y).normalize();

    // Get camera's right direction
    right.crossVectors(camera.up, forward).normalize();
    // Project onto XY plane and normalize
    const right2D = new Vector2(right.x, right.y).normalize();

    onCameraUpdate(forward2D, right2D);
  });

  return null;
}

export default function Game() {
  const [gridSize, setGridSize] = useState(4);
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [theme, setTheme] = useState<Theme>(themes.default);
  const [customTheme, setCustomTheme] = useState<Theme>(themes.custom);
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [nextTileValue, setNextTileValue] = useState(2);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isScoreOpen, setIsScoreOpen] = useState(true);
  const [isNextTileOpen, setIsNextTileOpen] = useState(true);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [isGridSizeOpen, setIsGridSizeOpen] = useState(true);
  const [isThemesOpen, setIsThemesOpen] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);

  const cameraVectors = useRef({ fwd: new Vector2(), right: new Vector2() });

  const startGame = useCallback(() => {
    let newGrid = createInitialGrid(gridSize);
    const firstTileValue = generateNextTileValue();
    const secondTileValue = generateNextTileValue();
    newGrid = addRandomTile(newGrid, gridSize, firstTileValue);
    newGrid = addRandomTile(newGrid, gridSize, secondTileValue);
    setNextTileValue(generateNextTileValue());
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  }, [gridSize]);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) setHighScore(parseInt(storedHighScore, 10));
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && themes[storedTheme]) setTheme(themes[storedTheme]);
    const storedCustomTheme = localStorage.getItem('customTheme');
    if (storedCustomTheme) setCustomTheme(JSON.parse(storedCustomTheme));
    startGame();
  }, [startGame]);
  
  useEffect(() => {
    startGame();
  }, [gridSize, startGame]);

  const moveBlocks = useCallback((direction: Direction) => {
    if (gameOver) return;

    const result = move(grid, direction, gridSize, nextTileValue);
    if (result) {
      setGrid(result.grid);
      setNextTileValue(result.nextTileValue);
      const newScore = score + result.score;
      setScore(newScore);
      if (isGameOver(result.grid, gridSize)) {
        setGameOver(true);
        playGameOverSound();
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('highScore', newScore.toString());
        }
      }
    }
  }, [gameOver, grid, gridSize, nextTileValue, score, highScore]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const keyMap: { [key: string]: Direction | undefined } = {
      w: Direction.UP,
      s: Direction.DOWN,
      a: Direction.LEFT,
      d: Direction.RIGHT,
      ArrowUp: Direction.UP,
      ArrowDown: Direction.DOWN,
      ArrowLeft: Direction.LEFT,
      ArrowRight: Direction.RIGHT,
    };
    const direction = keyMap[event.key];
    if (direction !== undefined) {
      moveBlocks(direction);
    }
  }, [moveBlocks]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const bind = useGesture({
    onSwipe: ({ down, movement: [mx, my], distance, cancel }) => {
      if (down && distance > 30) {
        const swipe = new Vector2(mx, my);
        // Screen Y is inverted, so a downward swipe has a positive Y.
        // We want a visually upward swipe to correspond to the camera's forward.
        const swipeDirection = new Vector2(swipe.x, -swipe.y).normalize();

        const { fwd, right } = cameraVectors.current;

        const dotForward = swipeDirection.dot(fwd);
        const dotRight = swipeDirection.dot(right);

        let intendedVec: Vector2;

        // Determine if swipe is more vertical or horizontal from camera's perspective
        if (Math.abs(dotForward) > Math.abs(dotRight)) {
            intendedVec = fwd.clone().multiplyScalar(Math.sign(dotForward));
        } else {
            intendedVec = right.clone().multiplyScalar(Math.sign(dotRight));
        }
        
        // Map the intended vector to the closest world axis
        const worldAxes = [
            { dir: Direction.UP, vec: new Vector2(0, 1) },
            { dir: Direction.DOWN, vec: new Vector2(0, -1) },
            { dir: Direction.RIGHT, vec: new Vector2(1, 0) },
            { dir: Direction.LEFT, vec: new Vector2(-1, 0) },
        ];

        let bestDir = Direction.UP;
        let maxDot = -Infinity;

        for (const axis of worldAxes) {
            const dot = intendedVec.dot(axis.vec);
            if (dot > maxDot) {
                maxDot = dot;
                bestDir = axis.dir;
            }
        }
        
        moveBlocks(bestDir);
        cancel();
      }
    },
  });

  const rotateLeft = () => setRotationAngle((prev) => (prev - 90 + 360) % 360);
  const rotateRight = () => setRotationAngle((prev) => (prev + 90) % 360);
  
  const changeTheme = (themeName: string) => {
    if (themes[themeName]) {
      setTheme(themes[themeName]);
      localStorage.setItem('theme', themeName);
    }
  };

  const handleCustomThemeChange = (newTheme: Theme) => {
    setCustomTheme(newTheme);
    setTheme(newTheme);
    localStorage.setItem('customTheme', JSON.stringify(newTheme));
  };

  return (
    <div {...bind()} style={{ width: '100vw', height: '100vh', touchAction: 'none' }}>
      <div style={{ position: 'absolute', top: '10px', right: '20px', zIndex: 200, display: 'flex', gap: '10px' }}>
        <button onClick={rotateLeft} style={{ padding: '10px', borderRadius: '5px', border: 'none', background: '#6c757d', color: 'white', cursor: 'pointer' }}>⟲</button>
        <button onClick={rotateRight} style={{ padding: '10px', borderRadius: '5px', border: 'none', background: '#6c757d', color: 'white', cursor: 'pointer' }}>⟳</button>
        <button onClick={() => setIsPanelOpen(!isPanelOpen)} style={{ padding: '10px 15px', borderRadius: '5px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>
          {isPanelOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {isPanelOpen && (
        <div style={{
          position: 'absolute', top: '60px', right: '20px', width: '300px', padding: '20px',
          background: 'rgba(0,0,0,0.8)', color: theme.textColor, borderRadius: '10px', zIndex: 150,
          display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto'
        }}>
          <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Score</h3>
              <button onClick={() => setIsScoreOpen(!isScoreOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>{isScoreOpen ? '−' : '+'}</button>
            </div>
            {isScoreOpen && <Score score={score} highScore={highScore} theme={theme} />}
          </div>
          <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Next Tile</h3>
              <button onClick={() => setIsNextTileOpen(!isNextTileOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>{isNextTileOpen ? '−' : '+'}</button>
            </div>
            {isNextTileOpen && <NextTile value={nextTileValue} theme={theme} />}
          </div>
          <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Instructions</h3>
              <button onClick={() => setIsInstructionsOpen(!isInstructionsOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>{isInstructionsOpen ? '−' : '+'}</button>
            </div>
            {isInstructionsOpen && <Instructions />}
          </div>
          <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Grid Size</h3>
              <button onClick={() => setIsGridSizeOpen(!isGridSizeOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>{isGridSizeOpen ? '−' : '+'}</button>
            </div>
            {isGridSizeOpen && (
              <div>
                <button onClick={() => setGridSize(3)} disabled={gridSize === 3} style={{marginRight: '10px'}}>3x3</button>
                <button onClick={() => setGridSize(4)} disabled={gridSize === 4}>4x4</button>
              </div>
            )}
          </div>
          <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Themes</h3>
              <button onClick={() => setIsThemesOpen(!isThemesOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>{isThemesOpen ? '−' : '+'}</button>
            </div>
            {isThemesOpen && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                  {Object.keys(themes).map((themeName) => (
                    <button key={themeName} onClick={() => changeTheme(themeName)} disabled={theme.name === themes[themeName].name} style={{ padding: '8px 12px', borderRadius: '5px', border: 'none', background: theme.name === themes[themeName].name ? '#28a745' : '#6c757d', color: 'white', cursor: 'pointer' }}>
                      {themes[themeName].name}
                    </button>
                  ))}
                </div>
                <button onClick={() => setIsThemeEditorOpen(true)} style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '5px', border: 'none', background: '#ffc107', color: 'black', cursor: 'pointer' }}>Edit Theme</button>
              </>
            )}
          </div>
        </div>
      )}

      {gameOver && <GameOver onRestart={startGame} />}
      {isThemeEditorOpen && <ThemeEditor theme={customTheme} onThemeChange={handleCustomThemeChange} onClose={() => setIsThemeEditorOpen(false)} />}
      
      <Canvas shadows>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} castShadow />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Background theme={theme} />
        <GameBoard grid={grid} gridSize={gridSize} theme={theme} rotationAngle={rotationAngle} />
        <CameraReporter onCameraUpdate={(fwd, right) => {
          cameraVectors.current = { fwd, right };
        }} />
      </Canvas>
    </div>
  );
}