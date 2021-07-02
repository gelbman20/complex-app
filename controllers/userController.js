const User = require('../models/User')

exports.login = async (req, res) => {
  const user = new User(req.body)
  const result = await user.login()
  console.log(result)
  try {
    // Success login
    if (result.user) {
      req.session.user = { username: user.data.username }
      res.redirect('/')
    }

    // Failed login
    if (result.errors) {
      req.flash('errors', result.errors.join(', '))
      req.session.save(() => {
        res.redirect('/')
      })
    }

  }
  catch (err) { console.log(err) }
}

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'))
}

exports.register = async ({ body }, res) => {
  const result = await new User(body).register()

  try { res.send(result) }
  catch (err) { console.log(err) }
}

exports.home = function (req, res) {
  const { user } = req.session

  // Login User
  if (user) {
    const { username } = user
    res.render('home-dashboard', { username })
  }

  // Anonymous or Failed login
  if (!user) {
    res.render('home-guest', { errors: req.flash('errors') })
  }
}
