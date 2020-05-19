import React, { useState, useRef, useEffect, Component, PropTypes } from "react";
import { Sampler } from "tone";
import A1 from "../../assets/shaker.mp3";
import maracasImg from '../../assets/maracas1.png';
// import { Motion, spring } from 'react-motion'
// import ReactAccelerometer from 'react-accelerometer'

import './ShakerView.scss';

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
        // askPermissions()
        isAccelerometer()
    }, []);

    const askMotionPermissions = () => {
        // feature detect
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            console.log('request permission')
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', () => { });
                    }
                })
                .catch(console.error);
        } else {
            // handle regular non iOS 13+ devices
        }
    }

    const askOrientationPermissions = () => {
        // feature detect
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            console.log('request permission')
          DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
              if (permissionState === 'granted') {
                window.addEventListener('deviceorientation', () => {});
              }
            })
            .catch(console.error);
        } else {
          // handle regular non iOS 13+ devices
        }
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
        var aX = e.accelerationIncludingGravity.x * 1;
        var aY = e.accelerationIncludingGravity.y * 1;
        var aZ = e.accelerationIncludingGravity.z * 1;

        console.log('positions---->', aX, aY, aZ)

        alert(aX);
        playMaracas()
        //The following two lines are just to calculate a
        // tilt. Not really needed. 
        const xPosition = Math.atan2(aY, aZ);
        const yPosition = Math.atan2(aX, aZ);

        console.log('positions---->', xPosition, yPosition)
    }

    const handleClick = () => sampler.current.triggerAttack("A1");

    const playMaracas = () => sampler.current.triggerAttack("A1");

    return (
        <div className='ShakerView'>
            <div className='motion' onClick={() => askMotionPermissions()}>
                Give Motion Permissions
            </div>
            <div className='motion' onClick={() => askOrientationPermissions()}>
                Give Orientation Permissions
            </div>
            <div className='buttonshaker' disabled={!isLoaded} onClick={() => handleClick()}>
                PLAY MARACAS
                <br />
                <img className='maracas' src={maracasImg} alt="Logo" />
            </div>
        </div>
    );
};

export default ShakerView