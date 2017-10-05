import types from './_constant';

const _state = {
    accountInfo: null,
};

export default function login(state = _state, action) {
    switch (action.type) {
        case types.SET_ACCOUNT_INFO:
            return Object.assign({}, state, {
                accountInfo: action.data || null,
            });

        default:
            return state;
    }
}
