import {
  LOAD_MESSAGES, // force formatting
  RECEIVE_MESSAGE,
  SEND_MESSAGE,
} from '@/store';
import type { BaseAction, Message } from '@/types/main';

export function setLoadMessages({
  dispatch, // force formatting
  messages,
}: BaseAction & { messages: Message[] }) {
  dispatch({
    type: LOAD_MESSAGES,
    payload: {
      allItems: messages,
    },
  });
}

export function setReceiveMessage({
  dispatch, // force formatting
  receivedMessage,
}: BaseAction & { receivedMessage: Message }) {
  dispatch({
    type: RECEIVE_MESSAGE,
    payload: {
      message: receivedMessage,
    },
  });
}

export function setSendMessage({
  dispatch, // force formatting
  sentMessage,
}: BaseAction & { sentMessage: Message }) {
  dispatch({
    type: SEND_MESSAGE,
    payload: {
      message: sentMessage,
    },
  });
}
