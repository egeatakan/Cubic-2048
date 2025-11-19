import { useRef, useEffect } from 'react';
import { Box, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { Tile } from '../lib/game';

type AnimatedTileProps = {
  tile: Tile;
  gridSize: number;
};

const colorMap: { [key: number]: string } = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

export function AnimatedTile({ tile, gridSize }: AnimatedTileProps) {
  const groupRef = useRef<Group>(null!);
  const targetPosition = new Vector3(
    tile.position[0] - gridSize / 2 + 0.5,
    tile.position[1] - gridSize / 2 + 0.5,
    tile.position[2] - gridSize / 2 + 0.5
  );

  useEffect(() => {
    groupRef.current.scale.set(0, 0, 0);
    groupRef.current.position.copy(targetPosition);
  }, [tile.id, targetPosition]);

  useFrame(() => {
    groupRef.current.position.lerp(targetPosition, 0.1);
    groupRef.current.scale.lerp(new Vector3(1, 1, 1), 0.1);
  });

  return (
    <group ref={groupRef}>
      <Box>
        <meshStandardMaterial color={colorMap[tile.value] || '#333'} />
      </Box>
      <Text
        position={[0, 0, 0.51]}
        fontSize={0.4}
        color={tile.value > 4 ? 'white' : 'black'}
        anchorX="center"
        anchorY="middle"
      >
        {tile.value}
      </Text>
    </group>
  );
}
