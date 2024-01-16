export class Api {
  constructor(baseUrl, refreshLikesCount) {
    this._baseUrl = baseUrl;
    this.refreshLikesCount = refreshLikesCount;
    this.handleLikeRequest = this.handleLikeRequest.bind(this);
  }

  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      }
    }).then(res => this._checkResponseStatus(res));
  }

  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      }
    }).then(res => this._checkResponseStatus(res));
  }

  setUserInfo(newName, newAbout, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newName,
        about: newAbout
      })
    }).then(res => this._checkResponseStatus(res));
  }

  setNewPlace(placeName, placePhoto, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      body: JSON.stringify({
        name: placeName,
        link: placePhoto
      }),
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(res => this._checkResponseStatus(res));
  }

  deleteCard(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res;
    });
  }

  _addLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`
      }
    }).then(res => this._checkResponseStatus(res));
  }

  _deleteLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`
      }
    }).then(res => this._checkResponseStatus(res));
  }

  handleLikeRequest(cardId, isLiked, token) {
    return !isLiked ? this._addLike(cardId, token) : this._deleteLike(cardId, token);
  }

  setUserAvatar(link, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: link
      })
    }).then(res => this._checkResponseStatus(res));
  }

  _checkResponseStatus(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }
}

const api = new Api(
  'https://api.quietplace.nomoredomainsmonster.ru');

export default api;
