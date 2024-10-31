// Получаем элементы DOM
const searchInput = document.getElementById("search-input");
const autoCompleteBox = document.querySelector(".autocom-box");
const repoList = document.querySelector(".rep-list__items");

function debounce(callback, ms = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(this, args);
    }, ms);
  };
}

async function fetchRepos(query) {
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
    
    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
    
    const data = await response.json();
    autoCompleteBox.innerHTML = ''; 
    
    if (data.items && data.items.length > 0) {
      data.items.forEach(repo => {
        autoCompleteBox.insertAdjacentHTML(
          'beforeend', 
          `<li class='list-rep'
               data-name="${repo.name}"
               data-owner="${repo.owner.login}" 
               data-stars="${repo.stargazers_count}">
               ${repo.name}
             </li>`
        );
      });      
    } else {
      autoCompleteBox.insertAdjacentHTML('beforeend', '<li>Ничего не найдено</li>');
    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
  }
}

searchInput.addEventListener('input', debounce((e) => {
  const query = e.target.value.trim();
  if (query) {
    fetchRepos(query);
  } else {
    autoCompleteBox.innerHTML = ''; // Очищаем автокомплит, если запрос пустой
  }
}));

autoCompleteBox.addEventListener('click', (event) => {
  const listItem = event.target.closest('.list-rep');
  if (listItem) {
    const repoName = listItem.getAttribute('data-name');
    const ownerLogin = listItem.getAttribute('data-owner');
    const starsCount = listItem.getAttribute('data-stars');

    repoList.insertAdjacentHTML(
      'beforeend', 
      `<li class='repolist-item'>
          <span>Name: ${repoName}</span>
          <span>Owner: ${ownerLogin}</span>
          <span>Stars: ${starsCount}</span>
          <button class='repo-button'><img src="img/close.png" alt="удалить"></button>
       </li>`
    );
    searchInput.value = '';
    autoCompleteBox.innerHTML = '';
  }
});


repoList.addEventListener('click', (event) => {
  if (event.target.classList.contains('repo-button') || event.target.closest('.repo-button')) {
    const listItem = event.target.closest('li');
    
    if (listItem) {
      listItem.remove();
      console.log(`Элемент ${listItem} удален.`);
    }
  }
});





























































// let debounceTimer;

// // Функция debounce
// function debounce(func, delay) {
//   return function () {
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
//   };
// }

// // Получение данных от GitHub API
// async function fetchRepos(query) {
//   const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
//   const data = await response.json();
//   return data.items;
// }

// // Отображение автокомплита
// function showAutoComplete(repos) {
//   autoCompleteBox.innerHTML = '';
//   if (repos.length > 0) {
//     repos.forEach(repo => {
//       const li = document.createElement('li');
//       li.textContent = repo.name;
//       li.addEventListener('click', () => addRepoToList(repo));
//       autoCompleteBox.appendChild(li);
//     });
//   }
// }

// // Добавление репозитория в список
// function addRepoToList(repo) {
//   const li = document.createElement('li');
//   li.innerHTML = `
//     <span><strong>${repo.name}</strong> by ${repo.owner.login} | ⭐ ${repo.stargazers_count}</span>
//     <button class="delete-btn">Delete</button>
//   `;

//   // Добавление обработчика для удаления
//   li.querySelector('.delete-btn').addEventListener('click', () => li.remove());

//   repoList.appendChild(li);
//   autoCompleteBox.innerHTML = ''; // Очистка автокомплита
//   searchInput.value = ''; // Очистка поля ввода
// }

// // Обработка ввода текста с использованием debounce
// searchInput.addEventListener('input', debounce(async function () {
//   const query = searchInput.value.trim();
//   if (query) {
//     const repos = await fetchRepos(query);
//     showAutoComplete(repos);
//   } else {
//     autoCompleteBox.innerHTML = '';
//   }
// }, 300));
