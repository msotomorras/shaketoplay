import React, { useState, useRef, useEffect, Component, PropTypes } from "react";
import { Sampler } from "tone";
import A1 from "../../assets/shaker.mp3";
import maracasImg from '../../assets/maracas1.png';
// import { Motion, spring } from 'react-motion'
// import ReactAccelerometer from 'react-accelerometer'

import './ShakerView.scss';

/* Combining React-Accelerometer with React-Motion */
// const ReactAccelerometerMotion = ({ children }) => (
//     <ReactAccelerometer>
//         {({ x, y }) => (
//             <Motion style={{ x: spring(x), y: spring(y) }}>
//                 {pos => children(pos)}
//             </Motion>
//         )}
//     </ReactAccelerometer>
// )


// const AwesomeComponent = () => (
//     <ReactAccelerometerMotion>
//         {({ x, y }) => (
//             <img
//                 src={maracasImg}
//                 style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
//             />
//         )}
//     </ReactAccelerometerMotion>
// )

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
        askPermissions()
        isAccelerometer()
    }, []);

    const askPermissions = () => {
        navigator.permissions.query({ name: 'accelerometer' })
            .then(result => {
                if (result.state === 'denied') {
                    console.log('Permission to use accelerometer sensor is denied.');
                    return;
                }
                console.log('Asking for permissions', result)
                // Use the sensor.
            });
    }

    const isAccelerometer = () => {
        if (window.DeviceMotionEvent == undefined) {
            //No accelerometer is present. Use buttons. 
            alert("no accelerometer");
        }
        else {
            alert("accelerometer found");
            window.addEventListener("devicemotion", accelerometerUpdate, true);
        }
    }

    const accelerometerUpdate = (e) => {
        console.log('positions---->')
        var aX = e.accelerationIncludingGravity.x*1;
        var aY = e.accelerationIncludingGravity.y*1;
        var aZ = e.accelerationIncludingGravity.z*1;

        console.log('positions---->', aX, aY, aZ)

        alert(aX);
        playMaracas()
        //The following two lines are just to calculate a
        // tilt. Not really needed. 
        const xPosition = Math.atan2(aY, aZ);
        const yPosition = Math.atan2(aX, aZ);

        console.log('positions---->', xPosition, yPosition)
     }

    const useAccelerometer = () => {
        // let accelerometer = null;
        // try {
        //     accelerometer = new Accelerometer({ referenceFrame: 'device' });
        //     accelerometer.addEventListener('error', event => {
        //         // Handle runtime errors.
        //         if (event.error.name === 'NotAllowedError') {
        //             // Branch to code for requesting permission.
        //         } else if (event.error.name === 'NotReadableError') {
        //             console.log('Cannot connect to the sensor.');
        //         }
        //     });
        //     accelerometer.addEventListener('reading', () => reloadOnShake(accelerometer));
        //     accelerometer.start();
        // } catch (error) {
        //     // Handle construction errors.
        //     if (error.name === 'SecurityError') {
        //         // See the note above about feature policy.
        //         console.log('Sensor construction was blocked by a feature policy.');
        //     } else if (error.name === 'ReferenceError') {
        //         console.log('Sensor is not supported by the User Agent.');
        //     } else {
        //         throw error;
        //     }
        // }
    }

    const handleClick = () => sampler.current.triggerAttack("A1");

    const playMaracas = () => sampler.current.triggerAttack("A1");

    return (
        <div className='ShakerView'>

            <div className='buttonshaker' disabled={!isLoaded} onClick={() => handleClick()}>
                PLAY MARACAS
                <br />
                <img className='maracas' src={maracasImg} alt="Logo" />
                {/* <AwesomeComponent/> */}
            </div>
        </div>
    );
};

export default ShakerView