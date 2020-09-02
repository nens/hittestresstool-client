import React from 'react';

import styles from './Message.module.css';

export interface MessageProps {
  text: string;
  visible: boolean;
}

const Message: React.FC<MessageProps> = ({text, visible}) => {
  return (
    <div className={visible ? styles.Message : styles.MessageInvisible}>{text}</div>
  );
};

export default Message;
