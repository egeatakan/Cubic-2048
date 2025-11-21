import { Text } from '@react-three/drei';
import { Theme } from '../lib/themes';

type NextTileProps = {
  value: number;
  theme: Theme;
};

export function NextTile({ value, theme }: NextTileProps) {
  const color = theme.tileColors[value] || '#333';
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      color: theme.textColor,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '10px 20px',
      borderRadius: '10px',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '1.2em' }}>Next Tile</div>
      <div style={{
        width: '50px',
        height: '50px',
        backgroundColor: color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5em',
        fontWeight: 'bold',
        borderRadius: '5px',
        marginTop: '10px',
        color: value > 4 ? theme.textColor : 'black'
      }}>
        {value}
      </div>
    </div>
  );
}
