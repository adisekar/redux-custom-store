const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        // notify all listeners after action dispatched
        listeners.forEach((listener) => {
            listener();
        })
    }

    const subscribe = (listener) => {
        listeners.push(listener);
        // unsubscribe
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        }
    };

    dispatch({}); // dummy action, so store is initialized

    return { getState, dispatch, subscribe };
};

const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        default:
            return state;
    }
};

const store = createStore(counterReducer);

// console.log(store.getState());
// console.log(store.dispatch({ type: 'INCREMENT' }));
// console.log(store.getState());

const render = () => {
    const counterEl = document.getElementById('counter');
    if (counterEl) {
        counterEl.innerText = store.getState();
    }
};

render(); // for first time load
store.subscribe(render); // fires any time actions is dispatched

document.addEventListener('click', () => {
    store.dispatch({ type: 'INCREMENT' })
});

