import React from 'react';
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Ship = ({ shipType, initialPosition}) => {
  const length = shipType.length;
  const [{ isDragging }, drag] = useDrag({
    type: 'SHIP',
    item: shipType,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const isVertical = shipType.hasOwnProperty('isVertical') ? shipType.isVertical : false;

  // const boardPosition = document.getElementById('board').getBoundingClientRect();
  const boardPosition = document.getElementById('board').getBoundingClientRect();
  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: 40 * shipType.length, // Adjust the size as needed
        height: `40px`,
        backgroundColor: 'gray', // Set your ship color
        border: '1px solid black',
        //margin: '5px',
        position: initialPosition ? 'absolute' : 'relative',
        top: initialPosition ? boardPosition.top + window.scrollY + initialPosition.y * 40 : 0, // Adjust as needed
        left: initialPosition ? boardPosition.left + window.scrollX + initialPosition.x * 40 : 0, // Adjust as needed
        zIndex: 555,
        transform: isVertical && "rotate(90deg)",
      }}
    />
  );
};

export default Ship;