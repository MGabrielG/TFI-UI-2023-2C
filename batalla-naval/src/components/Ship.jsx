import React, { useEffect, useState } from 'react';
import { useDrag } from "react-dnd";

const Ship = ({ shipType, initialPosition, onSelect, isValidForSelection, isSelected}) => {
  const length = shipType.length;
  const [windowScroll, setWindowScroll] = useState({});
  const [{ isDragging }, drag] = useDrag({
    type: 'SHIP',
    item: shipType,
    canDrag: isValidForSelection,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const isVertical = shipType.hasOwnProperty('isVertical') ? shipType.isVertical : false;

 // const boardPosition = document.getElementById('board').getBoundingClientRect();
  const boardElement = document.getElementById('ship-board');
  const boardPosition = boardElement.getBoundingClientRect();
  
  //Hace falta para que no se desacomoden los barcos al redimensionar la pantalla, y no use windowScroll pq sino tira error al primer render en el tablero
  useEffect(() => {
    const updateScrollPosition = () => {
      setWindowScroll({
        y: window.scrollY,
        x: window.scrollX,
      });
    };

    // Initial update
    updateScrollPosition();

    // Attach event listeners for scroll changes
    window.addEventListener('resize', updateScrollPosition);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('resize', updateScrollPosition);
    };
  }, []);

  const handleClick = () => {
    if (!onSelect) return;
    onSelect(shipType.name);
  }

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: 40 * shipType.length,
        height: `40px`,
        backgroundColor: 'gray',
        border: '1px solid black',
        //margin: '5px',
        position: initialPosition ? 'absolute' : 'relative',
        top: initialPosition ? boardPosition.top + window.scrollY + initialPosition.y * 40 + (shipType.isVertical ? + 20 * (shipType.length - 1) : 0): 'auto',
        left: initialPosition ? boardPosition.left + window.scrollX + initialPosition.x * 40 + (shipType.isVertical ? - 20 * (shipType.length - 1 ) : 0): 'auto',
        zIndex: 555,
        transform: isVertical ? "rotate(90deg)": "none",
        filter: isSelected && isValidForSelection ? 'sepia(100%) saturate(100%) brightness(1.2)' : 'none',
      }}
      onClick={handleClick}
      onDragStart={handleClick}
    />
  );
};

export default Ship;