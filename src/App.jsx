import { useEffect } from "react";
import { useState } from "react";

function App() {
  const height = Math.round(window.innerHeight);
  const width = Math.round(window.innerWidth);
  const pipeGapY = 150;
  const birdPositionX = Math.round(width / 2);

  const generatePipeY = () => {
    let newY = Math.round(Math.random() * 1000);
    while (newY > height - 100 || newY < 200)
      newY = Math.round(Math.random() * 1000);
    return newY;
  };

  const generatePipeX = (previousX = null) => {
    return previousX ? previousX + 200 : Math.round(width / 1.5);
  };
  const defaultPipes = [
    {
      num: 0,
      x: generatePipeX(),
      y: height / 2 + 50,
    },
  ];
  const defaultBirdPosition = Math.round(height / 2);
  const [birdPosition, setBirdPosition] = useState(defaultBirdPosition);
  const [pipes, setPipes] = useState(defaultPipes);
  const [passedPipes, setPassedPipes] = useState([]);
  const [isTouching, setIsTouching] = useState(false);

  const handleGameOver = () => {
    setBirdPosition(defaultBirdPosition);
    setPipes(defaultPipes);
    setPassedPipes([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.code === "Space" && setIsTouching(true);
    };

    const handleKeyUp = () => setIsTouching(false);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", () => setIsTouching(true));
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("touchend", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", () => setIsTouching(true));
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("touchend", handleKeyUp);
    };
  }, [birdPosition]);

  useEffect(() => {
    let moveUpIntervalId;
    if (isTouching) {
      moveUpIntervalId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + 2);
      }, 2);
    }

    return () => clearInterval(moveUpIntervalId);
  }, [isTouching]);

  useEffect(() => {
    const animationId = requestAnimationFrame(() => {
      const newPipes = [];
      pipes.map((pipe) => {
        newPipes.push({ ...pipe, x: pipe.x - 1 });
      });
      if (pipes.length < 10) {
        const latestPipe = pipes[pipes.length - 1];
        newPipes.push({
          num: latestPipe.num + 1,
          y: generatePipeY(),
          x: generatePipeX(latestPipe.x),
        });
      }
      if (pipes[0].x < -100) newPipes.shift();
      setBirdPosition(birdPosition - 2);
      setPipes(newPipes);
    });

    return () => cancelAnimationFrame(animationId);
  });

  useEffect(() => {
    if (birdPosition > height || birdPosition < 50) {
      handleGameOver();
    }
    pipes.forEach((pipe) => {
      const pipeXStart = Math.round(pipe.x) - 30;
      const pipeXEnd = Math.round(pipe.x) + 30;

      if (pipeXStart < birdPositionX + 10 && pipeXEnd > birdPositionX - 20) {
        const pipeU = pipe.y;
        const pipeD = pipeU - pipeGapY;
        if (pipeU > birdPosition && birdPosition > pipeD) {
          if (!passedPipes.includes(pipe.num)) {
            setPassedPipes([...passedPipes, pipe.num]);
            console.log(pipeU, birdPosition, pipeD);
          }
        } else {
          console.log(pipeU, birdPosition, pipeD);
          handleGameOver();
        }
      }
    });
  });

  const displayNumber = (number) => {
    const array = number.toString().split("");
    return (
      <div className="flex">
        {array.map((number, index) => {
          return (
            <img
              key={index}
              className="z-50"
              src={`../assets/sprites/${number}.png`}
              alt="bird"
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          backgroundImage: "url(../assets/sprites/background-night.png)",
        }}
        className="h-screen w-screen relative overflow-hidden"
      >
        <div className="flex justify-center items-center mt-6">
          {displayNumber(passedPipes.length)}
        </div>

        <div
          className="absolute"
          style={{ bottom: `${birdPosition}px`, left: `${birdPositionX}px` }}
        >
          <img
            className="h-[30px] w-[40px] "
            src={`../assets/sprites/bluebird-${
              isTouching ? "upflap" : "downflap"
            }.png`}
            alt="bird"
          />
        </div>
        {pipes.map((pipe, index) => {
          const x = pipe.x;
          const y = pipe.y;
          const change = height - y + pipeGapY;
          return (
            <div key={index}>
              <div
                className="absolute"
                style={{ bottom: `${y}px`, left: `${x}px` }}
              >
                <img
                  style={{ height: `${height}px` }}
                  className="rotate-180 w-[60px]"
                  src="../assets/sprites/pipe-green.png"
                  alt="pipe"
                  onContextMenu={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                />
              </div>
              <div
                className="absolute "
                style={{
                  top: `${change}px`,
                  left: `${x}px`,
                }}
              >
                <img
                  className=" w-[60px]"
                  style={{ height: `${height}px` }}
                  src="../assets/sprites/pipe-green.png"
                  alt="pipe"
                  onContextMenu={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
          );
        })}

        <div className="">
          <img
            className="absolute bottom-0 h-[50px] w-screen "
            src="../assets/sprites/base.png"
            alt="base"
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </>
  );
}

export default App;

// dsa, mat, cao, de_prac, cao_par
