import { FiHome, FiActivity, FiUser, FiLogIn, FiLogOut, FiMenu, FiX } from 'react-icons/fi'; 
import { FaDumbbell } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showEmail, setShowEmail] = useState(false); // State to control email visibility

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();
    
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // Redirect to home page instead of reloading
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <FaDumbbell className="logo-icon" />
          <span>
  <a 
    href="https://github.com/sidharth0909/FitX" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    FitX
  </a>
</span>

        </div>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          {/* Show user email only when Profile is clicked */}
          {user && showEmail && (
            <div className="user-info">
              <span className="user-email">{user.email}</span>
            </div>
          )}

          <a href="/" className="nav-link">
            <FiHome className="nav-icon" />
            <span>Home</span>
          </a>

          {user && (
            <a href="/dashboard" className="nav-link">
              <FiActivity className="nav-icon" />
              <span>Dashboard</span>
            </a>
          )}

          {user ? (
            <>
              <button 
                className="nav-link profile-btn" 
                onClick={() => setShowEmail(!showEmail)} // Toggle email visibility
              >
                <FiUser className="nav-icon" />
                <span>Profile</span>
              </button>
              <button onClick={handleLogout} className="nav-link logout">
                <FiLogOut className="nav-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <a href="/login" className="nav-link">
              <FiLogIn className="nav-icon" />
              <span>Login</span>
            </a>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
};

// Updated CSS Styles
const styles = `
/* Navbar Styles */
.navbar {
  background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(26, 34, 56) 100%);
  color: white;
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar.scrolled {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  gap: 0.5rem;
}

.logo-icon {
  color: #3a86ff;
  font-size: 1.8rem;
  transition: transform 0.3s ease;
}

.logo-icon:hover {
  transform: rotate(15deg);
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #3a86ff;
  transition: all 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
  left: 0;
}

.user-info {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.user-email {
  color: #b8c2d9;
  font-size: 0.9rem;
  font-style: italic;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-link.logout {
  color: #ff5e62;
  background: rgb(255, 253, 253);
}

.nav-link.logout:hover {
  background: rgb(255, 0, 0);
  color:rgb(255, 255, 255);
}

.nav-icon {
  font-size: 1.2rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mobile-menu-btn:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .navbar-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(26, 26, 46, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 2rem;
    gap: 1.5rem;
    transform: translateY(-150%);
    transition: transform 0.3s ease;
    z-index: 999;
  }

  .navbar-links.active {
    transform: translateY(0);
  }

  .user-info {
    margin-right: 0;
    margin-bottom: 1rem;
    text-align: center;
  }

  .user-email {
    max-width: 100%;
  }

  .mobile-menu-btn {
    display: block;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 1rem;
  }
}


.profile-btn {
  background: transparent;
  color: white;
  border: 1px solid white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  cursor: pointer;
}

.profile-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.profile-btn:disabled {
  background: rgba(255, 255, 255, 0.2);
  color: #ccc;
  cursor: not-allowed;
}
.profile-btn {
  color: white !important;
}


`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Navbar;