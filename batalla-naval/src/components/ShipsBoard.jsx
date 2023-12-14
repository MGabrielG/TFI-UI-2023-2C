import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import {Navigation } from 'swiper/modules';
import '../styles.css'
import Game from './Game';
import BoardBox from './BoardBox';
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Ship from './Ship';

export default function ShipsBoard( { board, handleDrop, otherPlayerGuessBoard } ) {

  const [ships, setShips] = useState([]);


  const addOrMoveShip = (i, x, y) => {
    const newShip = {
      name: i.name,
      length: i.length,
      position: {x, y},
      isVertical: i.hasOwnProperty('isVertical') ? i.isVertical : false
    };
    
    if (ships.some(s => s.name == i.name)){
      const newShips = ships.filter((s) => {return s.name != i.name});
      setShips([...newShips, newShip])
    } else {
      setShips([...ships, newShip])
    }
  }
  
  const [, drop] = useDrop({
    accept: 'SHIP',
    drop: (item, monitor) => {
      // const { x, y } = monitor.getSourceClientOffset();
      // handleDrop(item, Math.floor(x / 40), Math.floor(y / 40));
      
      const dropPosition = monitor.getClientOffset();
      const boardElement = document.getElementById('ship-board');
      const boardPosition = document.getElementById('ship-board').getBoundingClientRect();

      const isVertical = item.hasOwnProperty('isVertical') ? item.isVertical : false;
      const xLimit = isVertical ? 1 : item.length;
      const yLimit = isVertical ? item.length : 1;

      const containerPosition = boardElement.parentElement.getBoundingClientRect();
      
      // Calculate the position on the board
      var x = Math.floor((dropPosition.x - boardPosition.left) / 40) ;
      var y = Math.floor((dropPosition.y - boardPosition.top) / 40) ;
      if (x > (thisBoard[0].length - xLimit) || x < 0) { return }
      if (y > (thisBoard.length - yLimit) || y < 0) { return }

      handleDrop(item, x, y);


      // addOrMoveShip(item, Math.floor(x / 40), Math.floor(y / 40))

      // const { x, y } = monitor.getClientOffset();
      // const { left, top } = document.getElementById('board').getBoundingClientRect();
      // const offsetX = x - left - window.scrollX;
      // const offsetY = y - top - window.scrollY;
      // const cellX = Math.floor(offsetX / 40);
      // const cellY = Math.floor(offsetY / 40);
      // handleDrop(item, cellX, cellY);
      // addOrMoveShip(item, cellX, cellY);
    },
  });
  
  const [thisBoard, setThisBoard] = useState([]);
  useEffect(() => {
    if (board) {
      setThisBoard(board)
    } else {
      //setThisBoard(Array.from({ length: 10 }, () => Array(10).fill("empty")));
      // setThisBoard(Array(10).map(() => Array(10).fill("empty")));
      setThisBoard(Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => "empty")));
    }
  }, []);

  return (
    <div ref={drop} id='ship-board' style={{display: 'flex', flexDirection: 'column'}}>
    {/* ref={drop}> */}
    {thisBoard &&
      thisBoard.map( (row, indexR) => (
        <div key={indexR} style={{flexDirection: 'row', display:'flex'}}>
          {
            row.map((cell, indexC) => {
              
              return (<React.Fragment key={indexR + "y" + indexC}>
                <BoardBox key={indexC + "x" + indexR} value={otherPlayerGuessBoard[indexR][indexC]}/> 
              </React.Fragment>)
                
            })
          }
        </div>
      ))
    }
    {/* {thisBoard && ships &&
      ships.map(s => {
        return <Ship key={s.name} shipType={s} initialPosition={{y: s.position.y, x: s.position.x}}/>
      }) 
    } */}
    </div>
  )
}

// const BoxContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(${cols}, 40px);
//   gap: 2px; 
// `;