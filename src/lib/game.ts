export type Tile = {
  id: number;
  position: [number, number, number];
  value: number;
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

export function addRandomTile(grid: Grid, gridSize: number): Grid {
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
  const value = Math.random() < 0.9 ? 2 : 4;
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
};

export function move(grid: Grid, direction: Direction, gridSize: number): MoveResult {
  switch (direction) {
    case Direction.LEFT:
      return moveX(grid, false, gridSize);
    case Direction.RIGHT:
      return moveX(grid, true, gridSize);
    case Direction.DOWN:
      return moveY(grid, false, gridSize);
    case Direction.UP:
      return moveY(grid, true, gridSize);
    case Direction.BACK:
      return moveZ(grid, false, gridSize);
    case Direction.FRONT:
      return moveZ(grid, true, gridSize);
  }
}

function moveX(grid: Grid, isPositive: boolean, gridSize: number): MoveResult {
  const newGrid = createInitialGrid(gridSize);
  let moved = false;
  let score = 0;
  for (let y = 0; y < gridSize; y++) {
    for (let z = 0; z < gridSize; z++) {
      const line = grid.map((slice) => slice[y][z]);
      const { newLine, score: lineScore } = slideAndMerge(line, isPositive, gridSize);
      score += lineScore;
      for (let x = 0; x < gridSize; x++) {
        if (line[x] !== newLine[x]) moved = true;
        if (newLine[x]) {
          newGrid[x][y][z] = { ...newLine[x]!, position: [x, y, z] };
        }
      }
    }
  }
  if (moved) {
    return { grid: addRandomTile(newGrid, gridSize), score };
  }
  return { grid, score: 0 };
}

function moveY(grid: Grid, isPositive: boolean, gridSize: number): MoveResult {
  const newGrid = createInitialGrid(gridSize);
  let moved = false;
  let score = 0;
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const line: (Tile | null)[] = [];
      for (let y = 0; y < gridSize; y++) {
        line.push(grid[x][y][z]);
      }
      const { newLine, score: lineScore } = slideAndMerge(line, isPositive, gridSize);
      score += lineScore;
      for (let y = 0; y < gridSize; y++) {
        if (line[y] !== newLine[y]) moved = true;
        if (newLine[y]) {
          newGrid[x][y][z] = { ...newLine[y]!, position: [x, y, z] };
        }
      }
    }
  }
  if (moved) {
    return { grid: addRandomTile(newGrid, gridSize), score };
  }
  return { grid, score: 0 };
}

function moveZ(grid: Grid, isPositive: boolean, gridSize: number): MoveResult {
  const newGrid = createInitialGrid(gridSize);
  let moved = false;
  let score = 0;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const line = grid[x][y];
      const { newLine, score: lineScore } = slideAndMerge(line, isPositive, gridSize);
      score += lineScore;
      for (let z = 0; z < gridSize; z++) {
        if (line[z] !== newLine[z]) moved = true;
        if (newLine[z]) {
          newGrid[x][y][z] = { ...newLine[z]!, position: [x, y, z] };
        }
      }
    }
  }
  if (moved) {
    return { grid: addRandomTile(newGrid, gridSize), score };
  }
  return { grid, score: 0 };
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
      merged.push({ ...tiles[i], value: newValue, id: nextId++ });
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
