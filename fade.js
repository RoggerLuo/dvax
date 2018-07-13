import React from 'react'
import Transition from 'react-transition-group/Transition';
const Fade = ({ show, duration, marginTop, children, className, style }) => {
    marginTop = marginTop || '0px'
    const defaultStyle = {
        transition: `all ${duration}ms ease-in-out`,
        opacity: 0,
        marginTop
    }
    const transitionStyles = {
        entering: {},
        entered:  { opacity: 1, marginTop:'0px' },
        exiting: {},
        exited: {}
    }
    const finalStyle = state => ({...defaultStyle,...transitionStyles[state],...style})
    return (
        <Transition unmountOnExit in={show} timeout={duration}>
            {
                state => {
                    return(
                        <div style={finalStyle(state)} className={className||''}>
                            {children}
                        </div>
                    )
                }
            }
        </Transition>
    )
}
export default Fade
