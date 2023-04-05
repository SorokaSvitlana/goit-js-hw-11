import { Pixabay } from './js/pixabay-api';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

var lightbox = new SimpleLightbox (".gallery a", {
    captionsData: "alt",
    captionPosition: "bottom",
    captionDelay: 250,
  });

const formEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-button');
const buttonEl = document.querySelector('[type="submit"]');

const pixabayApi = new Pixabay();

const handleLoadMoreBtnClick = async () => {
  pixabayApi.page += 1;
  smoothScroll()
  try {
    const {data} = await pixabayApi.fetchPhotos();

    if (pixabayApi.page === data.totalHits) {
      loadMoreBtnEl.classList.add('hidden');
    }

    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.hits)
    );
    lightbox.refresh();

    const displayedPhotos = galleryListEl.children.length; 
    Notiflix.Notify.success(`Hooray! We found ${displayedPhotos} images.`); 
    if (data.totalHits <= pixabayApi.page * pixabayApi.per_page) {
      loadMoreBtnEl.classList.add('hidden');
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtnEl.classList.remove('hidden');
    }
  } catch (err) {
    console.log(err);
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  }
};



const handleSearchFormSubmit = async event => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['searchQuery'].value;
  pixabayApi.query = searchQuery;

  try {
    const { data } = await pixabayApi.fetchPhotos();
    galleryListEl.innerHTML = createGalleryCards(data.hits);
    loadMoreBtnEl.classList.remove('hidden');
    Notiflix.Notify.success(
        `Hooray! We found ${
          document.querySelectorAll('.photo__card').length
        } images.`
      );
    
    lightbox.refresh();
    if (data.hits.length === 0) {
        galleryListEl.innerHTML = '';
        loadMoreBtnEl.classList.add('hidden');
        Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
  } catch (err) {
    console.log(err);
    Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
   
  }
};




function  createGalleryCards (array) {
    return array.map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo__card">
           <a class='gallery__link' href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
           <div class="info__card">
             <p class="info__card-item">
               <b>Likes ${likes}</b>
             </p>
             <p class="info__card-item">
               <b>Views ${views}</b>
             </p>
             <p class="info__card-item">
               <b>Comments ${comments}</b>
             </p>
             <p class="info__card-item">
               <b>Downloads ${downloads}</b>
             </p>
           </div>
         </div>`;
        }
      )
      .join('');
  }
formEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

function smoothScroll() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }


