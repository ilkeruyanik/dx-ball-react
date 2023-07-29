import {useEffect, useReducer, useRef, useState} from "react";

import Ball from "./components/Ball";
import Striker from "./components/Striker";
import BlockRow from "./components/BlockRow";
import {blockRowCreator, isCollide} from "./utils";


const directionInitializer = () => {
  const x= (2*Math.random()-1);
  const y = Math.sqrt(1-Math.pow(x, 2));
  return { x, y }
}
const directionReducer = (direction, action) => {
  if(action.type === 'initialize')
    return directionInitializer();

  if(action.type === 'reflect-x')
    return {...direction, x: -direction.x}

  if(action.type === 'reflect-y')
    return {...direction, y: -direction.y}

  if(action.type === 'stop')
    return {x: 0, y: 0}
}

const initialBlocks = [blockRowCreator(6), blockRowCreator(7), blockRowCreator(6)];
const maxVelocity = 12

const filterUnvisibleRows = (rowBlocks) => {
  return rowBlocks.filter((row) => {
    for(let i=0; i<row.length; i++){
      if(row[i].visible)
        return true
    }
    return false
  });
}

function App() {

  const gameAreaRef = useRef(null);
  const strikerRef = useRef(null);
  const ballRef = useRef(null);
  const blocksRef = useRef([]);

  const [isGameOver, setIsGameOver] = useState(false);
  const [ballPosition, setBallPosition] = useState({x: window.innerWidth/2, y: window.innerHeight/2});
  const [direction, directionDispatch] = useReducer(directionReducer, {x:0, y:0}, directionInitializer);
  const [ballVelocity, setBallVelocity] = useState(3);

  const [strikerPosition, setStrikerPosition] = useState(window.innerWidth/2);
  const [rowBlocks, setRowBlocks] = useState(initialBlocks);

  const [score, setScore] = useState(0);
  const highScore = localStorage.getItem('highScore');

  const startGame = () => {
    setIsGameOver(false);
    setBallPosition({x: window.innerWidth/2, y: window.innerHeight/2});
    setRowBlocks([blockRowCreator(6), blockRowCreator(7), blockRowCreator(6)]);
    setBallVelocity(3);
    directionDispatch({ type: 'initialize'});
    setScore(0);
  }

  const finishGame = (score) => {
    setIsGameOver(true);
    directionDispatch({ type: 'stop'});
    const highScore = localStorage.getItem('highScore');
    if(highScore<score)
      localStorage.setItem('highScore', score);
  }

  useEffect(() => {
    if(isGameOver)
      finishGame(score);
  }, [isGameOver, score]);

  useEffect(() => {
    if(!isGameOver){
      const ballVelocityIncreaseAndAddNewBlocksInterval = setInterval(() => {
        setBallVelocity(vel => {
          if(vel<maxVelocity){
            return vel + 1;
          }
          return vel
        });
        const blockCount = Math.ceil(Math.random()*8)
        setRowBlocks(rows => [blockRowCreator(blockCount), ...rows]);
      }, 20000);

      return () => clearInterval(ballVelocityIncreaseAndAddNewBlocksInterval);

    }
  }, [isGameOver]);

  useEffect(() => {
    const ballPositionInterval = setInterval(() => {
      if(!isGameOver){
        setBallPosition((pos) => {
          return {
            x: pos.x + (direction.x * ballVelocity),
            y: pos.y + (direction.y * ballVelocity)
          }
        });
      }
    }, 10);
    return () => clearInterval(ballPositionInterval);
  }, [isGameOver, direction, ballVelocity]);

  useEffect(() => {
    if(rowBlocks.length>10)
      setIsGameOver(true);
  }, [rowBlocks, score]);

  useEffect(() => {
    const areaRect = gameAreaRef.current.getBoundingClientRect();

    rowBlocks.forEach((row, i)=> {
      row.forEach((block, j) => {
        if(!block.visible)
          return;

        const blockDomElement = blocksRef.current[i][j];
        const blockCollideObject = isCollide(ballRef.current, blockDomElement);
        if(blockCollideObject.isCollide){
          setScore(score => score+1);

          setRowBlocks((rowBlocks) => {
            rowBlocks[i][j].visible = false;
            return rowBlocks;
          });
          setRowBlocks(filterUnvisibleRows(rowBlocks));

          if(blockCollideObject.collideSide.y){
            directionDispatch({ type: 'reflect-y' })
          }

          if(blockCollideObject.collideSide.x){
            directionDispatch({ type: 'reflect-x' })
          }
        }

      });
    });

    const ballRect = ballRef.current.getBoundingClientRect();

    if ( ballRect.left<=areaRect.left || ballRect.right>=areaRect.right )
      directionDispatch({ type: 'reflect-x' });

    if(ballPosition.y<=0)
      directionDispatch({ type: 'reflect-y' });

    const strikerCollideObject = isCollide(ballRef.current, strikerRef.current);

    if(strikerCollideObject.isCollide)
      directionDispatch({ type: 'reflect-y' })

    if(ballPosition.y>areaRect.bottom)
      setIsGameOver(true);

  }, [ballPosition, rowBlocks, score]);

  return (
    <div className="full-width h-screen flex">
      {isGameOver &&
        <div className="w-full h-screen absolute bg-black opacity-80 p-auto" style={{paddingTop: '200px'}}>
          <div className="absolute top-1/2 left-1/2 ml-[-125px] mt-[-125px] cursor-pointer" onClick={startGame}>
            <img src="retry.png" alt="retry"/>
          </div>
        </div>
      }
      <div>
        <span className="text-white text-xl">Score : {score}</span>
      </div>
      <div
          ref={gameAreaRef}
          className="w-[1200px] bg-black mx-auto h-screen border-x border-solid"
          onPointerMove={(e) => setStrikerPosition(e.clientX)}
      >
        {rowBlocks.map(
          (blocks, i) => <BlockRow key={i} ref={blocksRef} index={i} blocks={blocks}/>
        )}
        <Ball ref={ballRef} position={ballPosition}/>
        <Striker ref={strikerRef} x={strikerPosition}/>
      </div>
      <div>
        <span className="text-white text-xl">High Score : {highScore}</span>
      </div>
    </div>
  )
}

export default App;
