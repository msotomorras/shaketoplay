import React, { useState, useRef, useEffect, useCallback, PropTypes } from "react";
import { Event } from '../lib/analytics'
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
import { Button } from "../Button/Button";

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

    const delayedQuery = useRef(_.debounce(() => playMaracas('shaked'), 50)).current;

    const getRandomInstrument = () => {
        const randomIndex = Math.floor(Math.random() * Math.floor(instruments.length));
        return randomIndex
    }

    useEffect(() => {
        setIndex(getRandomInstrument)
        // setActiveInstrument(instruments[index])
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
        console.log('accelerated!')
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

        if (modulo > 25 && modulo < 35) {
            handleAccelerated(aX, aY, aZ)
        }
    }


    const handleClick = () => {
        Event(`Clicked-${activeInstrument.instrumentName}`, `Clicked`, `Clicked`)
        playMaracas('clicked')
        setButtonClicked(true)
        setTimeout(() => {
            setButtonClicked(false)
        }, 80);
    }

    const getIndex = () => {
        return index;
    }

    const playMaracas = (type) => {
        const randomInstIndex = getRandomInstrument()
        setIndex(randomInstIndex)
        sampler.current.triggerAttack(instruments[randomInstIndex].sample)
        Event(`${type}-${instruments[randomInstIndex].instrumentName}`, `${type}`, `${type}`)
    }

    const randomRandomIndex = getRandomInstrument();
    return (
        <div className='ShakerView'>
            <Button buttonClicked={buttonClicked} instrumentName={instruments[index].instrumentName} instrumentImgSrc={instruments[index].img} setButtonClicked={setButtonClicked} handleClick={handleClick}/>
            <span className='tip'><sup>*</sup>Turn on your sound and make sure your volume is up. <br/>Tap button to start, shake to continue playing!</span>
            {showModal && renderModal2()}
        </div>
    );
};

export default ShakerView