import { Theme } from '../lib/themes';

type ScoreProps = {
  score: number;
  highScore: number;
  theme: Theme;
};

export function Score({ score, highScore, theme }: ScoreProps) {
  return (
    <div style={{
      color: theme.textColor,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '10px 20px',
      borderRadius: '10px',
      fontFamily: 'sans-serif',
      textAlign: 'left'
    }}>
      <div style={{ fontSize: '1.2em' }}>Score: {score}</div>
      <div style={{ fontSize: '1.2em' }}>High Score: {highScore}</div>
    </div>
  );
}
