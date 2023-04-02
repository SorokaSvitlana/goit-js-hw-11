
import axios from 'axios';

export class Pixabay {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34990122-c9c933059a0835fdbbbaed835';

  page = 1;
  query = null;

  async fetchPhotos() {
    try {
      return await axios.get(`${this.#BASE_URL}`, {
        params: {
          q: this.query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: 40,
          key: this.#API_KEY,
        },
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}