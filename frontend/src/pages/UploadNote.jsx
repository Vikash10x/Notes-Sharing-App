import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, X, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadNote = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', categoryId: '' });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getCategories().then(({ data }) => setCategories(data)).catch(() => {});
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (f) => {
    const allowed = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'];
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error('Only PDF, DOC, DOCX, TXT, PPT files allowed');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('categoryId', form.categoryId);
      fd.append('file', file);
      await createNote(fd);
      toast.success('Note uploaded successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Upload size={18} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#e2e8f0' }}>Upload Note</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Share your knowledge with the community. Supported formats: PDF, DOC, DOCX, TXT, PPT, PPTX
        </p>
      </div>

      <div className="glass-card" style={{ padding: '36px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              Note Title *
            </label>
            <input
              type="text"
              name="title"
              id="note-title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Complete Data Structures Notes - B.Tech"
              className="form-input"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              Description *
            </label>
            <textarea
              name="description"
              id="note-description"
              value={form.description}
              onChange={handleChange}
              placeholder="Briefly describe what this note covers, topics included, source, etc."
              className="form-input"
              style={{ resize: 'vertical', minHeight: '100px' }}
              required
              maxLength={500}
            />
            <p style={{ color: '#334155', fontSize: '0.78rem', marginTop: '4px', textAlign: 'right' }}>
              {form.description.length}/500
            </p>
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              Category *
            </label>
            <select
              name="categoryId"
              id="note-category"
              value={form.categoryId}
              onChange={handleChange}
              className="form-input"
              required
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* File Drop Zone */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              File *
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
              style={{
                border: `2px dashed ${dragOver ? '#6366f1' : file ? '#4ade80' : '#1e293b'}`,
                borderRadius: '12px',
                padding: '36px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? 'rgba(99,102,241,0.05)' : file ? 'rgba(74,222,128,0.04)' : 'rgba(15,23,42,0.5)',
                transition: 'all 0.25s',
              }}
            >
              <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
              />
              {file ? (
                <div>
                  <CheckCircle size={36} color="#4ade80" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px' }}>
                    {file.name}
                  </p>
                  <p style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '12px' }}>
                    {formatFileSize(file.size)}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '6px 14px', borderRadius: '6px',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                      color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <X size={12} /> Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <FileText size={36} color="#334155" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <p style={{ color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
                    Drag & drop your file here
                  </p>
                  <p style={{ color: '#334155', fontSize: '0.83rem' }}>
                    or <span style={{ color: '#818cf8', fontWeight: '600' }}>click to browse</span>
                  </p>
                  <p style={{ color: '#1e293b', fontSize: '0.75rem', marginTop: '8px' }}>
                    PDF, DOC, DOCX, TXT, PPT · Max 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ flex: 2 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Loader size={16} className="animate-spin" />
                  Uploading...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Upload size={16} />
                  Upload Note
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadNote;
