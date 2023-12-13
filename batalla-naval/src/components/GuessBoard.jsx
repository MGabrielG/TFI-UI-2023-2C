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

export default function GuessBoard( { board, handleClick } ) {

  const [ships, setShips] = useState([]);

  
  const [thisBoard, setThisBoard] = useState([]);
  useEffect(() => {
    if (board) {
      setThisBoard(board)
    } else {
      setThisBoard(Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => "empty")));
    }
  }, []);

  return (
    <div id='guess-board' style={{display: 'flex', flexDirection: 'column', flex: 1}}>
    {thisBoard &&
      thisBoard.map( (row, indexR) => (
        <div key={indexR} style={{display:'flex', flexDirection: 'row'}}>
          {
            row.map((cell, indexC) => {
              
              return (<React.Fragment key={indexR + "y" + indexC}>
                <BoardBox key={indexC + "x" + indexR} value={cell} position={{x:indexC, y:indexR}} handleClick={handleClick}/> 
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
