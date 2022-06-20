import './css/common.css';
import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios').default;

const form = document.querySelector("#search-form");
const input = form.querySelector("input");
const btnLoad = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");
const KEY = "28152174-c362e84e874961aded494c5b6";
let pageNum = 1;
let imagePerPage = 40;

btnLoad.classList.add("is-hidden")

form.addEventListener("submit", showGallery)
btnLoad.addEventListener("click", loadMoreImages)

function loadMoreImages() { 
    pageNum += 1;
    searchImagesByInput(input.value);
} 

function showGallery(event) { 
    event.preventDefault();
    const [input] = event.currentTarget.elements;

    gallery.innerHTML = "";
    btnLoad.classList.add("is-hidden")
       
    searchImagesByInput(input.value);
}


const searchImagesByInput = async (inputData) => {
    try {
        const imagesJson = await fetchPixbay(inputData);
        await parsingImages(imagesJson);
        btnLoad.classList.remove("is-hidden");
    } catch (error) {  
        let message = error.message;
        if (message === "") { 
            message = "Oops... something is wrong. Try again"
        }
        Notify.failure(message);
        btnLoad.classList.add("is-hidden")
    }
};


function parsingImages(images) { 
    const imagesArray = images.hits;
    if (imagesArray.length < 1) {
        throw new Error("Sorry, there are no images matching your search query. Please try again.");
    }
    else if (images.totalHits < (pageNum + 1) * imagePerPage) { 
        throw new Error("We're sorry, but you've reached the end of search results.");
    }
    else { 
        createMarkup(imagesArray);
        pageNum += 1;                
    }
}


function createMarkup(images) {    
    const markup = images
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
            return `<div class="photo-card"><a class="gallery__item" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                <b><span>Likes:</span> ${likes}</b>
                </p>
                <p class="info-item">
                <b><span>Views:</span> ${views}</b>
                </p>
                <p class="info-item">
                <b><span>Comments:</span> ${comments}</b>
                </p>
                <p class="info-item">
                <b><span>Downloads:</span> ${downloads}</b>
                </p>
            </div>
            </a>
            </div>`;
        })
        .join("");
    
    gallery.insertAdjacentHTML("beforeend", markup);
}


const fetchPixbay = async (data) => {

    const params = new URLSearchParams({

        key: KEY,
        q: `${data}`,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: pageNum,
        per_page: imagePerPage,
        
    });
    
    const response = await fetch(`https://pixabay.com/api/?${params}`);
    const images = await getJsonResponse(response);
    return images;
    
};


function getJsonResponse(response) { 
    if (!response.ok) {
        throw new Error(response.status);
    }
    return response.json();
}