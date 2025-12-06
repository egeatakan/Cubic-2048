'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Vector3, Camera } from 'three';
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

// Helper component to get a reference to the main camera object
function CameraRef({ cameraRef }: { cameraRef: React.MutableRefObject<Camera | null> }) {
  const { camera } = useThree();
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera, cameraRef]);
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

  const cameraRef = useRef<Camera | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

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

  useEffect(() => {
    const container = gameContainerRef.current;
    if (!container) return;

    const getPointerCoords = (e: TouchEvent | MouseEvent): { x: number; y: number } => {
      if (window.TouchEvent && e instanceof TouchEvent) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };
    
    const worldAxes = [
      { dir: Direction.RIGHT, vec: new Vector3(1, 0, 0) },
      { dir: Direction.LEFT,  vec: new Vector3(-1, 0, 0) },
      { dir: Direction.UP,    vec: new Vector3(0, 1, 0) },
      { dir: Direction.DOWN,  vec: new Vector3(0, -1, 0) },
    ];

    const getDirectionFromVector = (targetVector: Vector3): Direction => {
      let bestDir = Direction.UP;
      let maxDot = -Infinity;
      for (const axis of worldAxes) {
        const dot = targetVector.dot(axis.vec);
        if (dot > maxDot) {
          maxDot = dot;
          bestDir = axis.dir;
        }
      }
      return bestDir;
    }

    const handleSwipeStart = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      touchStartPos.current = getPointerCoords(e);
    };

    const handleSwipeEnd = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      const camera = cameraRef.current;
      if (!touchStartPos.current || !camera) return;

      const endPos = getPointerCoords(e);
      const startPos = touchStartPos.current;
      touchStartPos.current = null;

      const deltaX = endPos.x - startPos.x;
      const deltaY = endPos.y - startPos.y;

      if (Math.sqrt(deltaX ** 2 + deltaY ** 2) < 30) return; // Deadzone

      // Get LIVE camera vectors
      camera.updateMatrixWorld();
      const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);

      // Create target vector from swipe deltas and live camera vectors
      const targetVector = new Vector3();
      targetVector.addScaledVector(right, deltaX);
      targetVector.addScaledVector(up, -deltaY); // -deltaY inverts screen Y-axis
      targetVector.normalize();
      
      const direction = getDirectionFromVector(targetVector);
      moveBlocks(direction);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: { [key: string]: 'up' | 'down' | 'left' | 'right' | undefined } = {
        w: 'up', s: 'down', a: 'left', d: 'right',
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      };
      const input = keyMap[event.key];
      const camera = cameraRef.current;
      if (input && camera) {
        event.preventDefault();
        
        // Get LIVE camera vectors
        camera.updateMatrixWorld();
        const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
        const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
        let targetVector: Vector3;

        switch(input) {
          case 'up': targetVector = up; break;
          case 'down': targetVector = up.clone().negate(); break;
          case 'left': targetVector = right.clone().negate(); break;
          case 'right': targetVector = right; break;
        }

        const direction = getDirectionFromVector(targetVector);
        moveBlocks(direction);
      }
    };

    container.addEventListener('touchstart', handleSwipeStart, { passive: false });
    container.addEventListener('touchend', handleSwipeEnd, { passive: false });
    container.addEventListener('mousedown', handleSwipeStart, { passive: false });
    container.addEventListener('mouseup', handleSwipeEnd, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('touchstart', handleSwipeStart);
      container.removeEventListener('touchend', handleSwipeEnd);
      container.removeEventListener('mousedown', handleSwipeStart);
      container.removeEventListener('mouseup', handleSwipeEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moveBlocks]);

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
    <div ref={gameContainerRef} style={{ width: '100vw', height: '100vh', touchAction: 'none' }}>
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
        <CameraRef cameraRef={cameraRef} />
      </Canvas>
    </div>
  );
}