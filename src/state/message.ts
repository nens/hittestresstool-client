import { AnyAction } from 'redux';
import { AppState, Thunk } from '../App';

interface MessageState {
  lastMessage: string;
  lastMessageId: number;
  visible: boolean;
}

const INITIAL_STATE: MessageState = {
  lastMessage: '',
  lastMessageId: 0,
  visible: false
};

const ADD_MESSAGE = 'message/ADD';
const HIDE_MESSAGE = 'message/HIDE';

export default function reducer(
  state: MessageState=INITIAL_STATE,
  action: AnyAction
): MessageState {
  switch(action.type) {
    case ADD_MESSAGE: {
      const message: string = action.message;
      const messageId: number = action.messageId;

      if (messageId > state.lastMessageId) {
        return {
          ...state,
          lastMessage: message,
          lastMessageId: messageId,
          visible: true
        };
      } else {
        return state;
      }
    }
    case HIDE_MESSAGE: {
      const messageId = action.messageId;

      if (messageId === state.lastMessageId) {
        // No new messages in the meantime
        return {
          ...state,
          visible: false
        }
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}


// Selectors

export const getMessage = (state: AppState) => state.message.lastMessage;
export const getMessageVisible = (state: AppState) => state.message.visible;

// Action

export const addMessage = (message: string): Thunk => (dispatch, getState) => {
  const state = getState();
  const messageId = state.message.lastMessageId + 1;

  dispatch({
    type: ADD_MESSAGE,
    message,
    messageId
  });

  window.setTimeout(() => dispatch({
    type: HIDE_MESSAGE, messageId
  }), 2000);
};
