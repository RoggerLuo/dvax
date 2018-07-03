import invariant from 'invariant'

export default function(actionType,reducer = identify) {
    return (state, action) => {
        const { type } = action
        invariant(type, 'dispatch: action should be a plain Object with type')
        if (actionType === type) {
            return reducer(state, action)
        }
        return state
    }
}

function identify(value) {
    return value
}