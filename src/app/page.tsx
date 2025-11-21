'use client';

import { useState, useEffect, useCallback } from 'react';
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
  // --- YENİ EKLENEN STATE (Build hatasını önler) ---
  const [isMounted, setIsMounted] = useState(false);
  // ------------------------------------------------

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
  }, [gridSize, setNextTileValue, setGrid, setScore, setGameOver]);

  useEffect(() => {
    // --- MOUNT KONTROLÜ ---
    setIsMounted(true);
    // ----------------------

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
  }, [startGame]);

  useEffect(() => {
    startGame();
  }, [gridSize, startGame]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
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
  }, [gameOver, grid, gridSize, nextTileValue, score, highScore, setGrid, setNextTileValue, setScore, setGameOver, setHighScore]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  
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

  // --- ÖNEMLİ: Eğer sayfa henüz yüklenmediyse render etme ---
  // Bu satır "TypeError: Cannot redefine property: default" hatasını çözer.
  if (!isMounted) return null;
  // ----------------------------------------------------------

  return (
    <>
      <div style={{ position: 'absolute', top: '10px', right: '20px', zIndex: 200 }}>
        <button onClick={() => setIsPanelOpen(!isPanelOpen)} style={{ padding: '10px 15px', borderRadius: '5px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>
          {isPanelOpen ? 'Close Info' : 'Open Info'}
        </button>
      </div>

      {isPanelOpen && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '20px',
          width: '300px',
          padding: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: theme.textColor,
          borderRadius: '10px',
          zIndex: 150,
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto'
        }}>
          <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Score</h3>
              <button onClick={() => setIsScoreOpen(!isScoreOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>
                {isScoreOpen ? '−' : '+'}
              </button>
            </div>
            {isScoreOpen && <Score score={score} highScore={highScore} theme={theme} />}
          </div>
          <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Next Tile</h3>
              <button onClick={() => setIsNextTileOpen(!isNextTileOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>
                {isNextTileOpen ? '−' : '+'}
              </button>
            </div>
            {isNextTileOpen && <NextTile value={nextTileValue} theme={theme} />}
          </div>
          <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Instructions</h3>
              <button onClick={() => setIsInstructionsOpen(!isInstructionsOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>
                {isInstructionsOpen ? '−' : '+'}
              </button>
            </div>
            {isInstructionsOpen && <Instructions />}
          </div>
          <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Grid Size</h3>
              <button onClick={() => setIsGridSizeOpen(!isGridSizeOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>
                {isGridSizeOpen ? '−' : '+'}
              </button>
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
              <button onClick={() => setIsThemesOpen(!isThemesOpen)} style={{ background: 'none', border: 'none', color: theme.textColor, fontSize: '1.2em', cursor: 'pointer' }}>
                {isThemesOpen ? '−' : '+'}
              </button>
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
        <GameBoard grid={grid} gridSize={gridSize} theme={theme} />
        <OrbitControls />
      </Canvas>
    </>
  );
}