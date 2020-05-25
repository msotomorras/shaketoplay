import React, { useState, useRef, useEffect, useCallback, PropTypes } from "react";
import { Sampler } from "tone";
import A1 from "../../assets/maracas.mp3";
import B1 from "../../assets/bongo.mp3";
import maracasImg from '../../assets/maracas1.png';
import bongosImg from '../../assets/bongo1.png';
import cymbalImg from '../../assets/cymbal.png';
import snaredrumImg from '../../assets/snaredrum.png';
import woodblockImg from '../../assets/woodblock.png';
import tambourineImg from '../../assets/tambourine.png';
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
        sample: 'A1',
        img: maracasImg
    },
    {
        instrumentName: 'bongo',
        sample: 'B1',
        img: bongosImg
    },
    {
        instrumentName: 'cymbal',
        sample: 'C1',
        img: cymbalImg
    },
    {
        instrumentName: 'snaredrum',
        sample: 'D1',
        img: snaredrumImg
    },
    {
        instrumentName: 'tambourine',
        sample: 'E1',
        img: tambourineImg
    },
    {
        instrumentName: 'woodblock',
        sample: 'F1',
        img: woodblockImg
    },
    {
        instrumentName: 'woodblock',
        sample: 'F1',
        img: woodblockImg
    },
]

const sampleArray = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'F1']
export const ShakerView = () => {
    const [isLoaded, setLoaded] = useState(false);
    const sampler = useRef(null);
    const [accelerated, setAccelerated] = useState(true)
    const [buttonClicked, setButtonClicked] = useState(false)
    const [showModal, setShowModal] = useState(true)
    const [activeInstrument, setActiveInstrument] = useState({})
    const [activeSample, setActiveSample] = useState('A1')
    const [index, setIndex] = useState(0)

    const delayedQuery = useRef(_.debounce(() => playMaracas(), 50)).current;

    const getRandomInstrument = () => {
        const randomIndex = Math.floor(Math.random() * Math.floor(instruments.length));
        console.log(randomIndex)
        
        return randomIndex
    }

    useEffect(() => {
        setIndex(getRandomInstrument)
        setActiveInstrument(instruments[index])
        setActiveSample(activeInstrument.sample)
        sampler.current = new Sampler(
            {
                A1,
                B1,
                C1,
                D1,
                E1,
                F1
            },
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
            <div className='permissions-button' onClick={() => {
                        askMotionPermissions();
                        setShowModal(false)
                    }}>
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
        console.log('PLAY!', activeInstrument.sample)
        delayedQuery()
        // playMaracas()
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

        // console.log(aX, aY, aZ, 'modulo---', modulo)
        // if (aX > 10)console.log('ax', aX, aY, aZ);
        if (modulo > 25 && modulo < 35) {
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
        console.log('play instrument', activeInstrument, activeSample)
        console.log('index', index)
        const randomInstIndex = getRandomInstrument()
        sampler.current.triggerAttack(instruments[randomInstIndex].sample)
    }

    console.log('instrument', activeInstrument)
    return (
        <div className='ShakerView'>
            <div
                className={`buttonshaker ${buttonClicked && 'clicked'}`}
                disabled={!isLoaded}
                onMouseDown={() => setButtonClicked(true)}
                onMouseUp={() => setButtonClicked(false)}
                onClick={() => handleClick()}>
                PLAY {instruments[index].instrumentName}
                <br />
                <img className='maracas' src={instruments[index].img} alt="Logo" />
            </div>
            <span className='tip'><sup>*</sup>Turn on your sound and make sure your volume is up</span>
            {showModal && renderModal2()}
        </div>
    );
};

export default ShakerView