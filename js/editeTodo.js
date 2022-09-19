// API 在操作上都需夾帶 headers ( 傳遞 authorization token )，使用 axios 文件中 Global axios defults 把 token 寫於全域
axios.defaults.headers.common['Authorization'] = JSON.parse(localStorage.getItem('listToken'));
let userName = JSON.parse(localStorage.getItem('userName'));

// ----- DOM
const apiUrl = `https://todoo.5xcamp.us/`;
const list = document.querySelector('.list');
const formInput = document.querySelector('.formInput-group-input');
const logOutBtn = document.querySelector('.js-logOutBtn');
const addText = document.querySelector('.js-addText');
const addTodosBtn = document.querySelector('.js-addTodosBtn');
const listItemGroup = document.querySelector('.listItem-group');
const checkedIcon = document.querySelector('.checkedIcon');
const listItemFooterTodo = document.querySelector('.listItem-footer-todo'); // 待完成事項數量
const listItemFooterButton = document.querySelector('.listItem-footer-button'); // 清除已完成項目
let listData = [];
// let checkedStatus;
function init() {
  getTodos();
  noToken();
}
init();

// ----- 監聽
logOutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  logOut();
})

addTodosBtn.addEventListener('click', (e) => {
  e.preventDefault();
  addTodosList();
  addText.value = '';  
})
// 優化input傳送 按鈕
formInput.addEventListener('keypress', (e) => {
  if(e.keyCode === 13) {
    addTodosList();
  addText.value = ''; 
  }
})
// ----- API
// 取所有代辦清單
function getTodos() {
  axios.get(`${apiUrl}todos`)
    .then((res) => {
      // console.log(res);
      listData = res.data.todos;
      renderList(listData);
      todoData(listData);
    })
    .catch((err) => {
      console.log(err.response);
    })
}
// 登出
function logOut() {
  axios.delete(`${apiUrl}users/sign_out`)
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        location.href = 'index.html';
        localStorage.clear();
      }

    })
    .catch((err) => {
      console.log(err.response);
    })
}
// 新增列表
function addTodosList() {
  axios.post(`${apiUrl}todos`, {
    todo: {
      content: addText.value.trim(),
    }
  })
    .then((res) => {      
      if(res.status === Number(201)) {
        getTodos();
      }
    })
    .catch((err) => {
      console.log(err.response);
    })
}
// 刪除列表
function delTodoList(id) {
  axios.delete(`${apiUrl}todos/${id}`,)
    .then((res) => {
      console.log(res);
      getTodos();
    })
    .catch((err) => {
      console.log(err.response);
    })
}
// 切換,完成|未完成
function toggleCheck(id) {
  axios.patch(`${apiUrl}todos/${id}/toggle`)
    .then((res) => {
      console.log(res);
      getTodos();
    })
    .catch((err) => {
      console.log(err.response);
    })
}

// ----- 狀態切換(全部|待完成|已完成)
// 切換狀態樣式
let tabListLink = document.querySelectorAll('.tabList-link');
const tabList = document.querySelector('.tabList');
let nowStatus = 'all';
tabList.addEventListener('click', (e) => {
  e.preventDefault();
  nowStatus = e.target.dataset.status;

  if (e.target.nodeName === 'A') {
    tabListLink.forEach((item) => {
      item.classList.remove('active');
      item.classList.add('tabList-link');
    })
    e.target.classList.add('active');
  }
  // 狀態切換，渲染資料在畫面上
  if (nowStatus === 'all') {
    getTodos();
  } else if (nowStatus === 'todo') {
    let todoItem = listData.filter((i) => i.completed_at === null);
    renderList(todoItem);
  } else if (nowStatus === 'done') {
    let doneItem = listData.filter((i) => i.completed_at !== null);
    renderList(doneItem);
  }
})


// -----Render 渲染畫面
function renderList(data) {
  let str = '';
  data.forEach((item) => {
    let checkedStatus;
    if (item.completed_at !== null) {
      checkedStatus = 'checked';
    }
    str += `
    <li class="listItem-group-item" data-id="${item.id}">
        <label class="listItem-group-check w-100">${item.content}
          <input class="inputCheck" type="checkbox" ${checkedStatus}>
          <span class="checkedIcon"></span>
        </label>
        <a class="listItem-group-deleteBtn d-block ms-auto" href="#">
          <i class="bi bi-x-lg deleteBtnIcon"></i>
        </a>
    </li>
    `;
  })
  listItemGroup.innerHTML = str;
}
// 顯示待完成項目數量
function todoData(data) {
  let todoNumber = data.filter((i) => i.completed_at === null);
  listItemFooterTodo.textContent = `${todoNumber.length}個待完成項目`;
}

// checked & 刪除
listItemGroup.addEventListener('click', (e) => {
  let listId = e.target.closest("li").dataset.id;
  // 如果按到a標籤就刪除，li標籤就checked切換
  if (e.target.closest('a')) {
    delTodoList(listId);
  } else if (e.target.closest('li')){
    toggleCheck(e.target.closest("li").dataset.id);
  }


  // label>input用法會造成執行兩次的狀況，所以使用阻止事件冒泡傳遞
  // stopPropagation掛在li下的label
  let labelStopPropagation = e.target.closest('label');
  if (labelStopPropagation) {
    labelStopPropagation.addEventListener('click', (e) => {
      e.stopPropagation();
    })
  }
})


// 清除已完成項目
listItemFooterButton.addEventListener('click', (e) => {
  e.preventDefault();
  let doneData = listData.filter((i) => i.completed_at !== null);

  if(doneData.length == 0) {
    alert('無已完成資料');
  } else {
    doneData.forEach((i) => {
      delTodoList(i.id);
    })
  }
  
})


// ----- others調整
// navBar 加上使用者名稱
document.querySelector('.js-listUserName').innerHTML = `<p class="mb-0">${userName} 的代辦</p>`;

// 如果後台未授權強制轉址到首頁
function noToken() {
  if (localStorage.getItem('listToken') == null) {
    window.location = 'index.html';
  }
}


