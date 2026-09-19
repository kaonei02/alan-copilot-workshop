// 取得本地儲存的 key 名稱，讓待辦事項可持久保存
const STORAGE_KEY = 'todo-list-items';
const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
};

// 取得 DOM 元素
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const emptyState = document.getElementById('empty-state');
const clearCompletedButton = document.getElementById('clear-completed-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
let currentFilter = FILTERS.all;

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

// 依據目前篩選狀態決定顯示哪些待辦事項
function getFilteredTodos(todos) {
  if (currentFilter === FILTERS.active) {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === FILTERS.completed) {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 依據篩選狀態產生對應的提示文字
function getEmptyStateMessage() {
  if (currentFilter === FILTERS.active) {
    return '目前沒有未完成的事項';
  }

  if (currentFilter === FILTERS.completed) {
    return '目前沒有已完成的事項，請切換回「全部」或「未完成」查看其他項目。';
  }

  return '還沒有任何待辦事項,新增一個吧!';
}

// 計算未完成項目數量，並更新底部文字
function updateTodoCount(todos) {
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `未完成: ${remainingCount} 項`;
}

// 依照目前篩選狀態更新按鈕樣式
function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('is-active', isActive);
  });
}

// 判斷是否需要顯示「清除已完成」按鈕
function updateClearCompletedButton(todos) {
  const hasCompletedTodos = todos.some((todo) => todo.completed);
  clearCompletedButton.hidden = !hasCompletedTodos;
  clearCompletedButton.disabled = !hasCompletedTodos;
}

// 依照目前待辦清單內容渲染畫面
function renderTodos() {
  const todos = loadTodos();
  const filteredTodos = getFilteredTodos(todos);

  // 若當前篩選條件沒有符合的項目，顯示明確提示，不讓使用者誤以為資料被刪除
  if (filteredTodos.length === 0) {
    todoList.innerHTML = '';
    emptyState.hidden = false;
    emptyState.textContent = getEmptyStateMessage();
  } else {
    emptyState.hidden = true;
    todoList.innerHTML = filteredTodos
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
  updateFilterButtons();
  updateClearCompletedButton(todos);
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

// 清除所有已完成的待辦事項，並提供確認對話框
function clearCompletedTodos() {
  const todos = loadTodos();
  const completedTodos = todos.filter((todo) => todo.completed);

  if (completedTodos.length === 0) {
    return;
  }

  const confirmed = window.confirm('確定要清除所有已完成項目嗎？');
  if (!confirmed) {
    return;
  }

  const remainingTodos = todos.filter((todo) => !todo.completed);
  saveTodos(remainingTodos);
  renderTodos();
}

// 切換當前篩選狀態
function changeFilter(filter) {
  currentFilter = filter;
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

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    changeFilter(button.dataset.filter);
  });
});

clearCompletedButton.addEventListener('click', clearCompletedTodos);

// 初始渲染，讓頁面一載入就顯示目前儲存的資料
renderTodos();
