// components/common/DataSyncProvider.jsx
import { useEffect, useContext } from 'react';
import { useCartSync } from '../../hooks/useCartSync.js';
import { AuthContext } from '../../services/AuthContext.js';

const DataSyncProvider = ({ children }) => {
  const { syncWithServer } = useCartSync();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    // רק אחרי שהטעינה הסתיימה ויש משתמש מחובר
    if (!loading && user) {
      
      syncWithServer();
    }
  }, [user, loading, syncWithServer]);

  return children;
};

export default DataSyncProvider;
