const commentForm = document.getElementById('comment-form');
const commentList = document.getElementById('comment-list');

commentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const comment = document.getElementById('comment').value;
    
    const newComment = document.createElement('li');
    newComment.innerHTML = `<strong>${username}:</strong> ${comment}`;
    commentList.appendChild(newComment);
    
    commentForm.reset();
});