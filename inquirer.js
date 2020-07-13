const inquirer = require('inquirer');

module.exports = {
  askAPICredentials: () => {
    const api_key = [
      {
        name: 'API',
        type: 'password',
        message: 'Enter your API_Key:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your API_Key.';
          }
        }
      }
    ];
    return inquirer.prompt(api_key);
  },
};