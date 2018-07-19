import React from 'react'
import spinner from './spinner.gif'
import invariant from 'invariant'

class ScrollContainer extends React.Component { 
    constructor(props) {
        super(props)
        this.setRef = element => {
            this.props.put({type:'setRef',element})//setRef到redux，然后刷新的时候 操作这个ref
        }
    }
    render() {
        const onScroll = (e) => {
            const element = e.target
            const _distance = element.scrollHeight - element.scrollTop - window.innerHeight // 减去header40 加底下40
            if(_distance <= this.props.distance) { // load more
                this.props.put({ type: 'fetchData' })
            }
        }
        return  (
            <div ref={this.setRef} style={{height:'100%',overflow:'auto',display:'flex', flexDirection: 'column'}} onScroll={onScroll}>
                {this.props.children}
            </div>
        )
    }
}

function InifiniteList({ data, put, fetching, refreshing, hitBottom, children, distance, refreshLoadingStyle, ...restthings }){
    invariant(typeof(distance) == 'number','distance参数是必须的，为一个数字')
    let refreshDefaultStyle = {textAlign:'center',display:'flex',flex:1,position: 'fixed',left: '220px',bottom: 0,top: 0,right: 0,background: '#ffffff73'}    
    if(refreshLoadingStyle) {
        refreshDefaultStyle = { ...refreshDefaultStyle, ...refreshLoadingStyle }
    }
    return (
        <ScrollContainer put={put} distance={distance}>
            {data.map(children)}
            {
                fetching?
                (
                    <div style={{width:'100%',textAlign:'center',display:'flex',flex:1}}>
                        <img src={spinner} style={{userSelect:'none',margin:'auto',width:'40px',height:'40px'}}/>
                    </div>
                ):
                null
            }
            {
                refreshing?
                (
                    <div style={refreshDefaultStyle}>
                        <img src={spinner} style={{userSelect:'none',margin:'auto',width:'40px',height:'40px'}}/>
                    </div>
                ):
                null
            }
            {
                hitBottom?(
                    <div style={{width:'100%',textAlign:'center',flex:1,height:'40px',lineHeight:'40px',fontSize:'14px',color:'#ccc'}}>
                        没有更多了
                    </div>
                ):
                null
            }
        </ScrollContainer>
    )
}
export default InifiniteList
