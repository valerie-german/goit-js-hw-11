const axios = require('axios').default;

export default class ImageServiceApi { 

    constructor() { 
        this.searchQuery = "";
    }


    fetchPixbay(page, perPage){

    const params = new URLSearchParams({

        key: "28152174-c362e84e874961aded494c5b6",
        q: `${this.searchQuery}`,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: page,
        per_page: perPage,
        
    });
    
    return axios.get(`https://pixabay.com/api/?${params}`);
};
    get query(){ 
        return this.searchQuery;
    }

    set query(newQuery){ 
        this.searchQuery = newQuery;
    }
}