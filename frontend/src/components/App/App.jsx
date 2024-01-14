import './App.css';
import { React, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';
import * as auth from '../../utils/auth.js';
import CurrentUserContext from '../../contexts/currentUserContext.js';
import { TooltipContext, tooltipContent } from '../../contexts/tooltipContext.js';

import Header from '../Header/Header.jsx';
import Main from '../Main.jsx';
import Footer from '../Footer.jsx';
import Register from '../Register/Register.jsx';
import Login from '../Login/Login.jsx';

import ImagePopup from '../ImagePopup.jsx';
import EditProfilePopup from '../EditProfilePopup.jsx';
import EditAvatarPopup from '../EditAvatarPopup.jsx';
import AddPlacePopup from '../AddPlacePopup.jsx';
import DeleteCardPopup from '../DeleteCardPopup.jsx';
import InfoToolTip from '../InfoToolTip/InfoTooltip.jsx';

import ProtectedRouteElement from '../ProtectedRoute.jsx';
import PageNotFound from '../PageNotFound/PageNotFound.jsx';

function App() {
  const localLoggedInState = JSON.parse(localStorage.getItem('loggedIn'));
  const [loggedIn, setLoggedIn] = useState(localLoggedInState);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isCardDeletePopupOpen, setIsCardDeletePopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [userEmail, setUserEmail] = useState(null);
  const [isTooltipShown, setIsTooltipShown] = useState(false);
  const [currentTooltipContent, setCurrentTooltipContent] = useState('default');

  const navigate = useNavigate();

  useEffect(() => {
    if (
      isEditAvatarPopupOpen ||
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      selectedCard ||
      isCardDeletePopupOpen ||
      isTooltipShown
    ) {
      document.addEventListener('keyup', handleEscClose);
    }

    return () => {
      document.removeEventListener('keyup', handleEscClose);
    };
  }, [
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isCardDeletePopupOpen,
    selectedCard,
    isTooltipShown
  ]);

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then(response => setCurrentUser(response))
        .catch(error => console.error('Ошибка получения информации о пользователе: ', error));

      api
        .getInitialCards()
        .then(response => setCards(response))
        .catch(error => console.error('Ошибка получения карточек: ', error));
    }
  }, [loggedIn]);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = card => {
    setSelectedCard(card);
  };

  const handleDeleteButtonClick = card => {
    setIsCardDeletePopupOpen(true);
    setCardToDelete(card);
  };

  const handleEscClose = event => {
    if (event.key === 'Escape') {
      closeAllPopups();
    }
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardDeletePopupOpen(false);
    if (selectedCard) {
      setSelectedCard(null);
    }
    if (cardToDelete) {
      setCardToDelete({});
    }
    setIsTooltipShown(false);
    setTimeout(() => setCurrentTooltipContent('default'), 500);
  };

  const handleCardLike = card => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api
      .handleLikeRequest(card._id, !isLiked)
      .then(newCard => {
        setCards(state => state.map(c => (c._id === card._id ? newCard : c)));
      })
      .catch(error => console.error('Лайк не поставился, произошла ошибка: ', error));
  };

  const handleCardDeleteWithPopup = () => {
    api
      .deleteCard(cardToDelete._id)
      .then(response => {
        const cardsFiltered = cards.filter(cardToCheck => {
          return cardToCheck._id !== cardToDelete._id;
        });
        setCards(cardsFiltered);
        closeAllPopups();
      })
      .catch(error => console.error('Карточка не удалилась, ошибка: ', error));
  };

  const handleUpdateUser = ({ name, about }) => {
    api
      .setUserInfo(name, about)
      .then(response => {
        setCurrentUser(response);
        closeAllPopups();
      })
      .catch(error => console.error('Ошибка сохранения данных пользователся: ', error));
  };

  const handleUpdateAvatar = link => {
    api
      .setUserAvatar(link)
      .then(response => {
        setCurrentUser(response);
        closeAllPopups();
      })
      .catch(error => console.error('Ошибка сохранения аватара пользователся: ', error));
  };

  const handleAddPlaceSubmit = (placeName, placePhoto) => {
    api
      .setNewPlace(placeName, placePhoto)
      .then(response => {
        setCards([response, ...cards]);
        closeAllPopups();
      })
      .catch(error => console.error('Ошибка добавления нового места: ', error));
  };

  const tokenCheck = () => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');

      auth
        .checkTokenValidity(token)
        .then(result => {
          setUserEmail(result.data.email);
          if (!loggedIn) {
            setLoggedIn(true);
            navigate('/', { replace: true });
          }
        })
        .catch(error => console.log('Ошибка проверки токена: ' + error));
    }
  };

  const handleLogin = (password, email) => {
    if (!email || !password) {
      return;
    }
    auth
      .authorize(password, email)
      .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', true);
        setLoggedIn(true);
        setUserEmail(email);
        navigate('/', { replace: true });
      })
      .catch(error => {
        console.log(error);
        setCurrentTooltipContent('signinError');
        setIsTooltipShown(true);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    setLoggedIn(false);
    setUserEmail('');
    navigate('/sign-in', { replace: true });
  };

  const handleRegister = (password, email) => {
    auth
      .register(password, email)
      .then(response => {
        setCurrentTooltipContent('registrationSuccess');
        setIsTooltipShown(true);
        navigate('/sign-in', { replace: true });
      })
      .catch(error => {
        console.log('Ошибка регистрации: ' + error);
        setCurrentTooltipContent('registrationError');
        setIsTooltipShown(true);
      });
  };

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <TooltipContext.Provider value={tooltipContent}>
          <Header userEmail={userEmail} onSignOut={handleSignOut} />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRouteElement loggedIn={loggedIn}>
                  <Main
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    cards={cards}
                    setCards={setCards}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDeleteClick={handleDeleteButtonClick}
                  >
                    <EditProfilePopup
                      isOpen={isEditProfilePopupOpen}
                      onClose={closeAllPopups}
                      onUpdateUser={handleUpdateUser}
                    />

                    <AddPlacePopup
                      isOpen={isAddPlacePopupOpen}
                      onClose={closeAllPopups}
                      onAddPlace={handleAddPlaceSubmit}
                    />

                    <EditAvatarPopup
                      isOpen={isEditAvatarPopupOpen}
                      onClose={closeAllPopups}
                      onUpdateAvatar={handleUpdateAvatar}
                    />

                    <DeleteCardPopup
                      isOpen={isCardDeletePopupOpen}
                      onClose={closeAllPopups}
                      onCardDelete={handleCardDeleteWithPopup}
                    />
                    <ImagePopup
                      onClose={closeAllPopups}
                      name={selectedCard?.name}
                      link={selectedCard?.link}
                    />
                  </Main>
                </ProtectedRouteElement>
              }
            />
            <Route
              path="/sign-up"
              element={
                <Register
                  title="Регистрация"
                  name="sign-up"
                  submitButtonText="Зарегистрироваться"
                  onRegister={handleRegister}
                />
              }
            />
            <Route
              path="/sign-in"
              element={
                <Login title="Вход" name="sign-in" submitButtonText="Войти" onLogin={handleLogin} />
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <InfoToolTip
            isOpened={isTooltipShown}
            toShow={currentTooltipContent}
            onClose={closeAllPopups}
          />
          {loggedIn && <Footer />}
        </TooltipContext.Provider>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
