const signInForm = document.querySelector('.js-signInForm');
const SignInToggle = document.querySelector('.js-SignInToggle');
const LogInToggle = document.querySelector('.js-LogInToggle');
const signInContainer = document.querySelector('.qs-signInContainer');
const logInContainer = document.querySelector('.qs-logInContainer');
const formEmail = document.querySelector('.js-formEmail');
const formName = document.querySelector('.js-formName');
const formPassword = document.querySelector('.js-formPassword');
const formPasswordCheck = document.querySelector('.js-formPasswordCheck');
const signInBtn = document.querySelector('.js-signInBtn');
const logInPassword = document.querySelector('.js-logInPassword');
const logInEmail = document.querySelector('.js-logInEmail');
const logInBtn = document.querySelector('.logInBtn');
const logInForm = document.querySelector('.logInForm');
const errorMes = document.querySelector('.error-mes');
const editListContainer = document.querySelector('.qs-editListContainer');
const passwordError = document.querySelector('.passwordError');
const apiUrl = `https://todoo.5xcamp.us/`;


// ------ 監聽
// 註冊與登入頁面切換

LogInToggle.addEventListener('click', (e) => {
  e.preventDefault();
  showLogInPage()
})
SignInToggle.addEventListener('click', (e) => {
  e.preventDefault();
  showSignInPage();
})
signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if(formPasswordCheck.value !== formPassword.value) {
    passwordError.textContent = '密碼與上方不同，請重新輸入';
    return;
  }
  signIn();
})
logInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  logIn();
})
// ----- API
// 註冊
function signIn() {
  axios.post(`${apiUrl}users`, {
    user: {
      email: formEmail.value,
      nickname: formName.value,
      password: formPassword.value,
    }
  })
    .then((res) => {
      console.log(res);
      formEmail.value = '';
      formName.value = '';
      formPassword.value = '';
      formPasswordCheck.value = '';
      showLogInPage();
    })
    .catch((err) => {
      console.log(err.response);
      if (err.response.status !== 201) {
        errorMes.textContent = `${err.response.data.message}:${err.response.data.error}`;
        formEmail.value = '';
        formName.value = '';
        formPassword.value = '';
        formPasswordCheck.value = '';
      }
    })
}

// 登入
function logIn() {
  axios.post(`${apiUrl}users/sign_in`, {
    user: {
      email: logInEmail.value,
      password: logInPassword.value,
    }
  })
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        // 把token 存在 localStorage
        localStorage.setItem('listToken', JSON.stringify(res.headers.authorization));
        localStorage.setItem('userName', JSON.stringify(res.data.nickname));

        // 其他頁面取得token得以取得API資料
        // 切換至代辦事項頁面
        window.location = 'editeTodo.html';
      }
    })
    .catch((err) => {
      console.log(err.response);
      if (err.response.status !== 200) {
        errorMes.textContent = '登入失敗 !! 資訊有誤，請重新輸入';
        logInEmail.value = '';
        logInPassword.value = ''
      }
    })
}

// ------ Toggle 註冊與燈入頁面切換
function showLogInPage() {
  // 註冊頁面隱藏→登入頁面移除隱藏，新增顯示
  signInContainer.classList.add('d-none');
  logInContainer.classList.remove('d-none');
  logInContainer.classList.add('d-block');
}

function showSignInPage() {
  // 登入頁隱藏顯示,增加隱藏→註冊頁移除隱藏，新增顯示
  logInContainer.classList.remove('d-block');
  logInContainer.classList.add('d-none');
  signInContainer.classList.remove('d-none');
  signInContainer.classList.add('d-block');
}