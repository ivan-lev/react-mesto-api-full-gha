import React, { useState } from 'react';
import AuthForm from '../AuthForm/AuthForm.jsx';
import styles from './Login.module.css';

function Login({ title, name, submitButtonText, onLogin, ...props }) {
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
    onLogin(formValue.password, formValue.email);
  };

  return (
    <section className={styles['login-window']}>
      <AuthForm
        title={title}
        name={name}
        submitButtonText={submitButtonText}
        onChange={handleChange}
        onSubmit={handleSubmit}
        autocompleteParams={{ email: 'email', password: 'current-password' }}
      />
      {props.children}
    </section>
  );
}

export default Login;
