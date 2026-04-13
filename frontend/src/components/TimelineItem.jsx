import { useState } from 'react';
import { Utensils, Activity, Stethoscope, Edit2, Trash2 } from 'lucide-react';
import EntryForm from './EntryForm';
import { deleteEntry } from '../api';

const TimelineItem = ({ entry, onEntryUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Determine icon and color class based on type
  let IconPrefix = Activity;
  let typeClass = 'type-activity';

  if (entry.type === 'Food') {
    IconPrefix = Utensils;
    typeClass = 'type-food';
  } else if (entry.type === 'Medical') {
    IconPrefix = Stethoscope;
    typeClass = 'type-medical';
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete this ${entry.type} entry?`)) {
      setIsDeleting(true);
      try {
        await deleteEntry(entry.id);
        if (onEntryUpdated) onEntryUpdated();
      } catch (err) {
        console.error("Failed to delete entry", err);
        alert("Could not delete entry.");
        setIsDeleting(false);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="timeline-item" data-type={entry.type}>
        <EntryForm 
          initialData={entry} 
          onEntryAdded={() => {
            setIsEditing(false);
            if (onEntryUpdated) onEntryUpdated();
          }} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(entry.timestamp));

  return (
    <div className="timeline-item" data-type={entry.type} style={{ opacity: isDeleting ? 0.5 : 1 }}>
      <div className="item-content">
        <div className="item-header">
          <div>
            <span className={`type-badge ${typeClass}`}>
              {entry.type}
            </span>
            <div className="item-title">
              <IconPrefix size={18} />
              {entry.subItem}
            </div>
          </div>
          <div className="item-time" style={{ display: 'flex', alignItems: 'center' }}>
            {formattedTime}
            <button 
              onClick={() => setIsEditing(true)} 
              disabled={isDeleting}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.8rem', display: 'flex' }}
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              style={{ background: 'transparent', border: 'none', color: 'var(--type-food)', cursor: 'pointer', marginLeft: '0.4rem', display: 'flex' }}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {entry.notes && <div className="item-notes">{entry.notes}</div>}
      </div>
    </div>
  );
};

export default TimelineItem;
