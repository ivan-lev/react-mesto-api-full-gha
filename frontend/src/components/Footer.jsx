import React from 'react';
import CurrentYear from './CurrentYear.jsx';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__info">
        &copy; <span className="footer__current-year">{<CurrentYear />}</span> Mesto Russia
      </p>
    </footer>
  );
}

export default Footer;
