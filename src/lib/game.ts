import { playMoveSound, playMergeSound, playGameOverSound } from './audio';

export type Tile = {
  id: number;
  position: [number, number, number];
  value: number;
  merged?: boolean;
};

export type Grid = (Tile | null)[][][];

let nextId = 1;

export enum Direction {
  LEFT, // -x
  RIGHT, // +x
  DOWN, // -y
  UP, // +y
  BACK, // -z
  FRONT, // +z
}

export function createInitialGrid(gridSize: number): Grid {
  const grid: Grid = Array(gridSize)
    .fill(null)
    .map(() =>
      Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(null))
    );
  return grid;
}

export function generateNextTileValue(): number {
  return Math.random() < 0.9 ? 2 : 4;
}

export function addRandomTile(grid: Grid, gridSize: number, value: number): Grid {
  const emptyCells: [number, number, number][] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        if (grid[x][y][z] === null) {
          emptyCells.push([x, y, z]);
        }
      }
    }
  }

  if (emptyCells.length === 0) {
    return grid;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const [x, y, z] = emptyCells[randomIndex];
  const newTile: Tile = {
    id: nextId++,
    position: [x, y, z],
    value,
  };

  const newGrid = JSON.parse(JSON.stringify(grid));
  newGrid[x][y][z] = newTile;
  return newGrid;
}

export type MoveResult = {
  grid: Grid;
  score: number;
  nextTileValue: number;
};

export function move(grid: Grid, direction: Direction, gridSize: number, nextTileValue: number): MoveResult {
  const axis = Math.floor(direction / 2); // 0 for X, 1 for Y, 2 for Z
  const isPositive = direction % 2 === 1;
  return moveAlongAxis(grid, axis, isPositive, gridSize, nextTileValue);
}

function moveAlongAxis(grid: Grid, axis: number, isPositive: boolean, gridSize: number, nextTileValue: number): MoveResult {
  const newGrid = createInitialGrid(gridSize);
  let moved = false;
  let score = 0;

  const d0 = (axis + 1) % 3;
  const d1 = (axis + 2) % 3;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const line: (Tile | null)[] = [];
      const coords: [number, number, number][] = [];

      for (let k = 0; k < gridSize; k++) {
        const pos: [number, number, number] = [0, 0, 0];
        pos[axis] = k;
        pos[d0] = i;
        pos[d1] = j;
        coords.push(pos);
        line.push(grid[pos[0]][pos[1]][pos[2]]);
      }

      const { newLine, score: lineScore } = slideAndMerge(line, isPositive, gridSize);
      score += lineScore;

      for (let k = 0; k < gridSize; k++) {
        if (line[k] !== newLine[k]) moved = true;
        if (newLine[k]) {
          const pos = coords[k];
          newGrid[pos[0]][pos[1]][pos[2]] = { ...newLine[k]!, position: pos };
        }
      }
    }
  }

  if (moved) {
    playMoveSound();
    const newNextTileValue = generateNextTileValue();
    const gridWithNewTile = addRandomTile(newGrid, gridSize, nextTileValue);
    return { grid: gridWithNewTile, score, nextTileValue: newNextTileValue };
  }
  return { grid, score: 0, nextTileValue };
}

function slideAndMerge(
  line: (Tile | null)[],
  toEnd: boolean,
  gridSize: number
): { newLine: (Tile | null)[]; score: number } {
  const tiles = line.filter(Boolean) as Tile[];
  if (toEnd) {
    tiles.reverse();
  }

  const merged: Tile[] = [];
  let score = 0;
  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const newValue = tiles[i].value * 2;
      score += newValue;
      merged.push({ ...tiles[i], value: newValue, id: nextId++, merged: true });
      playMergeSound();
      i += 2;
    } else {
      merged.push(tiles[i]);
      i++;
    }
  }

  const result: (Tile | null)[] = Array(gridSize).fill(null);
  for (let j = 0; j < merged.length; j++) {
    if (toEnd) {
      result[gridSize - 1 - j] = merged[j];
    } else {
      result[j] = merged[j];
    }
  }

  return { newLine: result, score };
}

export function isGameOver(grid: Grid, gridSize: number): boolean {
  // Check for empty cells
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        if (grid[x][y][z] === null) {
          return false;
        }
      }
    }
  }

  // Check for possible merges
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const tile = grid[x][y][z];
        if (tile) {
          // Check neighbors
          if (x > 0 && grid[x - 1][y][z]?.value === tile.value) return false;
          if (x < gridSize - 1 && grid[x + 1][y][z]?.value === tile.value) return false;
          if (y > 0 && grid[x][y - 1][z]?.value === tile.value) return false;
          if (y < gridSize - 1 && grid[x][y + 1][z]?.value === tile.value) return false;
          if (z > 0 && grid[x][y][z - 1]?.value === tile.value) return false;
          if (z < gridSize - 1 && grid[x][y][z + 1]?.value === tile.value) return false;
        }
      }
    }
  }

  return true;
}