const User = require('../models/User')

exports.login = async (req, res) => {
  const user = new User(req.body)
  const result = await user.login()
  try {
    req.session.user = { username: user.data.username }
    res.send(result)
  }
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
  if (req.session.user) {
    const { username } = req.session.user
    res.send(`Welcome ${username}`)
  } else {
    res.render('home-guest')
  }
}
