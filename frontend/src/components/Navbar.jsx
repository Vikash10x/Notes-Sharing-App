import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Upload, LayoutDashboard, LogOut, LogIn, UserPlus, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(10, 15, 30, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={18} color="white" />
          </div>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>NoteShare</span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  background: isActive('/') ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: isActive('/') ? '#6366f1' : '#94a3b8',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!isActive('/')) { e.target.style.background = 'rgba(99,102,241,0.1)'; e.target.style.color = '#6366f1'; }}}
                  onMouseLeave={e => { if (!isActive('/')) { e.target.style.background = 'transparent'; e.target.style.color = '#94a3b8'; }}}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
              </Link>
              <Link to="/upload" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  background: isActive('/upload') ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: isActive('/upload') ? '#6366f1' : '#94a3b8',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!isActive('/upload')) { e.target.style.background = 'rgba(99,102,241,0.1)'; e.target.style.color = '#6366f1'; }}}
                  onMouseLeave={e => { if (!isActive('/upload')) { e.target.style.background = 'transparent'; e.target.style.color = '#94a3b8'; }}}
                >
                  <Upload size={16} />
                  Upload
                </button>
              </Link>

              <div style={{ width: '1px', height: '24px', background: '#1e293b', margin: '0 4px' }} />

              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px',
                  background: 'rgba(99,102,241,0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(99,102,241,0.2)',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: '700', color: 'white',
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '0.88rem', fontWeight: '500' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                </div>
              </Link>

              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '500',
                fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '8px',
                  background: 'transparent', border: '1px solid #1e293b',
                  color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif', fontWeight: '500', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <LogIn size={15} />
                  Login
                </button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif', fontWeight: '600', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <UserPlus size={15} />
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
