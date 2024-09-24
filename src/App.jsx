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
    const getNumberImgLink = (number) => {
      switch (number) {
        case "1":
          return "https://i.ibb.co/XCV2N2T/1.png";
        case "2":
          return "https://i.ibb.co/qF5r8Rk/2.png";
        case "3":
          return "https://i.ibb.co/S7h72fK/3.png";
        case "4":
          return "https://i.ibb.co/vsq8cM9/4.png";
        case "5":
          return "https://i.ibb.co/1XLcWgy/5.png";
        case "6":
          return "https://i.ibb.co/W5NHVcS/6.png";
        case "7":
          return "https://i.ibb.co/tqtYcJ6/7.png";
        case "8":
          return "https://i.ibb.co/s5LNQvn/8.png";
        case "9":
          return "https://i.ibb.co/3hdVqZt/9.png";
        default:
          return "https://i.ibb.co/6XVPFQk/0.png";
      }
    };

    const array = number.toString().split("");
    return (
      <div className="flex">
        {array.map((number, index) => {
          return (
            <img
              key={index}
              className="z-50"
              src={getNumberImgLink(number)}
              alt="score"
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
          backgroundImage: "url(https://i.ibb.co/VvtCs97/background-night.png)",
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
            src={
              isTouching
                ? "https://i.ibb.co/pxMfCkn/bluebird-upflap.png"
                : "https://i.ibb.co/NNBKL1Z/bluebird-downflap.png"
            }
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
                  src="https://i.ibb.co/XJQLwwh/pipe-green.png"
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
                  src="https://i.ibb.co/XJQLwwh/pipe-green.png"
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
            src="https://i.ibb.co/MVHXR67/base.png"
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
// https://i.ibb.co/6XVPFQk/0.png
// https://i.ibb.co/XCV2N2T/1.png
// https://i.ibb.co/qF5r8Rk/2.png
// https://i.ibb.co/S7h72fK/3.png
// https://i.ibb.co/vsq8cM9/4.png
// https://i.ibb.co/1XLcWgy/5.png
// https://i.ibb.co/W5NHVcS/6.png
// https://i.ibb.co/tqtYcJ6/7.png
// https://i.ibb.co/s5LNQvn/8.png
// https://i.ibb.co/3hdVqZt/9.png
// https://i.ibb.co/31NvfRp/background-day.png
// https://i.ibb.co/VvtCs97/background-night.png
// https://i.ibb.co/MVHXR67/base.png
// https://i.ibb.co/NNBKL1Z/bluebird-downflap.png
// https://i.ibb.co/cTSfzn8/bluebird-midflap.png
// https://i.ibb.co/pxMfCkn/bluebird-upflap.png
// https://i.ibb.co/jVkc9KD/gameover.png
// https://i.ibb.co/ggMvjwx/message.png
// https://i.ibb.co/XJQLwwh/pipe-green.png
// https://i.ibb.co/wKP00ZW/pipe-red.png
// https://i.ibb.co/QCt5K0k/redbird-downflap.png
// https://i.ibb.co/vZ94Tgq/redbird-midflap.png
// https://i.ibb.co/Cn3gXgR/redbird-upflap.png
// https://i.ibb.co/q7X1B4x/yellowbird-downflap.png
// https://i.ibb.co/wRh8P3K/yellowbird-midflap.png
// https://i.ibb.co/HzX2x87/yellowbird-upflap.png
