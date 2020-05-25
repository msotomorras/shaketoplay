import React, { useState, useRef, useEffect, useCallback, PropTypes } from "react";
import { Sampler } from "tone";
import A1 from "../../assets/maracas.mp3";
import B1 from "../../assets/bongo.mp3";
import maracasImg from '../../assets/maracas1.png';
import C1 from "../../assets/cymbal.wav";
import F1 from "../../assets/woodblock1.wav";
import D1 from "../../assets/snaredrum.mp3";
import E1 from "../../assets/Tambourine.wav";
import _ from "lodash";
import firebase from 'firebase';
import { firebaseConfig } from '../lib/firebaseConfig'

import './ShakerView.scss';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


const instruments = [
    {
        instrumentName: 'maracas',
        sample: A1
    },
    {
        instrumentName: 'bongo',
        sample: B1
    },
    {
        instrumentName: 'cymbal',
        sample: C1
    },
    {
        instrumentName: 'woodblock',
        sample: F1
    },
    {
        instrumentName: 'tambourine',
        sample: E1
    },
    {
        instrumentName: 'snaredrum',
        sample: D1
    }
]
export const ShakerView = () => {
    const [isLoaded, setLoaded] = useState(false);
    const sampler = useRef(null);
    const [accelerated, setAccelerated] = useState(true)
    const [buttonClicked, setButtonClicked] = useState(false)
    const [showModal, setShowModal] = useState(true)
    const [ activeInstrument, setActiveInstrument ] = useState({})

    const delayedQuery = useRef(_.throttle(() => playMaracas(), 80)).current;

    const getRandomInstruemt = () => {
        const randomIndex = Math.floor(Math.random() * Math.floor(instruments.length));
        console.log(randomIndex)
        return instruments[randomIndex]
    }

    useEffect(() => {
        setActiveInstrument(getRandomInstruemt())
        sampler.current = new Sampler(
            // activeInstrument.sample,
            {A1},
            {
                onload: () => {
                    setLoaded(true);
                }
            }
        ).toMaster();
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

    const renderModal2 = () => {
        return (
            <div className='modal-container'>
                <div className='ModalPermissions'>
                    If you want to make your ryhthm while shaking your body and your phone...
            <div className='permissions-button' onClick={() => { askMotionPermissions(); setShowModal(false) }}>
                        Give Motion Permissions
            </div>
                    <div className='permissions-button' onClick={() => setShowModal(false)}>
                        I'll just play with the button
            </div>
                </div>
            </div>

        )
    }

    const handleAccelerated = (aX, aY, aZ) => {
        console.log('ax', aX, aY, aZ);
        console.log('PLAY!')
        delayedQuery()
        window.navigator.vibrate(200);

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

        var modulo = Math.sqrt(aX * aX, aY * aY, aZ * aZ)
        console.log(aX, aY, aZ, 'modulo---', modulo)

        // if (aX > 10)console.log('ax', aX, aY, aZ);
        if (modulo > 25 && modulo < 27) {
            handleAccelerated(aX, aY, aZ)
        }
    }


    const handleClick = () => {
        playMaracas()
        setButtonClicked(true)
        setTimeout(() => {
            setButtonClicked(false)
        }, 100);
    }

    const playMaracas = () => {
        sampler.current.triggerAttack("A1")
    }

    return (
        <div className='ShakerView'>
            <div
                className={`buttonshaker ${buttonClicked && 'clicked'}`}
                disabled={!isLoaded}
                onMouseDown={() => setButtonClicked(true)}
                onMouseUp={() => setButtonClicked(false)}
                onClick={() => handleClick()}>
                    PLAY {activeInstrument.instrumentName}
                <br />
                <img className='maracas' src={maracasImg} alt="Logo" />
            </div>
            <span className='tip'><sup>*</sup>Turn on your sound and make sure your volume is up</span>
            {showModal && renderModal2()}
        </div>
    );
};

export default ShakerView