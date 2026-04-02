import { useState } from 'react';
import { Download, Trash2, User, Calendar, Tag, Heart, MessageCircle, Send } from 'lucide-react';
import { deleteNote, likeNote, commentNote } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const categoryColors = {
  'Programming': { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
  'DBMS': { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: 'rgba(6,182,212,0.3)' },
  'Operating System': { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  'Aptitude': { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  'Mathematics': { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  'Data Structures': { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  'Networks': { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
};

const getFileIcon = (fileName) => {
  if (!fileName) return '📄';
  const ext = fileName.split('.').pop()?.toLowerCase();
  const icons = { pdf: '📕', doc: '📘', docx: '📘', txt: '📄', ppt: '📙', pptx: '📙' };
  return icons[ext] || '📄';
};

const NoteCard = ({ note: initialNote, onDeleted }) => {
  const { user } = useAuth();
  const [note, setNote] = useState(initialNote);
  const [deleting, setDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const catName = note.categoryId?.name || 'Other';
  const catStyle = categoryColors[catName] || { bg: 'rgba(99,102,241,0.1)', color: '#818cf8', border: 'rgba(99,102,241,0.2)' };
  
  // Safe checks since populate might return differently mapped objects
  const ownerId = typeof note.userId === 'object' ? note.userId?._id : note.userId;
  const isOwner = user && ownerId === user._id;
  const isLiked = user && note.likes?.includes(user._id);

  const handleDelete = async () => {
    if (!window.confirm('Delete this note permanently?')) return;
    setDeleting(true);
    try {
      await deleteNote(note._id);
      toast.success('Note deleted!');
      if (onDeleted) onDeleted(note._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = note.fileURL;
    link.download = note.fileName || 'note';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like notes');
    // Optimistic UI update
    const previousLikes = [...(note.likes || [])];
    const updatedLikes = isLiked 
      ? previousLikes.filter(id => id !== user._id)
      : [...previousLikes, user._id];
    
    setNote({ ...note, likes: updatedLikes });
    
    try {
      const res = await likeNote(note._id);
      setNote(res.data); // Update with authoritative state
    } catch (err) {
      // Revert optimistic update
      setNote({ ...note, likes: previousLikes });
      toast.error('Failed to like note');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to comment');
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    try {
      const res = await commentNote(note._id, commentText);
      setNote(res.data);
      setCommentText('');
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="note-card animate-fadeIn" style={{ transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: catStyle.bg, border: `1px solid ${catStyle.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', flexShrink: 0,
          }}>
            {getFileIcon(note.fileName)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: '1rem', fontWeight: '700',
              color: '#e2e8f0', lineHeight: '1.3',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {note.title}
            </h3>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.05em',
              padding: '2px 10px', borderRadius: '999px', marginTop: '4px',
              background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}`,
            }}>
              <Tag size={10} />
              {catName}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{
        color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', marginBottom: '16px',
      }}>
        {note.description}
      </p>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.8rem' }}>
            <User size={12} />
            <span>{typeof note.userId === 'object' ? note.userId.name : 'Unknown'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.8rem' }}>
            <Calendar size={12} />
            <span>{formatDate(note.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Social Actions (Like & Comment) */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button 
          onClick={handleLike}
          style={{ 
            background: 'none', border: 'none', color: isLiked ? '#ef4444' : '#64748b', 
            display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
            transition: 'color 0.2s'
          }}
        >
          <Heart size={16} fill={isLiked ? '#ef4444' : 'none'} style={{ transition: 'all 0.2s' }} className={isLiked ? "scale-110" : ""} />
          {note.likes?.length || 0}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          style={{ 
            background: 'none', border: 'none', color: showComments ? '#6366f1' : '#64748b', 
            display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
            transition: 'color 0.2s'
          }}
        >
          <MessageCircle size={16} />
          {note.comments?.length || 0}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ marginBottom: '16px', background: 'rgba(15,23,42,0.4)', borderRadius: '8px', padding: '12px' }}>
          <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(!note.comments || note.comments.length === 0) ? (
              <span style={{ fontSize: '0.8rem', color: '#475569', textAlign: 'center', padding: '8px 0' }}>No comments yet.</span>
            ) : (
              note.comments.map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>{c.userName}</span>
                    <span style={{ fontSize: '0.65rem', color: '#475569' }}>{formatDate(c.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>{c.text}</p>
                </div>
              ))
            )}
          </div>
          {user ? (
            <form onSubmit={handleComment} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..." 
                style={{ 
                  flex: 1, background: 'rgba(30,41,59,0.8)', border: '1px solid #334155', 
                  borderRadius: '6px', padding: '6px 10px', fontSize: '0.8rem', color: '#e2e8f0', outline: 'none'
                }}
              />
              <button 
                type="submit" 
                disabled={submittingComment || !commentText.trim()}
                style={{ 
                  background: '#6366f1', border: 'none', borderRadius: '6px', width: '30px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                  opacity: commentText.trim() ? 1 : 0.5
                }}
              >
                <Send size={12} color="white" />
              </button>
            </form>
          ) : (
             <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>Login to post a comment</div>
          )}
        </div>
      )}

      {/* File Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleDownload}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '9px', borderRadius: '8px',
            background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
            color: '#22d3ee', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
            fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.18)'; e.currentTarget.style.borderColor = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.08)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)'; }}
        >
          <Download size={14} />
          Download
        </button>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '9px 14px', borderRadius: '8px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444', cursor: deleting ? 'not-allowed' : 'pointer', fontSize: '0.85rem',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', opacity: deleting ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <Trash2 size={14} />
            {deleting ? '...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
