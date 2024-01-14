import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoToolTip from '../InfoToolTip/InfoTooltip.jsx';

import styles from './PageNotFound.module.css';

const PageNotFound = props => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(redirectToMainPage, 3000);
  }, []);

  const redirectToMainPage = () => {
    navigate('/', { replace: true });
  };

  return <InfoToolTip isOpened={true} onClose={redirectToMainPage} toShow="pageNotFound" />;
};

export default PageNotFound;
