import { useTexture } from '@react-three/drei';
import { RepeatWrapping } from 'three';

import { Theme } from '../lib/themes';

type BackgroundProps = {
  theme: Theme;
};

export function Background({ theme }: BackgroundProps) {
  return <color attach="background" args={[theme.backgroundColor]} />;
}
