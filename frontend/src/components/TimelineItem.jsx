import { useState } from 'react';
import { Utensils, Activity, Stethoscope, Edit2 } from 'lucide-react';
import EntryForm from './EntryForm';

const TimelineItem = ({ entry, onEntryUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);

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

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(entry.timestamp));

  return (
    <div className="timeline-item" data-type={entry.type}>
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
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.5rem', display: 'flex' }}
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
        {entry.notes && <div className="item-notes">{entry.notes}</div>}
      </div>
    </div>
  );
};

export default TimelineItem;
