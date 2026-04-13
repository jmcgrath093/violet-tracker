import { useState, useEffect, useRef } from 'react';
import { createEntry, updateEntry, fetchTags } from '../api';
import { Utensils, Activity as ActivityIcon, Stethoscope } from 'lucide-react';

const EntryForm = ({ onEntryAdded, initialData, onCancel }) => {
  const [type, setType] = useState(initialData?.type || 'Activity');
  const [subItem, setSubItem] = useState(initialData?.subItem || '');
  const [timestamp, setTimestamp] = useState(() => {
    if (initialData?.timestamp) {
      const d = new Date(initialData.timestamp);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    }
    const now = new Date();
    // Format to YYYY-MM-DDThh:mm for datetime-local input
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref to track if we're on the first render to avoid clearing subItem
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Load tags for autocomplete when type changes
    const loadTags = async () => {
      try {
        const res = await fetchTags(type);
        setSuggestedTags(res.data || []);
      } catch (err) {
        console.error('Failed to load tags', err);
      }
    };
    loadTags();
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      setSubItem(''); // Reset subitem when type changes by user
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subItem.trim() || !timestamp) return;

    setIsLoading(true);
    try {
      const entryData = {
        type,
        subItem: subItem.trim(),
        timestamp: new Date(timestamp).toISOString(),
        notes: notes.trim()
      };
      
      let res;
      if (initialData?.id) {
        res = await updateEntry(initialData.id, entryData);
      } else {
        res = await createEntry(entryData);
      }
      
      onEntryAdded(res);
      
      if (!initialData) {
        // Reset form fields only if creating new
        setSubItem('');
        setNotes('');
        const tagsRes = await fetchTags(type);
        setSuggestedTags(tagsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to submit entry', err);
      alert('Failed to save entry');
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = !!initialData;

  return (
    <form className="glass-panel" onSubmit={handleSubmit} style={isEditMode ? { margin: '0 0 1rem 0' } : {}}>
      <div className="form-group">
        <label htmlFor="type">Log Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Activity">🏃 Activity</option>
          <option value="Food">🍽️ Food</option>
          <option value="Medical">🩺 Medical</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="subItem">Sub-item (Tag)</label>
        <input
          id="subItem"
          type="text"
          list={`tag-suggestions-${isEditMode ? initialData.id : 'new'}`}
          value={subItem}
          onChange={(e) => setSubItem(e.target.value)}
          placeholder={`e.g., ${type === 'Activity' ? 'Walk' : type === 'Food' ? 'Breakfast' : 'Vomit'}`}
          required
        />
        <datalist id={`tag-suggestions-${isEditMode ? initialData.id : 'new'}`}>
          {suggestedTags.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </div>

      <div className="form-group">
        <label htmlFor="timestamp">Date & Time</label>
        <input
          id="timestamp"
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional details..."
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={isLoading} style={{ flex: 1, marginTop: 0 }}>
          {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Entry')}
        </button>
        {isEditMode && onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={isLoading}
            style={{ 
              flex: 1, 
              marginTop: 0, 
              background: 'transparent', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EntryForm;
