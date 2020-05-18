import React, { useState, useRef, useEffect, Component, PropTypes } from "react";
import { Sampler } from "tone";
import A1 from "../../assets/shaker.mp3";
import maracasImg from '../../assets/maracas1.png';
import { Motion, spring } from 'react-motion'
import ReactAccelerometer from 'react-accelerometer'

import './ShakerView.scss';

/* Combining React-Accelerometer with React-Motion */
const ReactAccelerometerMotion = ({ children }) => (
    <ReactAccelerometer>
        {({ x, y }) => (
            <Motion style={{ x: spring(x), y: spring(y) }}>
                {pos => children(pos)}
            </Motion>
        )}
    </ReactAccelerometer>
)


const AwesomeComponent = () => (
    <ReactAccelerometerMotion>
        {({ x, y }) => (
            <img
                src='image.jpg'
                style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
            />
        )}
    </ReactAccelerometerMotion>
)

export const ShakerView = () => {
    const [isLoaded, setLoaded] = useState(false);
    const sampler = useRef(null);


    useEffect(() => {
        sampler.current = new Sampler(
            { A1 },
            {
                onload: () => {
                    setLoaded(true);
                }
            }
        ).toMaster();
    }, []);

    const handleClick = () => sampler.current.triggerAttack("A1");

    return (
        <div className='ShakerView'>

            <div className='buttonshaker' disabled={!isLoaded} onClick={() => handleClick()}>
                PLAY MARACAS
          <br />
                <img className='maracas' src={maracasImg} alt="Logo" />
            </div>
        </div>
    );
};

export default ShakerView