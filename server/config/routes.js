var user = require("../controllers/users.js")
module.exports = function(app){
  app.post('/users/new', user.create),
  app.post('/users', user.login)
}
