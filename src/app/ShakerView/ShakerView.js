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
    const [accelerated, setAccelerated] = useState(true)
    const [buttonClicked, setButtonClicked] = useState(false)


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
                        window.addEventListener('deviceorientation', () => { });
                    }
                })
                .catch(console.error);
        } else {
            // handle regular non iOS 13+ devices
        }
    }

    const handleAccelerated = (aX, aY, aZ) => {
        console.log('ax', aX, aY, aZ);
        playMaracas()
        setAccelerated(true)
        console.log('PLAY!')
        setTimeout(() => { 
            setAccelerated(false)
        }, 100);
        
    }

    const isAccelerometer = () => {
        if (window.DeviceMotionEvent == undefined) {
            //No accelerometer is present. Use buttons. 
            alert("no accelerometer");
        }
        else {
            // alert("accelerometer found");
            window.addEventListener("devicemotion", accelerometerUpdate, true);
        }
    }

    const accelerometerUpdate = (e) => {
        var aX = e.accelerationIncludingGravity.x * 1;
        var aY = e.accelerationIncludingGravity.y * 1;
        var aZ = e.accelerationIncludingGravity.z * 1;

        // if (aX > 10)console.log('ax', aX, aY, aZ);
        if (aY > 15) handleAccelerated(aX, aY, aZ)
    }

    
    const handleClick = () => {
        playMaracas()
    }

    const playMaracas = () => sampler.current.triggerAttack("A1");

    console.log('accelerated', accelerated)
    return (
        <div className='ShakerView'>
            <div className={`buttonshaker ${buttonClicked && 'clicked'}`} disabled={!isLoaded} onMouseDown={() => setButtonClicked(true)} onMouseUp={() => setButtonClicked(false)} onClick={() => handleClick()}>
                PLAY MARACAS
                <br />
                <img className='maracas' src={maracasImg} alt="Logo" />
            </div>
            <div className='motion-permissions'>
                If you want to make your ryhthm while shaking your body and your phone...
            <div className='permissions-button' onClick={() => askMotionPermissions()}>
                    Give Motion Permissions
            </div>
            </div>
        </div>
    );
};

export default ShakerView