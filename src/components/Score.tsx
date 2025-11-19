type ScoreProps = {
  score: number;
  highScore: number;
};

export function Score({ score, highScore }: ScoreProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '10px 20px',
      borderRadius: '10px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ marginTop: 0, marginBottom: '10px', fontSize: '2em' }}>Cubic 2048</h1>
      <div style={{ fontSize: '1.2em' }}>Score: {score}</div>
      <div style={{ fontSize: '1.2em' }}>High Score: {highScore}</div>
    </div>
  );
}
