import React from 'react';

import successIcon from '../images/icon-sucsess.svg';
import errorIcon from '../images/icon-error.svg';

export const TooltipContext = React.createContext();

export const tooltipContent = {
  default: { icon: '', message: '' },
  registrationSuccess: {
    icon: successIcon,
    message: 'Вы успешно зарегистрировались!'
  },
  registrationError: {
    icon: errorIcon,
    message: 'Что-то пошло не так! Попробуйте ещё раз.'
  },
  signinError: {
    icon: errorIcon,
    message: 'Не удалось войти! Попробуйте ещё раз.'
  },
  pageNotFound: {
    icon: errorIcon,
    message: 'Страницы не существует. Сейчас перенаправим вас.'
  }
};
