import { useState, useEffect, useCallback } from 'react';
import { getNotes, getMyNotes, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';
import CategoryFilter from '../components/CategoryFilter';
import { Search, BookOpen, TrendingUp, Users, FileText, X, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{
    background: '#111827', border: '1px solid #1e293b', borderRadius: '12px',
    padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
  }}>
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px',
      background: `rgba(${color},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={20} color={`rgb(${color})`} />
    </div>
    <div>
      <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#e2e8f0', lineHeight: '1' }}>{value}</p>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [myNotesOnly, setMyNotesOnly] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch {}
  }, []);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (myNotesOnly && user) {
        const res = await getMyNotes();
        data = res.data;
      } else {
        const params = {};
        if (search) params.search = search;
        if (selectedCategory) params.category = selectedCategory;
        const res = await getNotes(params);
        data = res.data;
      }
      setNotes(data);
    } catch (err) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, myNotesOnly, user]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setMyNotesOnly(false);
  };

  const clearSearch = () => {
    setSearch('');
    setSearchInput('');
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setMyNotesOnly(false);
  };

  const handleMyNotes = () => {
    setMyNotesOnly(!myNotesOnly);
    setSelectedCategory('');
    setSearch('');
    setSearchInput('');
  };

  const handleDeleted = (id) => setNotes((prev) => prev.filter((n) => n._id !== id));

  const myNotesCount = notes.filter(n => n.userId?._id === user?._id).length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px',
        padding: '40px 48px', marginBottom: '32px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        }} />
        <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '8px' }}>
          <span className="gradient-text">Knowledge Hub</span> 📚
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '28px' }}>
          {user ? `Welcome back, ${user.name}! ` : ''}Discover, share, and download study notes.
        </p>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <StatCard icon={FileText} label="Total Notes" value={notes.length} color="99,102,241" />
          <StatCard icon={TrendingUp} label="Categories" value={categories.length} color="6,182,212" />
          {user && <StatCard icon={UserCheck} label="My Notes" value={myNotesCount} color="139,92,246" />}
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input
              type="text"
              id="search-input"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search notes by title..."
              className="form-input"
              style={{ paddingLeft: '48px', paddingRight: search ? '44px' : '16px' }}
            />
            {search && (
              <button type="button" onClick={clearSearch} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '2px',
              }}>
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '12px 24px', flexShrink: 0 }}>
            Search
          </button>
          {user && (
            <button
              type="button"
              onClick={handleMyNotes}
              style={{
                flexShrink: 0, padding: '12px 20px', borderRadius: '10px', border: 'none',
                background: myNotesOnly ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'rgba(15,23,42,0.8)',
                color: myNotesOnly ? 'white' : '#64748b',
                border: myNotesOnly ? 'none' : '1px solid #1e293b',
                cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600',
                fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <UserCheck size={15} />
              My Notes
            </button>
          )}
        </form>

        {/* Category filter */}
        {!myNotesOnly && (
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategorySelect}
          />
        )}
      </div>

      {/* Results header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569' }}>
          {loading ? 'Loading...' : (
            <>
              <span style={{ color: '#818cf8', fontWeight: '800' }}>{notes.length}</span>
              {' '}{search ? `result${notes.length !== 1 ? 's' : ''} for "${search}"` :
                myNotesOnly ? 'of your notes' :
                selectedCategory ? `notes in ${selectedCategory}` : 'notes available'}
            </>
          )}
        </h2>
        {user && (
          <Link to="/upload" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              + Upload Note
            </button>
          </Link>
        )}
      </div>

      {/* Notes grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
          <div style={{
            width: '48px', height: '48px', margin: '0 auto 16px',
            border: '3px solid #1e293b', borderTopColor: '#6366f1',
            borderRadius: '50%',
          }} className="animate-spin" />
          <p>Loading notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          border: '2px dashed #1e293b', borderRadius: '16px',
        }}>
          <BookOpen size={48} color="#1e293b" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: '#475569', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
            {search || selectedCategory ? 'No notes found for this filter' : 'No notes yet'}
          </p>
          <p style={{ color: '#334155', fontSize: '0.875rem' }}>
            {user ? (
              <Link to="/upload" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
                Be the first to upload →
              </Link>
            ) : (
              <Link to="/signup" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
                Sign up to upload notes →
              </Link>
            )}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {notes.map((note, i) => (
            <div key={note._id} style={{ animationDelay: `${i * 0.05}s` }}>
              <NoteCard note={note} onDeleted={handleDeleted} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
