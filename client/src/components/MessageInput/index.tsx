import React, { useState } from 'react';

import { setSendMessage } from '@/store/actions';
import { useAppStore } from '@/store';
import { ws } from '@/utils';
import type { Message } from '@/types/main';

export function MessageInput() {
  const { appDispatch } = useAppStore();
  const [messageContent, setMessageContent] = useState('');

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) {
    console.log(`[MessageInput] handleSubmit - value: '${messageContent}'`);
    event.preventDefault();

    const message: Message = {
      content: messageContent,
      id: window.crypto.randomUUID(),
      sender: 'client',
      timestamp: Date.now(),
    };

    ws.send(JSON.stringify(message));

    setMessageContent('');
    setSendMessage({ dispatch: appDispatch, sentMessage: message });
  }

  return (
    <form
      id="message-form"
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleSubmit(event);
        }
      }}
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', rowGap: '1rem' }}
    >
      <label htmlFor="message">Type a message and send by pressing 'Enter'</label>
      <textarea // force formatting
        autoCapitalize="on"
        autoCorrect="on"
        autoFocus={true}
        form="message-form"
        id="message"
        minLength={1}
        maxLength={2000}
        name="message"
        onChange={(event) => {
          console.log(`[MessageInput] onChange - value: ${event.target.value}`);
          setMessageContent(event.target.value);
        }}
        placeholder="Type here..."
        value={messageContent}
      />

      <button onClick={handleSubmit} style={{ backgroundColor: '#9B76FF' }} type="submit">
        Send
      </button>
    </form>
  );
}
