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

  let lastDateStr = null;

  return (
    <div className="timeline">
      {entries.map((entry) => {
        const dateObj = new Date(entry.timestamp);
        const currentDateStr = new Intl.DateTimeFormat('en-US', {
          weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
        }).format(dateObj);

        const showHeader = currentDateStr !== lastDateStr;
        lastDateStr = currentDateStr;

        return (
          <div key={entry.id}>
            {showHeader && (
              <div style={{
                position: 'relative',
                marginLeft: '3rem',
                marginBottom: '1rem',
                marginTop: '1rem',
                color: 'var(--primary)',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.85rem'
              }}>
                {currentDateStr}
              </div>
            )}
            <TimelineItem entry={entry} onEntryUpdated={onEntryUpdated} />
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
