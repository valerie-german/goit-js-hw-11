import './css/common.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios').default;

const form = document.querySelector("#search-form");
// const input = form.querySelector("input");
// const btn = form.querySelector("button");
const gallery = document.querySelector(".gallery");
const KEY = "28152174-c362e84e874961aded494c5b6";


form.addEventListener("submit", getData)

function getData(event) { 
    event.preventDefault();
    const [input] = event.currentTarget.elements;
    const inputData = input.value;

    fetchPixbay(inputData)
        .then(images => { 
            const imagesArray = images.hits;
            if (imagesArray.length < 1) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }
            else { 
                createMarkup(imagesArray);
            }
            
        })
        .catch(error => {
            Notify.failure("Error.22");
        })   
       
}

function createMarkup(images) {
  const markup = images
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
      return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
    })
    .join("");
  gallery.innerHTML = markup;
}


function fetchPixbay(data) {
    const params = new URLSearchParams({

        key: KEY,
        q: `${data}`,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        // _limit: 5,
        
        // _page: 3
    });

    return fetch(`https://pixabay.com/api/?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .catch(error => {
            Notify.failure("Oops... something is wrong. Try again");
        })
}

