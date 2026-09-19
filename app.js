// 取得本地儲存的 key 名稱，讓待辦事項可持久保存
const STORAGE_KEY = 'todo-list-items';

// 取得 DOM 元素
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const emptyState = document.getElementById('empty-state');

// 讀取 localStorage 中的資料，若不存在則回傳空陣列
function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    // 若資料格式錯誤，直接忽略並回傳空陣列
    return [];
  }
}

// 儲存待辦事項到 localStorage
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 計算未完成項目數量，並更新底部文字
function updateTodoCount(todos) {
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `未完成: ${remainingCount} 項`;
}

// 依照目前待辦清單內容渲染畫面
function renderTodos() {
  const todos = loadTodos();

  // 如果沒有待辦事項，顯示空白提示
  if (todos.length === 0) {
    todoList.innerHTML = '';
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    todoList.innerHTML = todos
      .map(
        (todo) => `
          <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <div class="todo-main">
              <input
                class="todo-checkbox"
                type="checkbox"
                ${todo.completed ? 'checked' : ''}
                aria-label="完成待辦事項"
              />
              <span class="todo-text">${escapeHtml(todo.text)}</span>
            </div>
            <button class="delete-btn" type="button" aria-label="刪除待辦事項">刪除</button>
          </li>
        `
      )
      .join('');
  }

  updateTodoCount(todos);
}

// 將使用者輸入內容轉成安全字串，避免 HTML 注入
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 新增待辦項目
function addTodo(event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  // 若輸入內容為空白，直接忽略，不新增
  if (!text) {
    todoInput.value = '';
    todoInput.focus();
    return;
  }

  const todos = loadTodos();
  const newTodo = {
    id: Date.now() + Math.random(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos(todos);
  todoInput.value = '';
  renderTodos();
}

// 切換待辦事項完成狀態
function toggleTodo(todoId, checked) {
  const todos = loadTodos();
  const nextTodos = todos.map((todo) => {
    if (todo.id === todoId) {
      return { ...todo, completed: checked };
    }
    return todo;
  });

  saveTodos(nextTodos);
  renderTodos();
}

// 刪除指定待辦事項
function deleteTodo(todoId) {
  const todos = loadTodos().filter((todo) => todo.id !== todoId);
  saveTodos(todos);
  renderTodos();
}

// 監聽新增表單提交事件
 todoForm.addEventListener('submit', addTodo);

// 監聽待辦清單事件，處理勾選與刪除按鈕
 todoList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-btn');
  if (deleteButton) {
    const item = deleteButton.closest('.todo-item');
    if (item) {
      deleteTodo(Number(item.dataset.id));
    }
    return;
  }
});

 todoList.addEventListener('change', (event) => {
  const checkbox = event.target.closest('.todo-checkbox');
  if (checkbox) {
    const item = checkbox.closest('.todo-item');
    if (item) {
      toggleTodo(Number(item.dataset.id), checkbox.checked);
    }
  }
});

// 初始渲染，讓頁面一載入就顯示目前儲存的資料
renderTodos();
