import { useEffect, useRef } from 'react';
interface Props {
  INITIAL_TIME: number;
  points: number;
  timeLeft: number;
  isGamePaused: boolean;
  setGamePause(val: boolean): void;
  handlePlayAgain: () => void;
  handleQuitGame: () => void;
  gameEnded: boolean;
}

const Modal = ({
  INITIAL_TIME,
  points,
  timeLeft,
  isGamePaused,
  setGamePause,
  handlePlayAgain,
  handleQuitGame,
  gameEnded,
}: Props) => {
  const countUpPointsRef = useRef<HTMLInputElement>(null!);
  const countdownTimeRef = useRef<HTMLInputElement>(null!);
  const countUpTotalRef = useRef<HTMLInputElement>(null!);

  const initCount = async (
    target: React.MutableRefObject<HTMLInputElement>,
    startVal: number,
    endVal: number,
  ) => {
    const countUpModule = await import('countup.js');
    const count = new countUpModule.CountUp(target.current, endVal, {
      startVal,
    });
    if (!count.error) {
      count.start();
    } else {
      console.error(count.error);
    }
  };

  const timeout = (waitTime: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, waitTime);
    });
  };

  useEffect(() => {
    if (!gameEnded) return;

    (async () => {
      await timeout(500);
      initCount(countUpPointsRef, 0, points);
      await timeout(1500);
      initCount(countdownTimeRef, INITIAL_TIME, timeLeft);
      await timeout(1500);
      initCount(countUpTotalRef, 0, timeLeft * 2 + points);
    })();
  }, [gameEnded]);

  return (
    <div className="fixed left-0 top-0 h-screen w-screen backdrop-blur-[1px]">
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black px-10 py-5 font-bold text-white">
        <div className="flex h-full flex-col justify-around">
          <p>
            POINTS{' '}
            <span className="float-right" ref={countUpPointsRef}>
              {gameEnded ? 0 : points}
            </span>
          </p>
          <p>
            TIME LEFT{' '}
            <span className="float-right" ref={countdownTimeRef}>
              {gameEnded ? INITIAL_TIME : timeLeft}
            </span>
          </p>
          <p className={`${gameEnded ? '' : 'hidden'} glowing`}>
            TOTAL
            <span className="glowing float-right" ref={countUpTotalRef}>
              0
            </span>
          </p>
          <div className="item-center flex justify-between text-lg">
            {isGamePaused ? (
              <button
                onClick={() => setGamePause(false)}
                className="hover:glowing mx-auto rounded-2xl bg-white px-4 py-2 text-red600 shadow-sm shadow-white"
              >
                Resume
              </button>
            ) : (
              <>
                <button
                  onClick={handlePlayAgain}
                  className="hover:glowing rounded-2xl bg-white px-4 py-2 text-red600 shadow-sm shadow-white"
                >
                  Play Again
                </button>
                <button
                  onClick={handleQuitGame}
                  className="hover:glowing rounded-2xl bg-white px-4 py-2 text-red600 shadow-sm shadow-white"
                >
                  Quit Game
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
