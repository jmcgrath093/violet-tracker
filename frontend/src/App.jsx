import { useState, useEffect } from 'react';
import EntryForm from './components/EntryForm';
import Timeline from './components/Timeline';
import { fetchEntries } from './api';

function App() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const res = await fetchEntries();
      setEntries(res.data || []);
    } catch (err) {
      console.error('Failed to load entries', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleEntryAdded = (newEntry) => {
    // We could either refresh all or optimistically update
    // Optimistic update assumes id is returned, which it is.
    loadEntries();
  };

  return (
    <div>
      <header>
        <div className="logo">Violet Tracker</div>
        <div className="subtitle">Log your activities, meals, and medical events smoothly.</div>
      </header>
      
      <main>
        <EntryForm onEntryAdded={handleEntryAdded} />
        <Timeline entries={entries} isLoading={isLoading} onEntryUpdated={handleEntryAdded} />
      </main>
    </div>
  );
}

export default App;
