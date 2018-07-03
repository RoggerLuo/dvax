export default (event) => {
    const { ctrlKey, metaKey, keyCode, shiftKey } = event
    return (preset_keyCode,{ meta, ctrl, shift },cb) => {
        if(ctrl){
            if(!ctrlKey) return
        }else{
            if(ctrlKey) return
        }
        if(meta){
            if(!metaKey) return 
        }else{
            if(metaKey) return 
        }
        if(shift){
            if(!shiftKey) return
        }else{
            if(shiftKey) return            
        }
        if(keyCode === preset_keyCode){
            cb(event)
            event.preventDefault()
            event.stopPropagation()
        }
    }
}
