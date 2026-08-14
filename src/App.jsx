import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

const FalconXPlay = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [games, setGames] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [formData, setFormData] = useState({
    gameName: '',
    team1: '',
    team2: '',
    nextGameTime: '',
    lastScore1: '',
    lastScore2: '',
    liveScore1: '',
    liveScore2: '',
    isLive: false,
  });

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('falconxplay_games');
    const savedPassword = localStorage.getItem('falconxplay_password');
    
    if (saved) setGames(JSON.parse(saved));
    if (savedPassword) setAdminPassword(savedPassword);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('falconxplay_games', JSON.stringify(games));
  }, [games]);

  const handleAdminLogin = () => {
    if (!adminPassword && passwordInput.trim()) {
      setAdminPassword(passwordInput);
      setPasswordInput('');
      setIsAdmin(true);
      setShowAdminModal(false);
    } else if (passwordInput === adminPassword) {
      setIsAdmin(true);
      setPasswordInput('');
      setShowAdminModal(false);
    } else {
      alert('Wrong password!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setPasswordInput('');
    setShowAdminModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddGame = () => {
    if (!formData.gameName || !formData.team1 || !formData.team2) {
      alert('Please fill all required fields');
      return;
    }

    if (editingId) {
      setGames(games.map(g => g.id === editingId ? { ...formData, id: editingId } : g));
      setEditingId(null);
    } else {
      setGames([...games, { ...formData, id: Date.now() }]);
    }

    setFormData({
      gameName: '',
      team1: '',
      team2: '',
      nextGameTime: '',
      lastScore1: '',
      lastScore2: '',
      liveScore1: '',
      liveScore2: '',
      isLive: false,
    });
  };

  const handleEditGame = (game) => {
    setEditingId(game.id);
    setFormData(game);
  };

  const handleDeleteGame = (id) => {
    setGames(games.filter(g => g.id !== id));
  };

  // Separate live and other games
  const liveGames = games.filter(g => g.isLive);
  const otherGames = games.filter(g => !g.isLive);

  // Admin Dashboard Component
  if (isAdmin) {
    return (
      <div style={adminStyles.container}>
        <style>{adminCssStyles}</style>

        <div style={adminStyles.adminContainer}>
          <div style={adminStyles.adminHeader}>
            <div style={adminStyles.adminTitle}>⚙️ Admin Dashboard</div>
            <button style={adminStyles.logoutBtn} onClick={handleAdminLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>

          <div style={adminStyles.adminForm}>
            <h2 style={adminStyles.formTitle}>
              {editingId ? '✏️ Edit Game' : '➕ Add New Game'}
            </h2>

            <div style={adminStyles.formGrid}>
              <div style={adminStyles.formGroup}>
                <label style={adminStyles.label}>Game Name *</label>
                <input
                  type="text"
                  name="gameName"
                  placeholder="e.g., Cricket, Football, Throwball"
                  value={formData.gameName}
                  onChange={handleInputChange}
                  style={adminStyles.input}
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.label}>Team 1 Name *</label>
                <input
                  type="text"
                  name="team1"
                  placeholder="e.g., Red Dragons"
                  value={formData.team1}
                  onChange={handleInputChange}
                  style={adminStyles.input}
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.label}>Team 2 Name *</label>
                <input
                  type="text"
                  name="team2"
                  placeholder="e.g., Blue Thunder"
                  value={formData.team2}
                  onChange={handleInputChange}
                  style={adminStyles.input}
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.label}>Next Game Time</label>
                <input
                  type="datetime-local"
                  name="nextGameTime"
                  value={formData.nextGameTime}
                  onChange={handleInputChange}
                  style={adminStyles.input}
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.label}>Last Game - {formData.team1} Score</label>
                <input
                  type="number"
                  name="lastScore1"
                  placeholder="0"
                  value={formData.lastScore1}
                  onChange={handleInputChange}
                  style={adminStyles.input}
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.label}>Last Game - {formData.team2} Score</label>
                <input
                  type="number"
                  name="lastScore2"
                  placeholder="0"
                  value={formData.lastScore2}
                  onChange={handleInputChange}
                  style={adminStyles.input}
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.label}>Live Score - {formData.team1}</label>
                <input
                  type="number"
                  name="liveScore1"
                  placeholder="0"
                  value={formData.liveScore1}
                  onChange={handleInputChange}
                  style={adminStyles.input}
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.label}>Live Score - {formData.team2}</label>
                <input
                  type="number"
                  name="liveScore2"
                  placeholder="0"
                  value={formData.liveScore2}
                  onChange={handleInputChange}
                  style={adminStyles.input}
                />
              </div>
            </div>

            <div style={adminStyles.checkboxGroup}>
              <input
                type="checkbox"
                name="isLive"
                checked={formData.isLive}
                onChange={handleInputChange}
              />
              <label style={adminStyles.checkboxLabel}>
                Game is LIVE right now! 🔴
              </label>
            </div>

            <div style={adminStyles.formButtons}>
              <button style={adminStyles.btnSave} onClick={handleAddGame}>
                <Plus size={18} /> {editingId ? 'Update Game' : 'Add Game'}
              </button>
              {editingId && (
                <button
                  style={adminStyles.btnCancel}
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      gameName: '',
                      team1: '',
                      team2: '',
                      nextGameTime: '',
                      lastScore1: '',
                      lastScore2: '',
                      liveScore1: '',
                      liveScore2: '',
                      isLive: false,
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 style={{color: '#FFD700', marginBottom: '1.5rem', fontFamily: 'Poppins'}}>
              📊 All Games ({games.length})
            </h2>
            {games.length === 0 ? (
              <div style={{textAlign: 'center', color: '#999', padding: '2rem'}}>
                No games yet. Add your first game above! ⬆️
              </div>
            ) : (
              <div style={adminStyles.gamesGrid}>
                {games.map(game => (
                  <div key={game.id} style={adminStyles.gameCard}>
                    <h3 style={{color: '#FFD700', marginBottom: '1rem'}}>🎮 {game.gameName}</h3>
                    <div style={adminStyles.gameInfo}>
                      <strong>{game.team1}</strong> vs <strong>{game.team2}</strong>
                    </div>
                    {game.lastScore1 || game.lastScore2 ? (
                      <div style={adminStyles.gameInfo}>
                        📅 Last: <strong>{game.lastScore1} - {game.lastScore2}</strong>
                      </div>
                    ) : null}
                    {game.nextGameTime && (
                      <div style={adminStyles.gameInfo}>
                        ⏰ Next: <strong>{new Date(game.nextGameTime).toLocaleString()}</strong>
                      </div>
                    )}
                    {game.isLive && (
                      <div style={{...adminStyles.gameInfo, color: '#FF3333', fontWeight: '700'}}>
                        🔴 LIVE: {game.liveScore1} - {game.liveScore2}
                      </div>
                    )}
                    <div style={adminStyles.gameActions}>
                      <button
                        style={adminStyles.btnSmall}
                        onClick={() => handleEditGame(game)}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        style={{...adminStyles.btnSmall, background: 'rgba(255, 51, 51, 0.2)', color: '#FF3333', border: '1px solid #FF3333'}}
                        onClick={() => handleDeleteGame(game.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PUBLIC VIEW - ALWAYS SHOWN (FIXED!)
  return (
    <div style={publicStyles.heroContainer}>
      <style>{publicCssStyles}</style>

      <div style={publicStyles.animatedBg}></div>
      
      <div style={publicStyles.content}>
        {/* Navigation */}
        <div style={publicStyles.navbar}>
          <div style={publicStyles.logo}>🎮 FalconXPlay</div>
          <button style={publicStyles.adminLink} onClick={() => setShowAdminModal(true)}>
            ⚙️ Admin
          </button>
        </div>

        {/* Header */}
        <div style={publicStyles.header}>
          <div style={publicStyles.headerTitle}>🏆 GAME TRACKER</div>
          <div style={publicStyles.headerSubtitle}>Real-time Sports Updates & Scores</div>
          <div style={publicStyles.statusBadges}>
            <div style={{...publicStyles.badge, ...(liveGames.length > 0 ? publicStyles.badgeLive : {})}}>
              🔴 {liveGames.length} Game{liveGames.length !== 1 ? 's' : ''} Live
            </div>
            <div style={publicStyles.badge}>
              📊 {games.length} Total Game{games.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Games Section */}
        <div style={publicStyles.gamesContainer}>
          {/* Live Games */}
          {liveGames.length > 0 && (
            <div>
              <h2 style={{color: '#FF3333', marginBottom: '1.5rem', fontSize: '1.8rem', fontFamily: 'Poppins', fontWeight: '700'}}>
                🔴 LIVE NOW!
              </h2>
              <div style={publicStyles.gamesGrid}>
                {liveGames.map(game => (
                  <GameCard key={game.id} game={game} isLive={true} />
                ))}
              </div>
            </div>
          )}

          {/* Other Games */}
          {otherGames.length > 0 && (
            <div>
              <h2 style={{color: '#FFD700', marginBottom: '1.5rem', marginTop: liveGames.length > 0 ? '3rem' : '0', fontSize: '1.8rem', fontFamily: 'Poppins', fontWeight: '700'}}>
                📊 All Games
              </h2>
              <div style={publicStyles.gamesGrid}>
                {otherGames.map(game => (
                  <GameCard key={game.id} game={game} isLive={false} />
                ))}
              </div>
            </div>
          )}

          {games.length === 0 && (
            <div style={publicStyles.noGames}>
              <div style={publicStyles.noGamesEmoji}>🎮</div>
              <div>No games yet!</div>
              <div style={{fontSize: '0.9rem', color: '#555', marginTop: '1rem'}}>
                Check back soon for exciting matches!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={publicStyles.footer}>
          © 2024 FalconXPlay - Your Game, Your Score
        </div>
      </div>

      {/* LOGIN MODAL - SHOWN OVER GAMES (FIXED!) */}
      {showAdminModal && (
        <div style={publicStyles.modalOverlay}>
          <div style={publicStyles.loginCard}>
            {!adminPassword ? (
              <>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔐</div>
                <div style={publicStyles.loginTitle}>Set Admin Password</div>
                <div style={publicStyles.loginSubtitle}>First time? Create your secure password</div>

                <div style={publicStyles.loginForm}>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                    style={publicStyles.loginInput}
                  />
                  <button style={publicStyles.loginBtn} onClick={handleAdminLogin}>
                    <Lock size={20} /> Set & Login
                  </button>
                </div>

                <div style={publicStyles.infoText}>
                  💡 This password will be saved locally
                </div>
              </>
            ) : (
              <>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔓</div>
                <div style={publicStyles.loginTitle}>Admin Login</div>
                <div style={publicStyles.loginSubtitle}>Enter your password to manage games</div>

                <div style={publicStyles.loginForm}>
                  <div style={{position: 'relative'}}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      style={publicStyles.loginInput}
                    />
                    <button
                      style={publicStyles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button style={publicStyles.loginBtn} onClick={handleAdminLogin}>
                    <Lock size={20} /> Login to Dashboard
                  </button>
                </div>

                <div style={publicStyles.infoText}>
                  🎮 Public users: Scroll down to see all games!
                </div>
              </>
            )}

            <button
              style={publicStyles.closeBtn}
              onClick={() => {
                setShowAdminModal(false);
                setPasswordInput('');
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Game Card Component
const GameCard = ({ game, isLive }) => {
  return (
    <div style={publicStyles.gameCard}>
      <div style={publicStyles.gameHeader}>
        <div style={publicStyles.gameName}>{game.gameName}</div>
        {isLive && <div style={publicStyles.liveBadge}>🔴 LIVE</div>}
      </div>

      <div style={publicStyles.scoreboard}>
        <div style={publicStyles.scoreRow}>
          <div style={publicStyles.teamName}>{game.team1}</div>
          <div>
            <div style={{...publicStyles.score, ...(isLive ? publicStyles.scoreLive : {})}}>{isLive ? game.liveScore1 : game.lastScore1 || '0'}</div>
            <div style={publicStyles.scoreLabel}>{isLive ? 'Live' : 'Last'}</div>
          </div>
          <div style={publicStyles.vsText}>vs</div>
        </div>

        <div style={publicStyles.scoreRow}>
          <div>
            <div style={{...publicStyles.score, ...(isLive ? publicStyles.scoreLive : {})}}>{isLive ? game.liveScore2 : game.lastScore2 || '0'}</div>
            <div style={publicStyles.scoreLabel}>{isLive ? 'Live' : 'Last'}</div>
          </div>
          <div style={publicStyles.vsText}></div>
          <div style={{...publicStyles.teamName, textAlign: 'right'}}>{game.team2}</div>
        </div>
      </div>

      {game.nextGameTime && (
        <div style={publicStyles.gameInfo}>
          <div style={publicStyles.infoItem}>
            <span>⏰</span>
            <div>
              <div style={{fontSize: '0.9rem'}}>
                {new Date(game.nextGameTime).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div style={publicStyles.infoLabel}>Next Game</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== STYLES =====

const adminCssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; }
`;

const adminStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1428 100%)',
    padding: '2rem'
  },
  adminContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  adminHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  adminTitle: {
    fontFamily: 'Poppins',
    fontSize: '2rem',
    fontWeight: '800',
    color: '#FFD700',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
  },
  logoutBtn: {
    background: 'linear-gradient(135deg, #FF3333 0%, #CC0000 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  adminForm: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  formTitle: {
    color: '#00FF41',
    marginBottom: '1.5rem',
    fontFamily: 'Poppins',
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    fontFamily: 'Inter',
    fontSize: '1rem',
    transition: 'border-color 0.2s'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: 'rgba(0, 255, 65, 0.05)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(0, 255, 65, 0.2)'
  },
  checkboxLabel: {
    margin: 0,
    color: '#00FF41',
    fontWeight: '600'
  },
  formButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '1.5rem'
  },
  btnSave: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#0A1428',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    transition: 'all 0.2s',
    flex: 1,
    minWidth: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  btnCancel: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#FFD700',
    border: '1px solid #FFD700',
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  gameCard: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '1rem',
    padding: '1.5rem',
    transition: 'all 0.2s'
  },
  gameHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem'
  },
  gameName: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#FFD700'
  },
  gameInfo: {
    color: '#E0E7FF',
    fontSize: '0.9rem',
    marginBottom: '0.5rem'
  },
  gameActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1.5rem'
  },
  btnSmall: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #0066FF',
    borderRadius: '0.4rem',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
    background: 'rgba(0, 102, 255, 0.2)',
    color: '#0066FF'
  }
};

const publicCssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1428 100%);
    color: #e0e7ff;
    min-height: 100vh;
  }
`;

const publicStyles = {
  heroContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, rgba(10, 20, 40, 0.95) 0%, rgba(26, 31, 58, 0.95) 50%, rgba(15, 20, 40, 0.95) 100%)',
    overflow: 'auto',
    position: 'relative'
  },
  animatedBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 20% 50%, rgba(0, 102, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
    animation: 'shift 15s ease-in-out infinite',
    pointerEvents: 'none'
  },
  content: {
    position: 'relative',
    zIndex: 10
  },
  navbar: {
    backdropFilter: 'blur(10px)',
    background: 'rgba(10, 20, 40, 0.7)',
    borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logo: {
    fontFamily: 'Poppins',
    fontSize: '1.8rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px'
  },
  adminLink: {
    background: 'linear-gradient(135deg, #0066FF 0%, #00CCFF 100%)',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '0.9rem'
  },
  header: {
    textAlign: 'center',
    padding: '4rem 2rem 2rem'
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
    color: '#FFD700',
    textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
    letterSpacing: '-1px'
  },
  headerSubtitle: {
    fontSize: '1.2rem',
    color: '#A0AEC0',
    marginBottom: '2rem'
  },
  statusBadges: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2rem'
  },
  badge: {
    background: 'rgba(0, 255, 65, 0.15)',
    border: '1px solid rgba(0, 255, 65, 0.5)',
    color: '#00FF41',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  badgeLive: {
    background: 'rgba(255, 51, 51, 0.15)',
    borderColor: 'rgba(255, 51, 51, 0.5)',
    color: '#FF3333'
  },
  gamesContainer: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  gameCard: {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '1.5rem',
    padding: '2rem',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  gameHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1.5rem'
  },
  gameName: {
    fontFamily: 'Poppins',
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#FFD700',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
  },
  liveBadge: {
    background: 'linear-gradient(135deg, #FF3333, #CC0000)',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '0.4rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem'
  },
  scoreboard: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8), rgba(10, 20, 40, 0.8))',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    fontFamily: 'JetBrains Mono'
  },
  scoreRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  teamName: {
    color: '#A0AEC0',
    fontSize: '0.9rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  score: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#00FF41',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(0, 255, 65, 0.5)',
    minWidth: '80px'
  },
  scoreLive: {
    color: '#FF3333'
  },
  vsText: {
    color: '#FFD700',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: '1rem'
  },
  scoreLabel: {
    fontSize: '0.7rem',
    color: '#888',
    textAlign: 'center',
    marginTop: '0.3rem'
  },
  gameInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 215, 0, 0.2)'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#E0E7FF',
    fontSize: '0.95rem'
  },
  infoLabel: {
    color: '#888',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '0.3rem'
  },
  noGames: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#888',
    fontSize: '1.2rem'
  },
  noGamesEmoji: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  footer: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
    borderTop: '1px solid rgba(255, 215, 0, 0.1)',
    marginTop: '4rem',
    fontSize: '0.9rem'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  loginCard: {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '1.5rem',
    padding: '3rem 2rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    position: 'relative'
  },
  loginTitle: {
    fontFamily: 'Poppins',
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: '0.5rem',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
  },
  loginSubtitle: {
    color: '#A0AEC0',
    marginBottom: '2rem',
    fontSize: '0.95rem'
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  loginInput: {
    width: '100%',
    padding: '0.85rem',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '0.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    fontSize: '1rem',
    fontFamily: 'Inter',
    transition: 'all 0.2s'
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#FFD700',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginBtn: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#0A1428',
    border: 'none',
    padding: '0.85rem',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  infoText: {
    color: '#00FF41',
    fontSize: '0.85rem',
    marginTop: '1.5rem',
    fontWeight: '600'
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: '#FFD700',
    fontSize: '1.5rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default FalconXPlay;
