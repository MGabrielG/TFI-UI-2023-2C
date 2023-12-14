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
import { shipValues, rawValues, gameStates } from "../constants.js";
import GuessBoard from "./GuessBoard.jsx";

export default function Game({ isVsGame }) {
  //solo barcos fuera del tablero
  const [ships, setShips] = useState([]);
  //barcos en tablero
  const [boardShips, setBoardShips] = useState([]);

  const [currentSelectedShip, setCurrentSelectedShip] = useState("");

  const [player1GuessBoard, setPlayer1GuessBoard] = useState([]);
  const [player2GuessBoard, setPlayer2GuessBoard] = useState([]);
  const [player1Board, setPlayer1Board] = useState([]);
  const [player2Board, setPlayer2Board] = useState([]);
  const [gameState, setGameState] = useState(gameStates.selectingShips);

  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);

  const initialSetOfShips = [
    shipValues.submarine,
    shipValues.aircraft_carrier,
    shipValues.motorboat,
    shipValues.cruiser,
  ];

  useEffect(() => {
    setInitialShips();
  }, []);

  const setInitialShips = () => {
    setShips(initialSetOfShips);

    setPlayer1GuessBoard(newBoard("unknown"));
    setPlayer2GuessBoard(newBoard("unknown"));
    setPlayer2Board(newBoard("empty"));
    setPlayer1Board(newBoard("empty"));
  }

  const newBoard = (text) => {
    return Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => text)
    );
  };

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
    if (gameState != gameStates.selectingShips) {
      return;
    }
    if (
      currentSelectedShip &&
      boardShips.some((s) => s.name == currentSelectedShip)
    ) {
      var rotatedShip = boardShips.find((s) => {
        return s.name == currentSelectedShip;
      });
      if (rotatedShip) {
        rotatedShip = {
          ...rotatedShip,
          isVertical: !rotatedShip.isVertical,
        };
        const newShips = boardShips.filter((s) => {
          return s.name != currentSelectedShip;
        });
        setBoardShips([...newShips, rotatedShip]);
      }
    }
  };

  const selectShip = (shipName) => {
    setCurrentSelectedShip(shipName);
  };

  const makeComputerPlaceShips = () => {
    let tempBoard = newBoard("empty");
    insertPlayer2ShipRandomly(tempBoard, shipValues.aircraft_carrier);
    insertPlayer2ShipRandomly(tempBoard, shipValues.cruiser);
    insertPlayer2ShipRandomly(tempBoard, shipValues.motorboat);
    insertPlayer2ShipRandomly(tempBoard, shipValues.submarine);
    setPlayer2Board(tempBoard);
  };

  const insertPlayer2ShipRandomly = (board, ship) => {
    let shipc = {
      ...ship,
      isVertical: Math.random() < 0.5,
    };
    let randX;
    let randY;
    do {
      randX = Math.floor(
        Math.random() * (!shipc.isVertical ? 10 - ship.length : 10)
      );
      randY = Math.floor(
        Math.random() * (shipc.isVertical ? 10 - ship.length : 10)
      );
    } while (
      !tryPlaceShip(
        board,
        randX,
        randY,
        shipc.length,
        shipc.isVertical,
        shipc.name
      )
    );
  };

  const tryPlaceShip = (board, x, y, length, isVertical, shipName) => {
    if (isOccupied(board, x, y, length, isVertical)) {
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
  };
  const isOccupied = (board, x, y, length, isVertical) => {
    for (let i = 0; i < length; i++) {
      if (isVertical) {
        if (board[y + i][x] != "empty") return true;
      } else {
        if (board[y][x + i] != "empty") return true;
      }
    }
    return false;
  };

  const handleP1Guess = (x, y) => {
    if (player1GuessBoard[y][x] != "unknown") {
      return;
    }
    const newBoard = [...player1GuessBoard];
    newBoard[y][x] = player2Board[y][x];
    setPlayer1GuessBoard(newBoard);
  };

  useEffect(() => {
    if (gameState != gameStates.inGame) {
      return;
    }
    if (!isVsGame) {
      let x;
      let y;
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      } while (player2GuessBoard[y][x] != "unknown");

      handleP2Guess(x, y);
    }
  }, [player1GuessBoard]);

  const handleP2Guess = (x, y) => {
    const newBoard = [...player2GuessBoard];
    newBoard[y][x] = player1Board[y][x];
    setPlayer2GuessBoard(newBoard);
  };

  const startGame = () => {
    let allGood = true;
    if (ships && ships.length > 0) {
      alert("You have to put all the ships in the board");
      return;
    }
    boardShips.forEach((s) => {
      if (
        (s.isVertical && s.position.y + s.length > 10) ||
        (!s.isVertical && s.position.x + s.length > 10)
      ) {
        alert("No ship can be out of the board");
        allGood = false;
        return;
      }
    });

    const mappedBoard = mapPlayer1Board();

    if (mappedBoard) {
      setGameState(gameStates.inGame);
      // mapPlayer1Board();
      setPlayer1Board(mappedBoard);
      return;
    }

    alert("Ships cannot be overlapped");
    return;
  };

  const mapPlayer1Board = () => {
    let tempBoard = newBoard("empty");
    let isGoodBoard = true;
    boardShips.forEach((s) => {
      if (s.isVertical) {
        for (let i = 0; i < s.length; i++) {
          if (tempBoard[s.position.y + i][s.position.x] != "empty") {
            isGoodBoard = false;
          }
          tempBoard[s.position.y + i][s.position.x] = s.name;
        }
      } else {
        for (let i = 0; i < s.length; i++) {
          if (tempBoard[s.position.y][s.position.x + i] != "empty") {
            isGoodBoard = false;
          }
          tempBoard[s.position.y][s.position.x + i] = s.name;
        }
      }
    });
    if (isGoodBoard) return tempBoard;
    return null;
  };

  const restartGame = () => {
    setBoardShips([]);
    setInitialShips();
  }

  useEffect(() => {
    makeComputerPlaceShips();
  }, []);

  useEffect(() => {
    if (gameState != gameStates.inGame) return;
    let maxShipBoxes = 0;
    initialSetOfShips.forEach(s => {
      maxShipBoxes += s.length;
    })
    let amountOfShipDiscovered = 0;
    player1GuessBoard.forEach(fila => {
      fila.forEach(cell => {
        if (cell != 'empty' && cell !='unknown') { amountOfShipDiscovered += 1; }
        //
      })
    })
    if (amountOfShipDiscovered >= maxShipBoxes) {
      alert("Player 1 wins!");
      setPlayer1Wins(player1Wins + 1);
    }
  }, [player1GuessBoard]);

  useEffect(() => {
    if (gameState != gameStates.inGame) return;
    let maxShipBoxes = 0;
    initialSetOfShips.forEach(s => {
      maxShipBoxes += s.length;
    })
    let amountOfShipDiscovered = 0;
    player2GuessBoard.forEach(fila => {
      fila.forEach(cell => {
        if (cell != 'empty' && cell !='unknown') { amountOfShipDiscovered += 1; }
        //
      })
    })
    if (amountOfShipDiscovered >= maxShipBoxes) {
      alert("CPU wins!");
      setPlayer1Wins(player2Wins + 1);
    }
  }, [player1GuessBoard]);

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
            <ShipsBoard
              handleDrop={handleDrop}
              otherPlayerGuessBoard={player2GuessBoard}
            />
            <p>Player 1 Wins: {player1Wins}</p>
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: "1em",
            }}
          >
            <button
              style={{ textAlign: "center", width: "20em" }}
              onClick={startGame}
            >
              Start Game
            </button>
            <button
              style={{ textAlign: "center", width: "20em" }}
              onClick={rotateCurrentShip}
            >
              Rotate Ship
            </button>
            <button
              style={{ textAlign: "center", width: "20em" }}
              onClick={restartGame}
            >
              RestartGame
            </button>
            {ships &&
              ships.map((s, index) => {
                return <Ship key={index} shipType={s} />;
              })}
          </div>
          <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
            {player2Board && player2Board.length > 0 && (
              <GuessBoard
                board={player1GuessBoard}
                handleClick={
                  gameState == gameStates.inGame ? handleP1Guess : () => {}
                }
              />
            )}
            <p>
              {isVsGame ? "Player 2" : "CPU"} Wins: {player2Wins}
            </p>
          </div>
        </div>
        {boardShips &&
          boardShips.map((s) => {
            return (
              <Ship
                key={s.name}
                shipType={s}
                initialPosition={{ y: s.position.y, x: s.position.x }}
                isValidForSelection={gameState != gameStates.inGame}
                onSelect={selectShip}
                isSelected={currentSelectedShip == s.name}
              />
            );
          })}
      </DndProvider>
    </div>
  );
}
