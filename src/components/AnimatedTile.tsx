import { useRef, useEffect, useMemo } from 'react';
import { Box, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { Tile } from '../lib/game';
import { Theme } from '../lib/themes';
import { FC } from 'react';

type AnimatedTileProps = {
  tile: Tile;
  gridSize: number;
  theme: Theme;
};


interface TileTextProps {
  value: string | number; // Yazı veya sayı olabilir
  color: string;
  [key: string]: any; // Diğer tüm props'ları kabul et
}

// @ts-ignore
const TileText = ({ value, color, ...props }: any) => (
  <Text
    {...props}
    fontSize={0.5}
    color={color}
    anchorX="center"
    anchorY="middle"
  >
    {value}
  </Text>
);

export function AnimatedTile({ tile, gridSize, theme }: AnimatedTileProps) {
  const groupRef = useRef<Group>(null!);
  
  const targetPosition = useMemo(() => new Vector3(
    tile.position[0] - gridSize / 2 + 0.5,
    tile.position[1] - gridSize / 2 + 0.5,
    tile.position[2] - gridSize / 2 + 0.5
  ), [tile.position, gridSize]);

  useEffect(() => {
    groupRef.current.scale.set(0, 0, 0);
    groupRef.current.position.copy(targetPosition);
  }, [tile.id, targetPosition]);

  useFrame((state, delta) => {
    groupRef.current.position.lerp(targetPosition, 0.1);

    if (tile.merged) {
      const pulse = Math.sin(state.clock.elapsedTime * 10) * 0.1 + 1;
      groupRef.current.scale.lerp(new Vector3(pulse, pulse, pulse), 0.2);
    } else {
      groupRef.current.scale.lerp(new Vector3(1, 1, 1), 0.1);
    }
  });

  const color = theme.tileColors[tile.value] || '#333';
  const textColor = tile.value > 4 ? '#f9f6f2' : '#776e65';

  return (
    <group ref={groupRef}>
      <Box castShadow>
        <meshStandardMaterial color={color} />
      </Box>
      <TileText value={tile.value} color={textColor} position={[0, 0, 0.51]} />
      <TileText value={tile.value} color={textColor} position={[0, 0, -0.51]} rotation={[0, Math.PI, 0]} />
      <TileText value={tile.value} color={textColor} position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <TileText value={tile.value} color={textColor} position={[0, -0.51, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <TileText value={tile.value} color={textColor} position={[0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <TileText value={tile.value} color={textColor} position={[-0.51, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}
