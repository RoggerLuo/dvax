import React from 'react'

function Gap(height){
    const GapComponent = ({h})=>{
        return <div style={{height:h+'px',width:'1px'}}></div>
    }
    return <GapComponent h={height}/>    
}

export default Gap
