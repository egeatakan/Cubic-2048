import { useRef, useEffect, Suspense } from 'react';
import { Box, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { Tile } from '../lib/game';
import { Theme } from '../lib/themes';

type AnimatedTileProps = {
  tile: Tile;
  gridSize: number;
  theme: Theme;
};

export function AnimatedTile({ tile, gridSize, theme }: AnimatedTileProps) {
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

  return (
    <group ref={groupRef}>
      <Box castShadow>
        <meshStandardMaterial color={color} />
      </Box>
      <Suspense fallback={null}>
        <Text3D font={'/fonts/helvetiker_regular.typeface.json'} position={[-0.3, -0.2, 0.51]} size={0.5} height={0.1}>
          {tile.value.toString()}
        </Text3D>
      </Suspense>
    </group>
  );
}
