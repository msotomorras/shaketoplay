import React, { useState, useRef, useEffect } from "react";
import { Event } from '../lib/analytics'
import { Sampler } from "tone";
import maracasImg from '../../assets/maracas1.png';
import bongosImg from '../../assets/bongo1.png';
import cymbalImg from '../../assets/cymbal.png';
import snaredrumImg from '../../assets/snaredrum.png';
import woodblockImg from '../../assets/woodblock.png';
import tambourineImg from '../../assets/tambourine.png';
import A1 from "../../assets/maracas.mp3";
import B1 from "../../assets/bongo.mp3";
import C1 from "../../assets/cymbal.wav";
import F1 from "../../assets/woodblock1.wav";
import D1 from "../../assets/snaredrum.mp3";
import E1 from "../../assets/Tambourine.wav";
import _ from "lodash";

import './ShakerView.scss';
import { Button } from "../Button/Button";

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

export const ShakerView = () => {
    const [setLoaded] = useState(false);
    const sampler = useRef(null);
    const [buttonClicked, setButtonClicked] = useState(false)
    const [showModal, setShowModal] = useState(true)
    const [index, setIndex] = useState(0)
    const [audioContextStarted, setAudioContextStarted] = useState(false)

    const delayedQuery = useRef(_.debounce(() => playMaracas('shaked'), 50)).current;

    const getRandomInstrument = () => {
        const randomIndex = Math.floor(Math.random() * Math.floor(instruments.length));
        return randomIndex
    }

    const getAccDirection = (x,y,z) => {
        console.log('getting main direction')
        const nX = Number(x)
        const nY = Number(y)
        const nZ = Number(z)
        if (nX > nY && nX> nZ) {
            return 'X'
        } else if (nY>nX && nY> nZ){
            return 'Y'
        } else {
            return 'Z'
        }
    }

    useEffect(() => {
        setIndex(getRandomInstrument);

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

        const isAccelerometer = () => {
            if (window.DeviceMotionEvent === undefined) {
                //No accelerometer is present. Use buttons. 
                alert("no accelerometer");
            }
            else {
                window.addEventListener("devicemotion", accelerometerUpdate, true);
            }
        }
        
        const accelerometerUpdate = (e) => {
            var aX = e.accelerationIncludingGravity.x * 1;
            var aY = e.accelerationIncludingGravity.y * 1;
            var aZ = e.accelerationIncludingGravity.z * 1;
    
            const lowThres = 20;
            const midThres = 30;
            const midhighThres = 45;
            const highThres = 65;
    
            var modulo = Math.sqrt(aX * aX + aY * aY + aZ * aZ)
            if (modulo > lowThres && modulo < midThres) {
                // console.log('soft shake')
                Event(`SoftShake`, `SoftShake-${`${modulo}`}`, `SoftShake`)

            }
            if (modulo > midThres && modulo < midhighThres) {
                handleAccelerated(aX, aY, aZ)
            }
            if (modulo > midhighThres && modulo < highThres) {
                // console.log('hard shake')
                Event(`HardShake`, `HardShake-${`${modulo}`}`, `HardShake`)
            }
        }

        const handleAccelerated = (aX, aY, aZ) => {
            console.log('accelerated!')
            delayedQuery()
            const mainDirection = getAccDirection(aX, aY, aZ)
            console.log('main direction---')
            console.log('main direction---', mainDirection)
            Event(`${mainDirection}-Direction`, `Direction`, `Direction`)
            // window.navigator.vibrate(200);
        }
        
        isAccelerometer()
    }, [setLoaded, delayedQuery]);

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

    

    

    


    const handleClick = () => {
        setAudioContextStarted(true)
        playMaracas('clicked')
        setButtonClicked(true)
        setTimeout(() => {
            setButtonClicked(false)
        }, 80);
    }

    const playMaracas = (type) => {
        const randomInstIndex = getRandomInstrument()
        setIndex(randomInstIndex)
        sampler.current.triggerAttack(instruments[randomInstIndex].sample)
        Event(`${type}-${instruments[randomInstIndex].instrumentName}`, `${type}`, `${type}`)
    }

    
    return (
        <div className='ShakerView'>
            {!audioContextStarted && <Button buttonClicked={buttonClicked} instrumentName={'Start playing!'}  setButtonClicked={setButtonClicked} handleClick={handleClick}/>}
            {audioContextStarted && <Button buttonClicked={buttonClicked} instrumentName={`Play ${instruments[index].instrumentName}`} instrumentImgSrc={instruments[index].img} setButtonClicked={setButtonClicked} handleClick={handleClick} />}
            <span className='tip'><sup>*</sup>Turn on your sound and make sure your volume is up.</span>
            {showModal && renderModal2()}
        </div>
    );
};

export default ShakerView