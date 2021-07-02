const bcrypt = require('bcryptjs')
const validator = require('validator')
const DB = require('../db')

let User = function (data) {
  this.data = data
  this.errors = []
}

User.prototype.cleanUp = function () {
  if (typeof(this.data.username) != 'string') {
    this.data.username = ''
  }

  if (typeof(this.data.email) != 'string') {
    this.data.email = ''
  }

  if (typeof(this.data.password) != 'string') {
    this.data.password = ''
  }

  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  }
}

User.prototype.validate = function () {
  return new Promise((resolve, reject) => {
    const asyncFn = async () => {
      try {
        const { username, email, password } = this.data
        let errors = []

        if (username === '') errors.push('You must provide an username')
        if (username !== '' && !validator.isAlphanumeric(username)) errors.push('Username can only contains letters and numbers')
        if (!validator.isEmail(email)) errors.push('You must provide a valid email')
        if (password === '') errors.push('You must provide a password')
        if (password.length > 0 && password.length < 12) errors.push('Password must be at least 12 characters')
        if (password.length > 50) errors.push('Password cannot exit 50 characters')
        if (username.length > 0 && username.length < 3) errors.push('Username must be at least 3 characters')
        if (username.length > 100) errors.push('Username cannot exit 100 characters')

        if (username.length > 2 && username.length < 31 && validator.isAlphanumeric(username)) {
          let usernameExists = await DB.getUser({ username })
          usernameExists && errors.push('That username is already taken.')
        }

        if (validator.isEmail(email)) {
          let emailExists = await DB.getUser({ email })
          emailExists && errors.push('That email is already taken.')
        }

        if (errors.length) this.errors = [...errors]

        resolve()
      } catch (err) {
        reject(err)
      }
    }
    return asyncFn()
  })
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    const asyncFn = async () => {
      try {
        this.cleanUp()
        const { username, password } = this.data.username
        const user = await DB.getUser({ username })

        if (user && bcrypt.compareSync(password, user.password)) {
          resolve({ user })
        } else {
          resolve({ errors: ['Invalid Username or Password'] })
        }
      } catch (err) {
        reject(err)
      }
    }
    return asyncFn()
  })
}

User.prototype.register = function () {
  return new Promise((resolve, reject) => {
    const asyncFn = async () => {
      try {
        // Step #1: Validate User Date
        this.cleanUp()
        await this.validate()

        // Step #2: Only if there are no validation errors
        // then save the user data into database
        if (!this.errors.length) {
          DB.saveUser(this.data)
            .then((savedUser) => resolve({ user: savedUser }))
            .catch((err) => reject(err))
        } else {
          resolve({ errors: this.errors })
        }
      } catch (err) {
        reject(err)
      }
    }
    return asyncFn()
  })
}

module.exports = User
