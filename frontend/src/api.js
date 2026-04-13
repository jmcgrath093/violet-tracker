const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchEntries = async () => {
  const response = await fetch(`${API_BASE_URL}/entries`);
  if (!response.ok) {
    throw new Error('Failed to fetch entries');
  }
  return response.json();
};

export const createEntry = async (entryData) => {
  const response = await fetch(`${API_BASE_URL}/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entryData),
  });
  if (!response.ok) {
    throw new Error('Failed to create entry');
  }
  return response.json();
};

export const updateEntry = async (id, entryData) => {
  const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entryData),
  });
  if (!response.ok) {
    throw new Error('Failed to update entry');
  }
  return response.json();
};

export const deleteEntry = async (id) => {
  const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete entry');
  }
  return response.json();
};

export const fetchTags = async (type) => {
  const response = await fetch(`${API_BASE_URL}/tags?type=${encodeURIComponent(type)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  return response.json();
};
