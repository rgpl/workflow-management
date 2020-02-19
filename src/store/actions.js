import {
    USER_LOGIN,
    CREATE_JOURNEY,
    VIEW_JOURNEY
} from './types';

const userLogin = (userName) => ({
    type: USER_LOGIN,
    payload: {
        userName
    }
})

export {
    userLogin
}
