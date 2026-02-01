'use client';

import { useEffect, useState } from 'react';

export default function CleaningLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);


  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/todos/cleaninglogs');
        const data = await res.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching cleaning logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this log?')) return;

    setDeletingId(id);

    try {
      const res = await fetch('/api/todos/cleaninglogs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
      } else {
        alert('Failed to delete log');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting log');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
      <section className="w-full bg-gray-50 min-h-screen font-montserrat">
      <div className="h-[7%] p-3 bg-zinc-300 flex justify-between items-center shadow-md text-black">
  <h1 className="font-medium text-lg text-black font-montserrat">CLeaning Logs</h1>
  
 
 
   
 
 </div>
      <div className="overflow-x-auto text-black">
        
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-2 border-b">Room</th>
              <th className="text-left px-4 py-2 border-b">Staff</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
              <th className="text-left px-4 py-2 border-b">Start Time</th>
              <th className="text-left px-4 py-2 border-b">Finish Time</th>
              <th className="text-left px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 border-b">{log.roomName}</td>
                <td className="px-4 py-2 border-b">{log.user}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    log.status === 'STARTED' ? 'bg-yellow-100 text-yellow-800' :
                    log.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">{new Date(log.startTime).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">
                  {log.finishTime ? new Date(log.finishTime).toLocaleString() : 'Not Finished'}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleDelete(log._id)}
                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    disabled={deletingId === log._id}
                  >
                    {deletingId === log._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}