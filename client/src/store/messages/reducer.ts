import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import {
  LOAD_MESSAGES, // force formatting
  RECEIVE_MESSAGE,
  SEND_MESSAGE,
} from '@/store/actionTypes';
import { Message } from '@/types/main';

export type MessagesStateSlice = {
  allItems: Message[];
};

type MessagesAllItemsAction = combineReducers.ReducerAction<{
  messageItem?: Message;
  messageId?: Message['id'];
}>;

type CombinedMessagesStateSlice = {
  allItems: combineReducers.ArgsTuple<MessagesStateSlice['allItems'], MessagesAllItemsAction>;
};

export const initialMessagesStateSlice = {
  allItems: [],
};

const allItems: CombinedMessagesStateSlice['allItems'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case LOAD_MESSAGES:
        return [...stateSlice, ...action.payload.allItems];
      case RECEIVE_MESSAGE:
      case SEND_MESSAGE:
        return [...stateSlice, action.payload.message];
      default:
        return stateSlice;
    }
  },
  initialMessagesStateSlice.allItems,
];

export default combineReducers({
  allItems,
});
