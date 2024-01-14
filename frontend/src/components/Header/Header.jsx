import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header({ userEmail, onSignOut }) {
  return (
    <header className="header">
      <a href="#" className="header__logo"></a>
      <Routes>
        <Route
          path="/"
          element={
            <span className={styles['header-content']}>
              <span className={styles['header-email']}>{userEmail}</span>
              <span className={styles['header-link']} onClick={onSignOut}>
                Выйти
              </span>
            </span>
          }
        ></Route>
        <Route
          path="/sign-up"
          element={
            <Link className={styles['header-link']} to="/sign-in">
              Войти
            </Link>
          }
        ></Route>
        <Route
          path="/sign-in"
          element={
            <Link className={styles['header-link']} to="/sign-up">
              Зарегистрироваться
            </Link>
          }
        ></Route>
        <Route path="*" element={<span></span>} />
      </Routes>
    </header>
  );
}

export default Header;
