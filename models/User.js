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
  if (this.data.username === '') {
    this.errors.push('You must provide an username')
  }

  if (this.data.username !== '' && !validator.isAlphanumeric(this.data.username)) {
    this.errors.push('Username can only contains letters and numbers')
  }

  if (!validator.isEmail(this.data.email)) {
    this.errors.push('You must provide a valid email')
  }

  if (this.data.password === '') {
    this.errors.push('You must provide a password')
  }

  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push('Password must be at least 12 characters')
  }

  if (this.data.password.length > 100) {
    this.errors.push('Password cannot exit 100 characters')
  }

  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push('Username must be at least 3 characters')
  }

  if (this.data.username.length > 100) {
    this.errors.push('Username cannot exit 100 characters')
  }
}

User.prototype.register = function () {
  // Step #1: Validate User Date
  this.cleanUp()
  this.validate()

  // Step #2: Only if there are no validation errors
  // then save the user data into database
  if (!this.errors.length) {
    DB.saveUser(this.data)
      .then((savedUser) => console.log(savedUser))
  }
}

module.exports = User
