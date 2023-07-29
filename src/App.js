import {useEffect, useReducer, useRef, useState} from "react";

import Ball from "./components/Ball";
import Striker from "./components/Striker";
import BlockRow from "./components/BlockRow";
import {blockRowCreator, isCollide} from "./utils";


const directionInitializer = () => {
  let x = Math.floor(Math.random() * 10) - 5;
  if (x===0){
    x = 5
  }
  return { x, y: 2.5 }
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

function App() {

  const gameAreaRef = useRef(null);
  const strikerRef = useRef(null);
  const ballRef = useRef(null);
  const blocksRef = useRef([]);

  const [isGameOver, setIsGameOver] = useState(false);
  const [ballPosition, setBallPosition] = useState({x: window.innerWidth/2, y: window.innerHeight/2});
  const [direction, directionDispatch] = useReducer(directionReducer, {x:0, y:0}, directionInitializer);

  const [strikerPosition, setStrikerPosition] = useState(window.innerWidth/2);
  const [rowBlocks, setRowBlocks] = useState(initialBlocks);

  const startGame = () => {
    setIsGameOver(false);
    setBallPosition({x: window.innerWidth/2, y: window.innerHeight/2});
    setRowBlocks([blockRowCreator(6), blockRowCreator(7), blockRowCreator(6)]);
    directionDispatch({ type: 'initialize'});
  }

  useEffect(() => {
    const ballPositionInterval = setInterval(() => {
      setBallPosition((pos) => {
        return {
          x: pos.x + direction.x,
          y: pos.y + direction.y
        }
      });
    }, 10);

    return () => clearInterval(ballPositionInterval);
  }, [direction]);

  useEffect(() => {
    const areaRect = gameAreaRef.current.getBoundingClientRect();

    const blockRows = blocksRef.current;
    blockRows.forEach((blockRow, i) => {
      blockRow.forEach((block, j) => {
        if(!rowBlocks[i][j].visible){
          return;
        }

        const blockCollideObject = isCollide(ballRef.current, block);
        if(blockCollideObject.isCollide){

          setRowBlocks((rowBlocks) => {
            rowBlocks[i][j].visible = false;
            return rowBlocks;
          });

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

    if(ballPosition.y>areaRect.bottom){
      setIsGameOver(true);
      directionDispatch({ type: 'stop'})
    }

  }, [ballPosition, rowBlocks]);

  return (
    <div className="full-width h-screen">
      {isGameOver &&
        <div className="w-full h-screen absolute bg-black opacity-80 p-auto" style={{paddingTop: '200px'}}>
          <div className="absolute top-1/2 left-1/2 ml-[-125px] mt-[-125px] cursor-pointer" onClick={startGame}>
            <img src="retry.png" alt="retry"/>
          </div>
        </div>
      }
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
    </div>
  )
}

export default App;
