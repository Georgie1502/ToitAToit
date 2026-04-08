const ListingDetailsQuickFacts = ({ quickFacts }) => {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-[1.5rem] bg-surfaceContainerLow p-6 shadow-[0_18px_50px_rgba(38,48,53,0.05)] md:grid-cols-4 md:p-8">
      {quickFacts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-1">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{fact.label}</span>
          <span className="font-display text-lg font-bold text-ink md:text-xl">{fact.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ListingDetailsQuickFacts;
