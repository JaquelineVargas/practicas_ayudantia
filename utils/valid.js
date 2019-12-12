var valid = {
    checkEmail: function(email) {       //example
        var exp = /^\w{1,}@\w{1,}[.]\w{2,3}$/g
        if (email.match(exp) == null) {
            return false;
        }
        return true;
    },

/*
        Minimo 8 caracteres
        Maximo 15
        Al menos una letra mayúscula
        Al menos una letra minucula
        Al menos un dígito
        No espacios en blanco
        Al menos 1 caracter especial
*/
    checkPassword: function(password) {       //example
      var  exp =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/;
      if (password.match(exp) == null) {
          return false;
      }
      return true;
    },


    checkQuantity: function(quantity) {
        var exp = /^[0-9]*$/g
        if (quantity.match(exp) == null) {
            return false;
        }
        return true;
    },
};
module.exports = valid;
