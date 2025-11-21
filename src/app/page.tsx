'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameBoard } from '../components/GameBoard';
import { createInitialGrid, Grid, addRandomTile, move, Direction, MoveResult, isGameOver, generateNextTileValue } from '../lib/game';
import { playGameOverSound } from '../lib/audio';
import { Score } from '../components/Score';
import { GameOver } from '../components/GameOver';
import { Instructions } from '../components/Instructions';
import { themes, Theme } from '../lib/themes';
import { Background } from '../components/Background';
import { ThemeEditor } from '../components/ThemeEditor';
import { NextTile } from '../components/NextTile';

export default function Home() {
  const [gridSize, setGridSize] = useState(4);
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [theme, setTheme] = useState<Theme>(themes.default);
  const [customTheme, setCustomTheme] = useState<Theme>(themes.custom);
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [nextTileValue, setNextTileValue] = useState(2);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && themes[storedTheme]) {
      setTheme(themes[storedTheme]);
    }
    const storedCustomTheme = localStorage.getItem('customTheme');
    if (storedCustomTheme) {
      setCustomTheme(JSON.parse(storedCustomTheme));
    }
    startGame();
  }, []);

  const changeTheme = (themeName: string) => {
    if (themeName === 'custom') {
      setTheme(customTheme);
    } else if (themes[themeName]) {
      setTheme(themes[themeName]);
    }
    localStorage.setItem('theme', themeName);
  };

  const handleCustomThemeChange = (newTheme: Theme) => {
    setCustomTheme(newTheme);
    if (theme.name === 'Custom') {
      setTheme(newTheme);
    }
    localStorage.setItem('customTheme', JSON.stringify(newTheme));
  };

  const startGame = () => {
    let newGrid = createInitialGrid(gridSize);
    const firstTileValue = generateNextTileValue();
    const secondTileValue = generateNextTileValue();
    newGrid = addRandomTile(newGrid, gridSize, firstTileValue);
    newGrid = addRandomTile(newGrid, gridSize, secondTileValue);
    setNextTileValue(generateNextTileValue());
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    startGame();
  }, [gridSize]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver) return;

    const keyMap: { [key: string]: Direction } = {
      ArrowRight: Direction.RIGHT,
      ArrowLeft: Direction.LEFT,
      ArrowUp: Direction.UP,
      ArrowDown: Direction.DOWN,
      w: Direction.FRONT,
      s: Direction.BACK,
    };

    const direction = keyMap[event.key];
    if (direction !== undefined) {
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
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid, score, gameOver, gridSize, highScore, nextTileValue]);

  return (
    <>
      <Score score={score} highScore={highScore} theme={theme} />
      <NextTile value={nextTileValue} theme={theme} />
      {gameOver && <GameOver onRestart={startGame} />}
      {isThemeEditorOpen && <ThemeEditor theme={customTheme} onThemeChange={handleCustomThemeChange} onClose={() => setIsThemeEditorOpen(false)} />}
      <Instructions />
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 100 }}>
        <button onClick={() => setGridSize(3)} disabled={gridSize === 3} style={{marginRight: '10px'}}>3x3</button>
        <button onClick={() => setGridSize(4)} disabled={gridSize === 4}>4x4</button>
      </div>
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 100 }}>
        {Object.keys(themes).map((themeName) => (
          <button key={themeName} onClick={() => changeTheme(themeName)} disabled={theme.name === themes[themeName].name} style={{marginLeft: '10px'}}>
            {themes[themeName].name}
          </button>
        ))}
        <button onClick={() => setIsThemeEditorOpen(true)} style={{marginLeft: '10px'}}>Edit Theme</button>
      </div>
      <Canvas shadows>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} castShadow />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Background theme={theme} />
        <GameBoard grid={grid} gridSize={gridSize} theme={theme} />
        <OrbitControls />
      </Canvas>
    </>
  );
}
