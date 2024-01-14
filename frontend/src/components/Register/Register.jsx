import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../AuthForm/AuthForm.jsx';
import styles from './Register.module.css';

function Register({ title, name, submitButtonText, onRegister, ...props }) {
  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onRegister(formValue.password, formValue.email);
  };

  return (
    <section className={styles['auth-window']}>
      <AuthForm
        title={title}
        name={name}
        submitButtonText={submitButtonText}
        onChange={handleChange}
        onSubmit={handleSubmit}
        autocompleteParams={{ email: 'email', password: 'new-password' }}
      />
      <p className={styles['auth-window__text']}>
        Уже зарегистрированы?&nbsp;
        <Link className={styles['auth-window__link']} to="/sign-in">
          Войти
        </Link>
      </p>
      {props.children}
    </section>
  );
}

export default Register;
