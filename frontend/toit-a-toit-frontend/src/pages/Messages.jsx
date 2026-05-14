import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/templates';
import { getCurrentUser } from '../services/auth';
import { listConversations } from '../services/messages';
import { getListingById } from '../services/colocations';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  const diffDays = Math.floor((now - date) / 86400000);
  if (diffDays === 0) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [listingTitles, setListingTitles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const convs = await listConversations();
        if (!isMounted) return;
        setConversations(convs);

        const uniqueListingIds = [...new Set(convs.map((c) => c.listing_id).filter(Boolean))];
        if (uniqueListingIds.length > 0) {
          const results = await Promise.allSettled(uniqueListingIds.map((id) => getListingById(id)));
          if (!isMounted) return;
          const titles = {};
          results.forEach((result, i) => {
            if (result.status === 'fulfilled') {
              titles[uniqueListingIds[i]] = result.value?.listing?.title;
            }
          });
          setListingTitles(titles);
        }
      } catch {
        if (isMounted) setError('Impossible de charger les messages.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Messagerie</p>
          <h2 className="font-display text-4xl text-ink">Mes messages.</h2>
        </div>

        {error ? (
          <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-3xl bg-surface shadow-soft" />)}
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-3xl bg-surface p-12 text-center shadow-soft">
            <p className="font-display text-xl text-ink">Aucun message</p>
            <p className="mt-2 font-body text-sm text-muted">Vos échanges avec l'association apparaîtront ici.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {conversations.map((conv) => {
              const isUnread = conv.last_message_sender_id && conv.last_message_sender_id !== currentUser?.id;
              return (
                <li key={conv.id}>
                  <Link
                    to={`/messages/${conv.id}`}
                    className="flex items-start justify-between gap-4 rounded-3xl bg-surface p-5 shadow-soft transition hover:shadow-lift"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className={`font-body text-sm ${isUnread ? 'font-bold text-ink' : 'font-medium text-ink'}`}>
                        {listingTitles[conv.listing_id] || `Échange #${conv.id.slice(0, 8)}`}
                      </p>
                      {conv.last_message_body ? (
                        <p className="truncate font-body text-sm text-muted">
                          {conv.last_message_body}
                        </p>
                      ) : null}
                    </div>
                    <span className="flex-shrink-0 font-body text-xs text-muted">
                      {formatDate(conv.last_message_at || conv.created_at)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageShell>
  );
};

export default Messages;
