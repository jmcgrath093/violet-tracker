import TimelineItem from './TimelineItem';

const Timeline = ({ entries, isLoading, onEntryUpdated }) => {
  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading entries...</div>;
  }

  if (!entries || entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
        No entries recorded yet. Start tracking above!
      </div>
    );
  }

  return (
    <div className="timeline">
      {entries.map((entry) => (
        <TimelineItem key={entry.id} entry={entry} onEntryUpdated={onEntryUpdated} />
      ))}
    </div>
  );
};

export default Timeline;
