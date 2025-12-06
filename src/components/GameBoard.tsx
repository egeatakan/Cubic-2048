import { Box } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { Grid } from '../lib/game';
import { AnimatedTile } from './AnimatedTile';
import { Theme } from '../lib/themes';

type GameBoardProps = {
  grid: Grid;
  gridSize: number;
  theme: Theme;
  rotationAngle: number;
};

export function GameBoard({ grid, gridSize, theme, rotationAngle }: GameBoardProps) {
  const size = gridSize;
  const { camera } = useThree();
  const cameraTarget = useRef(new Vector3(0, 0, 0));

  useEffect(() => {
    const distance = size * 2;
    camera.position.set(0, size, distance);
    camera.lookAt(cameraTarget.current);
  }, [camera, size]);

  useFrame(() => {
    const angle = (rotationAngle * Math.PI) / 180;
    const distance = size * 2;
    const targetPosition = new Vector3(
      distance * Math.sin(angle),
      size,
      distance * Math.cos(angle)
    );

    camera.position.lerp(targetPosition, 0.1);
    camera.lookAt(cameraTarget.current);
  });

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
