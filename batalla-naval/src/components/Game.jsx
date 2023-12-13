import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import {Navigation } from 'swiper/modules';
import '../styles.css'
import Board from './board';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Ship from './Ship';
import {shipValues} from "../constants.js"

export default function Game() {

  const [ships, setShips] = useState([]);

  useEffect(() => {
    setShips([
      shipValues.submarine
    ])
  }, [])

  const handleDrop = (shipType, x, y) => {
    // const newShip = {
    //   item: shipType,
    //   position: { x, y },
    // };

    // setShips([...ships, newShip]);
    const indexToRemove = ships.findIndex((ship) => ship.name === shipType.name);
    // If a ship is found, remove it using splice
    if (indexToRemove !== -1) {
      console.log("asdasdasdasdas");
      const sc = [...ships];
      sc.splice(indexToRemove, 1);
      setShips(sc);
    }

  };
  console.log(ships);

  return (
    <DndProvider backend={HTML5Backend}>
      <Board handleDrop={handleDrop}/>
      {ships ?
        ships.map((s, index) => { return <Ship key={index} shipType={s}/>})
      :
      <></>
      }
      {/* <Ship shipType="Carrier"/> */}
      <p>asdasdasd</p>
    </DndProvider>
    )
}