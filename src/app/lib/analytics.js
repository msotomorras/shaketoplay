import React, { useEffect } from 'react'
import ReactGA from 'react-ga';

const withTracker = (WrappedComponent, options = {}) => {
    const trackPage = page => {
        ReactGA.set({
            page,
            ...options
        });
        if (!window.location.href.includes('localhost') && window.location.href.includes('staging')) {
            ReactGA.pageview(page);
        }
    };

    const HOC = props => {
        useEffect(() => trackPage(props.location.pathname), [
            props.location.pathname
        ]);

        return <WrappedComponent {...props} />;
    };

    return HOC;
};

export const Event = (category, action, label) => {
    if (!window.location.href.includes('localhost') && window.location.href.includes('staging')) {
        ReactGA.event({
            category: category,
            action: action,
            label: label
        });
    }
};

export default withTracker