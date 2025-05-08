import React, { useState, useCallback } from 'react';
import BookmarkList from './components/BookmarkList';
import { ToastProvider } from './components/ToastContainer';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleBookmarkAdded = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <ToastProvider>
      <div className="App">
        <h1>My Bookmark Manager</h1>
        <BookmarkList key={refreshTrigger} />
      </div>
    </ToastProvider>
  );
}

export default App;

