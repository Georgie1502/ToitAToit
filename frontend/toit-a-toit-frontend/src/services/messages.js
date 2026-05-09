import api from './api';

export const sendMessage = async ({ body, recipient_user_id, listing_id }) => {
  const response = await api.post('/api/messages', { body, recipient_user_id, listing_id });
  return response.data?.message;
};

export const replyToConversation = async ({ conversation_id, body }) => {
  const response = await api.post('/api/messages', { conversation_id, body });
  return response.data?.message;
};

export const listConversations = async () => {
  const response = await api.get('/api/messages');
  return response.data?.conversations || [];
};

export const getConversationMessages = async (conversationId) => {
  const response = await api.get('/api/messages', { params: { conversation_id: conversationId } });
  return response.data?.messages || [];
};
