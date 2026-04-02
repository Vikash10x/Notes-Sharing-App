import { useState, useEffect } from 'react';
import { getMyNotes } from '../services/api';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyNotes();
  }, []);

  const fetchMyNotes = async () => {
    try {
      const res = await getMyNotes();
      setNotes(res.data);
    } catch (err) {
      toast.error('Failed to load your notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Profile Header section */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '24px',
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '40px',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', fontWeight: '800', color: 'white',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc', marginBottom: '8px' }}>
            {user?.name}
          </h1>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}>
              <Mail size={16} color="#6366f1" />
              {user?.email}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}>
              <BookOpen size={16} color="#8b5cf6" />
              {notes.length} Notes Shared
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          My Notes Collection
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Loading your notes...</div>
      ) : notes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', padding: '60px 20px', 
          background: 'rgba(30,41,59,0.3)', borderRadius: '16px', border: '1px dashed rgba(99,102,241,0.3)' 
        }}>
          <BookOpen size={48} color="#475569" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '8px' }}>No Notes Yet</h3>
          <p style={{ color: '#94a3b8' }}>You haven't uploaded any notes yet. Start sharing your knowledge!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {notes.map(note => (
            <NoteCard key={note._id} note={note} onDeleted={(id) => setNotes(notes.filter(n => n._id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
