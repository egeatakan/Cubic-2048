import { Box } from '@react-three/drei';
import { Grid } from '../lib/game';
import { AnimatedTile } from './AnimatedTile';
import { Theme } from '../lib/themes';

type GameBoardProps = {
  grid: Grid;
  gridSize: number;
  theme: Theme;
};

export function GameBoard({ grid, gridSize, theme }: GameBoardProps) {
  const size = gridSize;

  const cells = [];
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        cells.push(
          <Box key={`cell-${x}-${y}-${z}`} position={[x - size / 2 + 0.5, y - size / 2 + 0.5, z - size / 2 + 0.5]}>
            <meshStandardMaterial color={theme.gridColor} transparent opacity={0.1} />
          </Box>
        );
      }
    }
  }

  const tiles = grid.flat(2).filter(Boolean).map((tile: any) => (
    <AnimatedTile key={`tile-${tile.id}`} tile={tile} gridSize={gridSize} theme={theme} />
  ));

  return <group>{cells}{tiles}</group>;
}
