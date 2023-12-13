import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import {Navigation } from 'swiper/modules';
import "../styles.css";
import ShipsBoard from "./ShipsBoard.jsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Ship from "./Ship";
import { shipValues, rawValues } from "../constants.js";
import GuessBoard from "./GuessBoard.jsx";

export default function Game() {
  //solo barcos fuera del tablero
  const [ships, setShips] = useState([]);
  //barcos en tablero
  const [boardShips, setBoardShips] = useState([]);

  const [currentSelectedShip, setCurrentSelectedShip] = useState("");

  const [player1GuessBoard, setPlayer1GuessBoard] = useState([]);
  const [player2GuessBoard, setPlayer2GuessBoard] = useState([]);
  const [player2Board, setPlayer2Board] = useState([])

  useEffect(() => {
    setShips([shipValues.submarine, shipValues.aircraft_carrier]);

    setPlayer1GuessBoard(newBoard('unknown'));
    setPlayer2GuessBoard(newBoard('unknown'));
    setPlayer2Board(newBoard('empty'));

  }, []);

  const newBoard = (text) => {
    return Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => text)
    )
  }

  const handleDrop = (shipType, x, y) => {
    const indexToRemove = ships.findIndex(
      (ship) => ship.name === shipType.name
    );
    // If a ship is found, remove it using splice
    if (indexToRemove !== -1) {
      const sc = [...ships];
      sc.splice(indexToRemove, 1);
      setShips(sc);
    }

    addOrMoveShipOnBoard(shipType, x, y);
  };

  //Maneja el movimiento de los barcos en el tablero
  const addOrMoveShipOnBoard = (i, x, y) => {
    const newShip = {
      name: i.name,
      length: i.length,
      position: { x, y },
      isVertical: i.hasOwnProperty("isVertical") ? i.isVertical : false,
    };

    if (boardShips.some((s) => s.name == i.name)) {
      const newShips = boardShips.filter((s) => {
        return s.name != i.name;
      });
      setBoardShips([...newShips, newShip]);
    } else {
      setBoardShips([...boardShips, newShip]);
    }
  };

  const rotateCurrentShip = () => {
    if (
      currentSelectedShip &&
      boardShips.some((s) => s.name == currentSelectedShip)
    ) {
      var rotatedShip = boardShips.find((s) => { return s.name == currentSelectedShip })
      if (rotatedShip){
        rotatedShip = {
          ...rotatedShip,
          isVertical: !rotatedShip.isVertical,
        }
        const newShips = boardShips.filter((s) => { return s.name != currentSelectedShip;});
        setBoardShips([...newShips, rotatedShip]);
      }
    }
  };

  const selectShip = (shipName) => {
    setCurrentSelectedShip(shipName);
  }

  const makeComputerPlaceShips = () => {
    let tempBoard = newBoard('empty');
    insertPlayer2ShipRandomly(tempBoard, shipValues.aircraft_carrier);
    insertPlayer2ShipRandomly(tempBoard, shipValues.cruiser);
    insertPlayer2ShipRandomly(tempBoard, shipValues.motorboat);
    insertPlayer2ShipRandomly(tempBoard, shipValues.submarine);
    setPlayer2Board(tempBoard);
  }

  const insertPlayer2ShipRandomly = (board, ship) => {
    let shipc = {
      ...ship,
      isVertical: Math.random() < 0.5,
    }
    let randX;
    let randY;
    do{
      randX = Math.floor(Math.random() * (!shipc.isVertical ? (10 - ship.length): 10));
      randY = Math.floor(Math.random() * (shipc.isVertical ? (10 - ship.length): 10));
    }
    while (!tryPlaceShip(board, randX, randY, shipc.length, shipc.isVertical, shipc.name));
  }

  const tryPlaceShip = (board, x, y, length, isVertical, shipName) => {
    if (isOccupied(board, x, y, length, isVertical)){
      return null;
    }
    for (let i = 0; i < length; i++) {
      if (isVertical) {
        board[y + i][x] = shipName;
      } else {
        board[y][x + i] = shipName;
      }
    }
    return board;

  }
  const isOccupied = (board, x, y, length, isVertical) => {
    for (let i = 0; i < length; i++) {
      if (isVertical) {
        if (board[y + i][x] != 'empty') return true;
      } else {
        if (board[y][x + i] != 'empty') return true;
      }
    }
    return false;
  }

  const handleGuess = (x, y) => {
    const newBoard = [...player1GuessBoard];
    newBoard[y][x] = player2Board[y][x];
    setPlayer1GuessBoard(newBoard);
  }

  useEffect(() => {
    makeComputerPlaceShips();
  }, []);
  
  useEffect(()=> {
    console.log(player2Board);
  }, [player2Board]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100em",
        marginLeft: 0,
        flex: 1,
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            flex: 1,
          }}
        >
          <div style={{ flex: 1 }}>
            <ShipsBoard handleDrop={handleDrop} />
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: "1em",
            }}
          >
            <button style={{ textAlign: "center", width: "20em" }}>
              Start Game
            </button>
            <button
              style={{ textAlign: "center", width: "20em" }}
              onClick={rotateCurrentShip}
            >
              Rotate Ship
            </button>
            {ships &&
              ships.map((s, index) => {
                return <Ship key={index} shipType={s} />;
              })}
          </div>
          <div style={{ display: "flex", flex: 1 }}>
            { player2Board && player2Board.length > 0 &&
              <GuessBoard board={player1GuessBoard} handleClick={handleGuess} />
            }
          </div>
        </div>
        {boardShips &&
          boardShips.map((s) => {
            return (
              <Ship
                key={s.name}
                shipType={s}
                initialPosition={{ y: s.position.y, x: s.position.x }}
                isValidForSelection={true}
                onSelect={selectShip}
              />
            );
          })}
      </DndProvider>
    </div>
  );
}
