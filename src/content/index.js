require('regenerator-runtime/runtime');
const User = require('./user').default;
const ChromeHelper = require('./chrome_helper').default;

// ChromeHelper.getParamsChrome(async(result) => {
//if (!ChromeHelper.paramsOK()) return false;

// });

// let user = new User();
// console.log(user);

let user = new User();
user.init();
console.log(user);