import React from 'react';

import { TooltipContext } from '../../contexts/tooltipContext.js';

import styles from './InfoTooltip.module.css';

const InfoToolTip = ({ isOpened, onClose, toShow }) => {
  const content = React.useContext(TooltipContext);

  return (
    <div className={`popup ${isOpened ? 'popup_opened' : ''}`}>
      <div className={`popup__container ${styles['infotooltip-container']}`}>
        <img className={styles['infotooltip-icon']} src={content[toShow].icon} alt="Иконка" />
        <div className={styles['infotooltip-message']}>{content[toShow].message}</div>

        <button
          id="close-photo-window-button"
          type="button"
          className="button popup__close-button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};

export default InfoToolTip;
