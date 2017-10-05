import types from './_constant';

const actions = {
    setAccountInfo(data) {
        return {
            type: types.SET_ACCOUNT_INFO,
            data,
        };
    },
};

export default actions;
