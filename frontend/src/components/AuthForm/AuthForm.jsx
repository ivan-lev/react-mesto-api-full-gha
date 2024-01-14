import React from 'react';
import styles from './AuthForm.module.css';

function AuthForm({
  title,
  name,
  submitButtonText,
  onChange,
  onSubmit,
  autocompleteParams,
  ...props
}) {
  return (
    <>
      <p className={`popup__heading ${styles['auth-form__heading']}`}>{title}</p>
      <form
        id="popup__register-form"
        name={`popup_type_${name}`}
        className={`popup__form ${styles['auth-form__form']}`}
        onSubmit={onSubmit}
      >
        <fieldset className="popup__fieldset">
          <input
            type="email"
            autoComplete={autocompleteParams.email}
            placeholder="Email"
            id="email"
            name="email"
            className={`popup__input ${styles['auth-form__input']}`}
            required
            onChange={onChange}
          />
          <span className="popup__error"></span>
        </fieldset>
        <fieldset className="popup__fieldset">
          <input
            type="password"
            autoComplete={autocompleteParams.password}
            placeholder="Пароль"
            id="password"
            name="password"
            className={`popup__input ${styles['auth-form__input']}`}
            onChange={onChange}
            required
          />
          <span className="popup__error"></span>
        </fieldset>

        <button type="submit" className={`button ${styles['auth-form__button']}`}>
          {submitButtonText}
        </button>
      </form>
      {props.children}
    </>
  );
}

export default AuthForm;
