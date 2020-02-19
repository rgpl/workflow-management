import {
    USER_LOGIN,
    CREATE_JOURNEY,
    VIEW_JOURNEY
} from './types';


export default (state = [], action) => {

    let flowRed = {
        [USER_LOGIN]: ()=>{
            return [
                ...state,
                {
                  id: action.id,
                  text: action.text,
                  completed: false
                }
              ]
        },
        [CREATE_JOURNEY]: ()=>{
            return state.map(todo =>
                (todo.id === action.id)
                  ? {...todo, completed: !todo.completed}
                  : todo
              )
        },
        [VIEW_JOURNEY]: ()=>{

        },
        'default': ()=>{

        }
    }
    //flowRed[(action.payload || 'default')]();

    switch (action.type) {
      case USER_LOGIN:
        return [
          ...state,
          {
            userName:action.payload.userName
          }
        ]
      case CREATE_JOURNEY:
        return state.map(todo =>
          (todo.id === action.id)
            ? {...todo, completed: !todo.completed}
            : todo
        )
      case VIEW_JOURNEY:
      default:
        return state
    }
  }

