const User = require('../models/User')

exports.login = async ({ body }, res) => {
  const result = await new User(body).login()

  try { res.send(result) }
  catch (err) { console.log(err) }
}

exports.logout = function () {
}

exports.register = async ({ body }, res) => {
  const result = await new User(body).register()

  try { res.send(result) }
  catch (err) { console.log(err) }
}

exports.home = function (req, res) {
  res.render('home-guest')
}
