module.exports.cors = (req, res, next) => {
  const allowedCorsList = [
    'https://quietplace.nomoredomainsmonster.ru',
    'http://quietplace.nomoredomainsmonster.ru',
    'localhost:3000',
  ];
  const { method } = req;
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'content-type, authorization')
    res.sendStatus(200);
  }

  if (allowedCorsList.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.sendStatus(201);
  }

  next();
};
