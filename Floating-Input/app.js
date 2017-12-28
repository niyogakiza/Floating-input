const body = document.body;
const input = document.querySelector('input[type=text]');
const overlay = document.querySelector('.overlay');

function showFloater(){
    body.classList.add('show-floater');
}

function closeFloater(){
    if(body.classList.contains('show-floater')){
        body.classList.remove('show-floater');
    }

}

input.addEventListener('focusin', showFloater);
// input.addEventListener('focusout', closeFloater);
overlay.addEventListener('click', closeFloater);

/*====Bookmark====*/

const bookmarksList = document.querySelector('.bookmarks-list');
const bookmarkForm  = document.querySelector('.bookmark-form');
const bookmarkInput = bookmarkForm.querySelector('input[type=text]');
const bookmarks     = JSON.parse(localStorage.getItem('bookmarks')) || [];
const apiUrl        = 'https://opengraph.io/api/1.0/site';
const appId         = '5a44f70b2662a50b00f7565e';

fillBookmarksList(bookmarks);// this will keep bookmarks on the page after refresh the page.

function createBookmark(e){
    e.preventDefault();

    if(!bookmarkInput.value){
        alert('We need info!');
        return;
    }

    const url = encodeURIComponent(bookmarkInput.value);
    //Add a new bookmark to the bookmarks
    fetch(`${apiUrl}/${url}?app_id=${appId}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            const bookmark = {
                title: data.hybridGraph.title,
                image: data.hybridGraph.image,
                link: data.hybridGraph.url
            };
            // console.log(bookmark);

            bookmarks.push(bookmark);
            fillBookmarksList(bookmarks);
            storeBookmarks(bookmarks);
            bookmarkForm.reset();
        })
    .catch(error => {
        alert('there was a problem getting info!');
    });
}

function fillBookmarksList(bookmarks = []) {

    // Refactoring .
    const bookmarksHtml = bookmarks.map((bookmark, i) => {
        return ` 
 <a href="${bookmark.link}" class="bookmark" data-id="${i}">
 <div class="img" style="background-image:url('${bookmark.image}')"></div>
 <div class="title">${bookmark.title}</div>
 <span class="glyphicon glyphicon-remove"></span>
         </a>`;
    }).join('');

    // let bookmarksHtml = '';
    // for(i = 0; i < bookmarks.length; i++){
    //     bookmarksHtml +=` <a href="#" class="bookmark">
    //     ${bookmarks[i].title} </a>`
    // }

    bookmarksList.innerHTML = bookmarksHtml;
}
//remove bookmark
function removeBookmark(e){
    if(!e.target.matches('.glyphicon-remove')) return;

    const index = e.target.parentNode.dataset.id;
    bookmarks.splice(index, 1);
    fillBookmarksList(bookmarks);
    storeBookmarks(bookmarks);
}

// storing bookmarks
function storeBookmarks(bookmarks = []){
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}


bookmarkForm.addEventListener('submit', createBookmark);
bookmarksList.addEventListener('click', removeBookmark);