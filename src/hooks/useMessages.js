import { useState, useEffect } from 'react';
import { subscribeToMessages } from '../services/firestore';

export const useMessages = (matchId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToMessages(matchId, (messagesData) => {
      setMessages(messagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [matchId]);

  return { messages, loading };
};