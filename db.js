require('dotenv').config()
const mongoose = require('mongoose')

const mongoUri = process.env.MONGOURL
const db = mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false)

db
  .then(() => {
    const userScheme = new mongoose.Schema({
      username: String,
      email: String,
      password: String
    })

    const User = mongoose.model('User', userScheme)

    module.exports = class DB {
      static saveUser({ username, email, password }) {
        return new User({username, email, password}).save()
      }

      static getUser({ username }) {
        return User.findOne({username}).exec()
      }
    }

    const app = require('./app')
    app.listen(process.env.PORT, () => {
      console.log('We work on 3000 port')
    })
  })
  .catch((err) => {
    console.error(err)
  })
