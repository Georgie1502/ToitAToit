import { useEffect, useRef, useState } from 'react';
import { applyToListing } from '../../services/applications';
import { Button } from '../atoms';

const CandidatureModal = ({ listingTitle, listingId, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const textareaRef = useRef(null);
  const isSubmittingRef = useRef(false);
  isSubmittingRef.current = isSubmitting;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmittingRef.current) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await applyToListing(listingId, message.trim());
      setSubmitted(true);
      onSuccess();
    } catch (err) {
      if (err?.response?.status === 409) {
        setSubmitted(true);
        onSuccess();
      } else {
        setError(err?.response?.data?.message || "Impossible d'envoyer votre candidature pour le moment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-candidature-title"
        className="w-full max-w-lg rounded-t-[2rem] bg-surface px-8 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:rounded-[2rem]"
      >
        {submitted ? (
          <div className="space-y-6 text-center">
            <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
            <div>
              <h2 className="font-display text-2xl text-ink">Candidature envoyée !</h2>
              <p className="mt-2 font-body text-sm text-muted">
                L'association Toit à Toi a bien reçu votre dossier et vous contactera prochainement.
              </p>
            </div>
            <Button type="button" variant="primary" size="md" className="w-full" onClick={onClose}>
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Candidature</p>
              <h2 id="modal-candidature-title" className="mt-2 font-display text-2xl text-ink">
                {listingTitle || 'Cette annonce'}
              </h2>
              <p className="mt-1 font-body text-sm text-muted">
                Votre dossier sera transmis à l'association qui analysera votre candidature.
              </p>
            </div>

            {error ? (
              <div role="alert" className="rounded-2xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="candidature-message" className="font-body text-sm font-semibold text-ink">
                Message <span className="font-normal text-muted">(facultatif)</span>
              </label>
              <textarea
                ref={textareaRef}
                id="candidature-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Présentez-vous brièvement : votre situation, pourquoi cette annonce vous correspond..."
                rows={4}
                maxLength={1000}
                className="w-full resize-none rounded-2xl border border-outline-variant/30 bg-surfaceContainer/40 px-4 py-3 font-body text-sm text-ink placeholder:text-muted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-right font-body text-xs text-muted">{message.length}/1000</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row-reverse">
              <Button type="submit" variant="primary" size="md" className="flex-1" disabled={isSubmitting}>
                <span className="material-symbols-outlined text-[18px]">send</span>
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
              </Button>
              <Button type="button" variant="ghost" size="md" className="flex-1" onClick={onClose} disabled={isSubmitting}>
                Annuler
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CandidatureModal;
