import * as React from 'react';

import { FlexColumn, FlexColumnProps, FlexRow } from '@/layouts';
import type { Message } from '@/types/main';

type MessageLogContainerProps = FlexColumnProps & {
  messageConfigs: Message[];
};

type InlineDivStyles = React.HTMLAttributes<HTMLDivElement>['style'];

const dateFormatterFunc = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  weekday: 'short',
  year: 'numeric',
}).format;

function MessageContent({
  content,
  sender,
  style,
  timestamp,
}: Pick<Message, 'content' | 'sender' | 'timestamp'> & { style: InlineDivStyles }) {
  const formattedDate = dateFormatterFunc(timestamp);

  return (
    <FlexColumn style={style}>
      <FlexRow style={{ alignSelf: 'flex-start', fontSize: '0.75rem', textAlign: 'left' }}>
        <span style={{}}>
          <b>{`[`}</b>
          {`${sender}`}
          <b>{`]`}</b>
        </span>
        <pre style={{ margin: '0' }}>{` - ${formattedDate}`}</pre>
      </FlexRow>

      <FlexRow style={{ alignSelf: 'flex-start', textAlign: 'left' }}>{content}</FlexRow>
    </FlexColumn>
  );
}

export function MessageLogContainer({ messageConfigs, ...props }: MessageLogContainerProps) {
  return (
    <FlexColumn {...props}>
      {messageConfigs.map((messageConfigs) => {
        const { content, id, sender, timestamp } = messageConfigs;
        const inlineStyles: InlineDivStyles =
          sender === 'client'
            ? {
                alignSelf: 'flex-end',
                backgroundColor: '#0020C2',
                color: '#FFFFFF',
              }
            : {
                alignSelf: 'flex-start',
                backgroundColor: '#F5F5F5',
                color: '#000000',
              };

        return (
          <MessageContent
            key={id}
            content={content}
            sender={sender}
            style={{
              ...inlineStyles,
              borderRadius: '0.5rem',
              margin: '0 1rem',
              maxWidth: '40%',
              padding: '0.5rem',
            }}
            timestamp={timestamp}
          />
        );
      })}
    </FlexColumn>
  );
}
