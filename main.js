import { getCommentsFromAPI, sendCommentToServer, appComments } from './api.js';
import { renderComments } from './rendering.js';
import { format } from 'date-fns';

const loading = document.querySelector('.loading');
const commentList = document.querySelector('.comments');
const addForm = document.querySelector('.add-form');
const userName = document.querySelector('.add-form-name');
const textComment = document.querySelector('.add-form-text');
const button = document.querySelector('.add-form-button');
export { loading, commentList, addForm, userName, textComment, button };

// Добавляем лайк
const addLikes = (e) => {
  const comment = appComments[e.target.dataset.id];
  comment.like++;
  comment.Iliked = true;
};

// Удаляем лайк
const delLikes = (e) => {
  const comment = appComments[e.target.dataset.id];
  comment.like--;
  comment.Iliked = false;
};


const initLikeClick = () => {
  const likeClickElements = document.querySelectorAll('.likes');
  for (const likeClickElement of likeClickElements) {
    likeClickElement.addEventListener('click', (e) => {
      e.stopPropagation();
      const comment = appComments[e.target.dataset.id];
      if (comment.Iliked) {
        delLikes(e);
      } else {
        addLikes(e);
      }
      renderComments();
    });
  }
};

getCommentsFromAPI()

export { initLikeClick };



const addComment = (userName, textComment) => {
  const date = new Date();

  if (validate()) {
    const formattedDate = format(date, "dd.mm.yyyy hh:mm:ss");

    const newComment = {
      name: userName.value.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
      date: formattedDate,
      text: textComment.value.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
      like: 0,
    };

    sendCommentToServer(newComment, addForm, loading, userName, textComment, button, appComments); // Отправка комментария на сервер
    renderComments();
    textComment.value = '';
    userName.value = '';
    button.setAttribute('disabled', '');
    userName.disabled = false;
  }
};


const validate = () => {
  const userNameValue = userName.value.trim();
  const textCommentValue = textComment.value.trim();

  const isUserNameValid = userNameValue.length >= 3;
  const isTextCommentValid = textCommentValue.length >= 3;

  userName.classList.toggle('error', !isUserNameValid);
  textComment.classList.toggle('error', !isTextCommentValid);

  if (!isUserNameValid) {
    if (userNameValue === 'Напишите не менее 3 символов') {
      userName.placeholder = 'Напишите не менее 3 символов';
    } else {
      userName.placeholder = 'Напишите не менее 3 символов';
      console.log('Напишите не менее 3 символов (Имя)');
    }
  }

  if (!isTextCommentValid) {
    if (textCommentValue === 'Напишите не менее 3 символов') {
      textComment.placeholder = 'Напишите не менее 3 символов';
    } else {
      textComment.placeholder = 'Напишите не менее 3 символов';
      console.log('Напишите не менее 3 символов (Текст комментария)');
    }
  }

  if (!isUserNameValid || !isTextCommentValid) {
    alert('Введите не менее 3 символов');
    return false; 
  }

  return true;
};


button.addEventListener('click', (event) => {
  addComment(userName, textComment);
});


addForm.addEventListener('input', (event) => {
  if (validate) {
    button.removeAttribute('disabled');
    button.classList.remove('add-form-button-disabled');
  }
});


addForm.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    addComment();
  }
});

renderComments();


function addCommentListener() {
  const comments = document.querySelectorAll('.comment');
  comments.forEach((comment) => {
    comment.addEventListener('click', () => {
      const answer = comment.querySelector('.comment-body').textContent;
      const nameUser = comment.querySelector('.comment-name').textContent;
      textComment.value = `>${answer}${nameUser}.,`;
    });
  });
}
export { addCommentListener };