import { FaDumbbell, FaHeart, FaArrowRight } from 'react-icons/fa';
import { FiFacebook, FiGithub, FiInstagram, FiGit, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#3a86ff"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#3a86ff"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#3a86ff"></path>
        </svg>
      </div>

      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo-container">
              <FaDumbbell className="footer-logo" />
              <span className="brand-name">FitX</span>
            </div>
            <p className="brand-tagline">Transform your fitness journey with AI-powered tracking</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook" className="social-icon">
                <FiFacebook />
              </a>
              <a href="#" aria-label="Instagram" className="social-icon">
                <FiInstagram />
              </a>
              <a href="https://github.com/sidharth0909/FitX" aria-label="Gihtub" className="social-icon">
                <FiGithub />
              </a>
              <a href="#" aria-label="YouTube" className="social-icon">
                <FiYoutube />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="column-title">Navigation</h4>
              <ul>
                <li><a href="/" className="link-item"><FaArrowRight className="link-icon" /> Home</a></li>
                <li><a href="/dashboard" className="link-item"><FaArrowRight className="link-icon" /> Dashboard</a></li>
                <li><a href="/login" className="link-item"><FaArrowRight className="link-icon" /> Login</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="column-title">Resources</h4>
              <ul>
                <li><a href="#" className="link-item"><FaArrowRight className="link-icon" /> Blog</a></li>
                <li><a href="#" className="link-item"><FaArrowRight className="link-icon" /> Exercises</a></li>
                <li><a href="#" className="link-item"><FaArrowRight className="link-icon" /> Nutrition</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="column-title">Legal</h4>
              <ul>
                <li><a href="#" className="link-item"><FaArrowRight className="link-icon" /> Terms</a></li>
                <li><a href="#" className="link-item"><FaArrowRight className="link-icon" /> Privacy</a></li>
                <li><a href="#" className="link-item"><FaArrowRight className="link-icon" /> Cookies</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="column-title">Newsletter</h4>
              <p className="newsletter-text">Subscribe for fitness tips and updates</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email" className="newsletter-input" />
                <button type="submit" className="newsletter-button">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} FitX. All rights reserved.
            </p>
            <p className="made-with">
              Made with <FaHeart className="heart-icon" /> by FitX Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const styles = `
/* Footer Styles */
.footer {
  position: relative;
  background: linear-gradient(135deg,rgb(9, 9, 9) 0%,rgb(16, 23, 42) 100%);
  color: white;
  margin-top: 20rem;
  overflow: hidden;
}

.footer-wave {
  position: absolute;
  top: -50px;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 1;
}

.footer-content {
  position: relative;
  z-index: 2;
  padding-top: 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-logo {
  color: #3a86ff;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 12px;
}

.brand-name {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(90deg,rgb(233, 233, 233),rgb(255, 255, 255));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-tagline {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.column-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.column-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #3a86ff, #4cc9f0);
  border-radius: 3px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.link-item:hover {
  color: #3a86ff;
  transform: translateX(5px);
}

.link-icon {
  font-size: 0.8rem;
  color: #3a86ff;
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.social-icon {
  color: white;
  font-size: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: #3a86ff;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(58, 134, 255, 0.3);
}

.newsletter-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.95rem;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.newsletter-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.newsletter-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #3a86ff, #4cc9f0);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.newsletter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(58, 134, 255, 0.4);
}

.footer-bottom {
  margin-top: 2rem;
  padding: 1rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright, .made-with {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.heart-icon {
  color: #ff5e62;
  margin: 0 0.2rem;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-brand {
    text-align: center;
    align-items: center;
  }
  
  .footer-social {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 1.5rem;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .footer-wave {
    top: -50px;
    height: 50px;
  }
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);