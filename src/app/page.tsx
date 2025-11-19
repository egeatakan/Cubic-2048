'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameBoard } from '../components/GameBoard';
import { createInitialGrid, Grid, addRandomTile, move, Direction, MoveResult, isGameOver } from '../lib/game';
import { Score } from '../components/Score';
import { GameOver } from '../components/GameOver';
import { Instructions } from '../components/Instructions';

export default function Home() {
  const [gridSize, setGridSize] = useState(4);
  const [grid, setGrid] = useState<Grid>(createInitialGrid(gridSize));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  const startGame = () => {
    let newGrid = createInitialGrid(gridSize);
    newGrid = addRandomTile(newGrid, gridSize);
    newGrid = addRandomTile(newGrid, gridSize);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    startGame();
  }, [gridSize]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver) return;

    let result: MoveResult | null = null;
    switch (event.key) {
      case 'ArrowRight':
        result = move(grid, Direction.RIGHT, gridSize);
        break;
      case 'ArrowLeft':
        result = move(grid, Direction.LEFT, gridSize);
        break;
      case 'ArrowUp':
        result = move(grid, Direction.UP, gridSize);
        break;
      case 'ArrowDown':
        result = move(grid, Direction.DOWN, gridSize);
        break;
      case 'w':
        result = move(grid, Direction.FRONT, gridSize);
        break;
      case 's':
        result = move(grid, Direction.BACK, gridSize);
        break;
    }
    if (result) {
      setGrid(result.grid);
      const newScore = score + result.score;
      setScore(newScore);
      if (isGameOver(result.grid, gridSize)) {
        setGameOver(true);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('highScore', newScore.toString());
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid, score, gameOver, gridSize, highScore]);

  return (
    <>
      <Score score={score} highScore={highScore} />
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <button onClick={() => setGridSize(3)} disabled={gridSize === 3} style={{marginRight: '10px'}}>3x3</button>
        <button onClick={() => setGridSize(4)} disabled={gridSize === 4}>4x4</button>
      </div>
      {gameOver && <GameOver onRestart={startGame} />}
      <Instructions />
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <GameBoard grid={grid} gridSize={gridSize} />
        <OrbitControls />
      </Canvas>
    </>
  );
}
