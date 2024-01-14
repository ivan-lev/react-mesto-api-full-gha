module.exports.errorHandler = (err, req, res, next) => {
  // ставим для непредвиденной ошибки статус 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // если статус 500, генерируем сообщение сами
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
