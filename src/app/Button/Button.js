import React, { useState, useRef, useEffect, useCallback, PropTypes } from "react";

import './Button.scss';


export const Button = ({buttonClicked, instrumentName, instrumentImgSrc, setButtonClicked, handleClick}) => {
    return (
        <div className='Button'>
            <div
                className={`buttonshaker ${buttonClicked && 'clicked'}`}
                onMouseDown={() => setButtonClicked(true)}
                onMouseUp={() => setButtonClicked(false)}
                onClick={() => handleClick()}>
                {instrumentName}
                <br />
                {instrumentImgSrc && instrumentImgSrc.length > 0 && <img className='maracas' src={instrumentImgSrc} alt="Logo" />}
            </div>
        </div>
    );
};

export default Button