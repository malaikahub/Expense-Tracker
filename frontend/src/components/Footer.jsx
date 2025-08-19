
import { motion } from "framer-motion";
import "./Footer.css";

const Footer = () => {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="footer-top">
        <motion.div
          className="footer-column"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3>Apex Marketing</h3>
          <ul>
            <li>About Us</li>
            <li>Our Services</li>
            <li>Case Studies</li>
            <li>Blog</li>
          </ul>
        </motion.div>

        <motion.div
          className="footer-column"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3>Support</h3>
          <ul>
            <li>FAQs</li>
            <li>Contact Us</li>
            <li>Client Portal</li>
            <li>Careers</li>
          </ul>
        </motion.div>

        <motion.div
          className="footer-column"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3>Global</h3>
          <ul>
            <li>Apex Canada</li>
            <li>Apex UK</li>
            <li>Apex UAE</li>
            <li>Apex Pakistan</li>
          </ul>
        </motion.div>

        <motion.div
          className="footer-column subscribe-box"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          <h3>Get the Latest News</h3>
          <input type="email" placeholder="Your email here" />
          <button>Subscribe</button>
          <div className="checkbox-wrapper">
            <label>
              <input type="checkbox" />
              <span>
                By checking the box, you agree that you're at least 16 years old.
              </span>
            </label>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="footer-social"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <i className="fab fa-facebook-f"></i>
        <i className="fab fa-twitter"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-linkedin-in"></i>
        <i className="fab fa-youtube"></i>
      </motion.div>

      <hr />

      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <ul>
          <li>Terms</li>
          <li>Privacy Policy</li>
          <li>Accessibility</li>
          <li>Supplier Code of Conduct</li>
          <li>Do Not Sell My Info</li>
        </ul>
        <p>© 2025 Apex Marketing Solutions. All rights reserved.</p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
