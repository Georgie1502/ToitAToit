import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { getCurrentUser } from '../services/auth';
import { getConversationMessages, replyToConversation } from '../services/messages';

const formatTime = (value) =>
  new Date(value).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const Conversation = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getConversationMessages(id)
      .then((data) => { if (isMounted) setMessages(data); })
      .catch(() => { if (isMounted) setError('Impossible de charger la conversation.'); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const body = reply.trim();
    if (!body || sending) return;
    setSending(true);
    setError('');
    try {
      const sent = await replyToConversation({ conversation_id: id, body });
      setMessages((prev) => [...prev, sent]);
      setReply('');
    } catch {
      setError('Impossible d\'envoyer le message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto flex max-w-2xl flex-col" style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Messagerie</p>
            <h2 className="font-display text-2xl text-ink">Conversation</h2>
          </div>
          <Button as={Link} to="/messages" size="sm" variant="ghost">
            Retour
          </Button>
        </div>

        {error ? (
          <div role="alert" aria-live="assertive" className="mb-4 rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
            {error}
          </div>
        ) : null}

        <div className="flex-1 space-y-3 pb-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-3xl bg-surface shadow-soft" />)}
            </div>
          ) : messages.length === 0 ? (
            <p className="py-8 text-center font-body text-sm text-muted">Aucun message pour l'instant.</p>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_user_id === currentUser?.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] rounded-3xl px-5 py-3 shadow-soft ${isMine ? 'bg-primary text-inverse rounded-br-md' : 'bg-surface text-ink rounded-bl-md'}`}>
                    <p className="font-body text-sm leading-relaxed">{msg.body}</p>
                    <p className={`mt-1 font-body text-[10px] ${isMine ? 'text-inverse/60' : 'text-muted'}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="sticky bottom-4 mt-4 flex gap-3 rounded-3xl bg-surface p-3 shadow-soft">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
            rows={1}
            placeholder="Écrire un message…"
            className="flex-1 resize-none rounded-2xl border-none bg-surfaceContainer px-4 py-2.5 font-body text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primaryContainer"
            aria-label="Message"
          />
          <Button type="submit" size="sm" variant="primary" disabled={!reply.trim() || sending}>
            <span className="material-symbols-outlined text-[18px]">send</span>
          </Button>
        </form>
      </div>
    </PageShell>
  );
};

export default Conversation;
