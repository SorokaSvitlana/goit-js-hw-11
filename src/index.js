import { Pixabay } from './pixabay-api';
import Notiflix from 'notiflix';

const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-button');
const buttonEl = document.querySelector('[type="submit"]');



const pixabayApi = new Pixabay();

const handleSearchFormSubmit = async event => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['searchQuery'].value;
  pixabayApi.query = searchQuery;

  try {
    const { data } = await pixabayApi.fetchPhotos();

    if (!data.results.length) {
        Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    galleryListEl.innerHTML = createGalleryCards(data.results);
    loadMoreBtnEl.classList.remove('hidden');
  } catch (err) {
    console.log(err);
  }
};

const handleLoadMoreBtnClick = async () => {
  pixabayApi.page += 1;

  try {
    const { data } = await pixabayApi.fetchPhotos();

    if (pixabayApi.page === data.total_pages) {
      loadMoreBtnEl.classList.add('hidden');
    }

    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.results)
    );
  } catch (err) {
    console.log(err);
  }
};


function  createGalleryCards (array) {
    return array
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
           <a class='gallery__link' href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
           <div class="info">
             <p class="info-item">
               <b>Likes ${likes}</b>
             </p>
             <p class="info-item">
               <b>Views ${views}</b>
             </p>
             <p class="info-item">
               <b>Comments ${comments}</b>
             </p>
             <p class="info-item">
               <b>Downloads ${downloads}</b>
             </p>
           </div>
         </div>`;
        }
      )
      .join('');
  }
  buttonEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
