import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

const FalconXPlay = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [games, setGames] = useState([]);
  const [editingId, setEditingId] = useState(null);
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
    } else if (passwordInput === adminPassword) {
      setIsAdmin(true);
      setPasswordInput('');
    } else {
      alert('Wrong password!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setPasswordInput('');
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

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;500;600&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; }
          
          .admin-container {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .admin-title {
            font-family: 'Poppins', sans-serif;
            font-size: 2rem;
            font-weight: 800;
            color: #FFD700;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          }
          
          .logout-btn {
            background: linear-gradient(135deg, #FF3333 0%, #CC0000 100%);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(255, 51, 51, 0.3);
          }
          
          .admin-form {
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }
          
          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }
          
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .form-group label {
            color: #FFD700;
            font-weight: 600;
            font-size: 0.9rem;
          }
          
          .form-group input,
          .form-group select {
            padding: 0.75rem;
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            color: white;
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            transition: border-color 0.2s;
          }
          
          .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
          
          .form-group input:focus,
          .form-group select:focus {
            outline: none;
            border-color: #FFD700;
            background: rgba(255, 215, 0, 0.05);
          }
          
          .checkbox-group {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: rgba(0, 255, 65, 0.05);
            border-radius: 0.5rem;
            border: 1px solid rgba(0, 255, 65, 0.2);
          }
          
          .checkbox-group input {
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
          
          .form-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }
          
          .btn-save {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #0A1428;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 700;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
            flex: 1;
            min-width: 150px;
          }
          
          .btn-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
          }
          
          .btn-cancel {
            background: rgba(255, 255, 255, 0.1);
            color: #FFD700;
            border: 1px solid #FFD700;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
          }
          
          .btn-cancel:hover {
            background: rgba(255, 215, 0, 0.1);
          }
          
          .games-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
          }
          
          .game-card {
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 65, 0.3);
            border-radius: 1rem;
            padding: 1.5rem;
            transition: transform 0.2s, border-color 0.2s;
          }
          
          .game-card:hover {
            transform: translateY(-5px);
            border-color: #FFD700;
          }
          
          .game-card h3 {
            color: #FFD700;
            margin-bottom: 1rem;
            font-family: 'Poppins', sans-serif;
          }
          
          .game-info {
            color: #E0E7FF;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }
          
          .game-info strong {
            color: #00FF41;
          }
          
          .game-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1.5rem;
          }
          
          .btn-small {
            flex: 1;
            padding: 0.5rem;
            border: none;
            border-radius: 0.4rem;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.35rem;
            font-size: 0.85rem;
            transition: all 0.2s;
          }
          
          .btn-edit {
            background: rgba(0, 102, 255, 0.2);
            color: #0066FF;
            border: 1px solid #0066FF;
          }
          
          .btn-edit:hover {
            background: rgba(0, 102, 255, 0.3);
          }
          
          .btn-delete {
            background: rgba(255, 51, 51, 0.2);
            color: #FF3333;
            border: 1px solid #FF3333;
          }
          
          .btn-delete:hover {
            background: rgba(255, 51, 51, 0.3);
          }
          
          @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr;
            }
            
            .admin-title {
              font-size: 1.5rem;
            }
          }
        `}</style>

        <div className="admin-container">
          <div className="admin-header">
            <div className="admin-title">⚙️ Admin Dashboard</div>
            <button className="logout-btn" onClick={handleAdminLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>

          <div className="admin-form">
            <h2 style={{ color: '#00FF41', marginBottom: '1.5rem', fontFamily: 'Poppins' }}>
              {editingId ? '✏️ Edit Game' : '➕ Add New Game'}
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Game Name *</label>
                <input
                  type="text"
                  name="gameName"
                  placeholder="e.g., Cricket, Football, Throwball"
                  value={formData.gameName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Team 1 Name *</label>
                <input
                  type="text"
                  name="team1"
                  placeholder="e.g., Red Dragons"
                  value={formData.team1}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Team 2 Name *</label>
                <input
                  type="text"
                  name="team2"
                  placeholder="e.g., Blue Thunder"
                  value={formData.team2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Next Game Time</label>
                <input
                  type="datetime-local"
                  name="nextGameTime"
                  value={formData.nextGameTime}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Last Game - {formData.team1} Score</label>
                <input
                  type="number"
                  name="lastScore1"
                  placeholder="0"
                  value={formData.lastScore1}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Last Game - {formData.team2} Score</label>
                <input
                  type="number"
                  name="lastScore2"
                  placeholder="0"
                  value={formData.lastScore2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Live Score - {formData.team1}</label>
                <input
                  type="number"
                  name="liveScore1"
                  placeholder="0"
                  value={formData.liveScore1}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Live Score - {formData.team2}</label>
                <input
                  type="number"
                  name="liveScore2"
                  placeholder="0"
                  value={formData.liveScore2}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                name="isLive"
                checked={formData.isLive}
                onChange={handleInputChange}
              />
              <label style={{ margin: 0, color: '#00FF41', fontWeight: '600' }}>
                Game is LIVE right now! 🔴
              </label>
            </div>

            <div className="form-buttons" style={{ marginTop: '1.5rem' }}>
              <button className="btn-save" onClick={handleAddGame}>
                <Plus size={18} /> {editingId ? 'Update Game' : 'Add Game'}
              </button>
              {editingId && (
                <button
                  className="btn-cancel"
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
            <h2 style={{ color: '#FFD700', marginBottom: '1.5rem', fontFamily: 'Poppins', fontSize: '1.5rem' }}>
              📊 All Games ({games.length})
            </h2>
            {games.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
                No games yet. Add your first game above! ⬆️
              </div>
            ) : (
              <div className="games-grid">
                {games.map(game => (
                  <div key={game.id} className="game-card">
                    <h3>🎮 {game.gameName}</h3>
                    <div className="game-info">
                      <strong>{game.team1}</strong> vs <strong>{game.team2}</strong>
                    </div>
                    {game.lastScore1 || game.lastScore2 ? (
                      <div className="game-info">
                        📅 Last: <strong>{game.lastScore1} - {game.lastScore2}</strong>
                      </div>
                    ) : null}
                    {game.nextGameTime && (
                      <div className="game-info">
                        ⏰ Next: <strong>{new Date(game.nextGameTime).toLocaleString()}</strong>
                      </div>
                    )}
                    {game.isLive && (
                      <div className="game-info" style={{ color: '#FF3333', fontWeight: '700' }}>
                        🔴 LIVE: {game.liveScore1} - {game.liveScore2}
                      </div>
                    )}
                    <div className="game-actions">
                      <button
                        className="btn-small btn-edit"
                        onClick={() => handleEditGame(game)}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        className="btn-small btn-delete"
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

  if (!isAdmin && adminPassword === '') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;500;600&display=swap');
          
          .login-container {
            max-width: 400px;
            width: 100%;
          }
          
          .login-card {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 215, 0, 0.3);
            border-radius: 1.5rem;
            padding: 3rem 2rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
          }
          
          .login-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          
          .login-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.8rem;
            font-weight: 800;
            color: #FFD700;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
          }
          
          .login-subtitle {
            color: #A0AEC0;
            margin-bottom: 2rem;
            font-size: 0.95rem;
          }
          
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .login-input-group {
            position: relative;
          }
          
          .login-input-group input {
            width: 100%;
            padding: 0.85rem;
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            color: white;
            font-size: 1rem;
            font-family: 'Inter', sans-serif;
            transition: all 0.2s;
          }
          
          .login-input-group input::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }
          
          .login-input-group input:focus {
            outline: none;
            border-color: #FFD700;
            background: rgba(255, 215, 0, 0.05);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
          }
          
          .login-btn {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #0A1428;
            border: none;
            padding: 0.85rem;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 700;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          
          .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
          }
          
          .info-text {
            color: #00FF41;
            font-size: 0.85rem;
            margin-top: 1.5rem;
            font-weight: 600;
          }
        `}</style>

        <div className="login-container">
          <div className="login-card">
            <div className="login-icon">🔐</div>
            <div className="login-title">Set Admin Password</div>
            <div className="login-subtitle">First time? Create your secure password</div>

            <div className="login-form">
              <div className="login-input-group">
                <input
                  type="password"
                  placeholder="Create a password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
              <button className="login-btn" onClick={handleAdminLogin}>
                <Lock size={20} /> Set & Login
              </button>
            </div>

            <div className="info-text">
              💡 This password will be saved locally
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;500;600&display=swap');
          
          .login-container {
            max-width: 400px;
            width: 100%;
          }
          
          .login-card {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 215, 0, 0.3);
            border-radius: 1.5rem;
            padding: 3rem 2rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
          }
          
          .login-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          
          .login-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.8rem;
            font-weight: 800;
            color: #FFD700;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
          }
          
          .login-subtitle {
            color: #A0AEC0;
            margin-bottom: 2rem;
            font-size: 0.95rem;
          }
          
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .login-input-group {
            position: relative;
          }
          
          .login-input-group input {
            width: 100%;
            padding: 0.85rem;
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            color: white;
            font-size: 1rem;
            font-family: 'Inter', sans-serif;
            transition: all 0.2s;
          }
          
          .login-input-group input::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }
          
          .login-input-group input:focus {
            outline: none;
            border-color: #FFD700;
            background: rgba(255, 215, 0, 0.05);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
          }
          
          .toggle-password {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #FFD700;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .login-btn {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #0A1428;
            border: none;
            padding: 0.85rem;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 700;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          
          .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
          }
          
          .info-text {
            color: #FF3333;
            font-size: 0.85rem;
            margin-top: 1.5rem;
            font-weight: 600;
          }
        `}</style>

        <div className="login-container">
          <div className="login-card">
            <div className="login-icon">🔓</div>
            <div className="login-title">Admin Login</div>
            <div className="login-subtitle">Enter your password to manage games</div>

            <div className="login-form">
              <div className="login-input-group" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <button
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button className="login-btn" onClick={handleAdminLogin}>
                <Lock size={20} /> Login to Dashboard
              </button>
            </div>

            <div className="info-text">
              🎮 Public users: Scroll down to see all games!
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FalconXPlay;
