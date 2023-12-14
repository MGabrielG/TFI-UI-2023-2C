import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import {Navigation } from 'swiper/modules';
import '../styles.css'

export default function BoardBox( {value, handleClick, position} ) {

  return (
    <button onClick={position ? () => handleClick(position.x, position.y) : () => {}} className={`board-box ${value}`}></button>
  )
}