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

// combine reducers from scratch
const combineReducers = (reducers) => {
    // return big reducer
    return (state = {}, action) => {
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](state[key], action);
                return nextState;
            }, {});
    };
};

const rootReducer = combineReducers({ counter: counterReducer });
const store = createStore(rootReducer);

// console.log(store.getState());
// console.log(store.dispatch({ type: 'INCREMENT' }));
// console.log(store.getState());

const render = () => {
    const counterEl = document.getElementById('counter');
    if (counterEl) {
        let incrementBtn;
        let decrementBtn;
        const buttonEl = document.querySelector('button');
        if (!buttonEl) {
            incrementBtn = document.createElement("button");
            decrementBtn = document.createElement("button");
            incrementBtn.textContent = 'Increment';
            decrementBtn.textContent = 'Decrement';

            document.body.appendChild(incrementBtn);
            document.body.appendChild(decrementBtn);

            incrementBtn.addEventListener('click', () => {
                store.dispatch({ type: 'INCREMENT' });
            });

            decrementBtn.addEventListener('click', () => {
                store.dispatch({ type: 'DECREMENT' });
            });
        }

        const { counter } = store.getState();
        counterEl.innerText = counter;
    }
};

render(); // for first time load
store.subscribe(render); // fires any time actions is dispatched

// document.addEventListener('click', () => {
//     store.dispatch({ type: 'INCREMENT' })
// });

