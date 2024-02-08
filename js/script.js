const global = {
  currentPage: window.location.pathname,
  baseUrl: 'https://api.themoviedb.org/3',
  apiKey: 'ab5d6a8bde23e8b4d69f4853df741f50',
  posterUrl: 'https://image.tmdb.org/t/p/w500',
  spinner: document.querySelector('.spinner'),
  popularMovies: document.getElementById('popular-movies'),
  popularShows: document.getElementById('popular-shows'),
  movieDetails: document.getElementById('movie-details'),
  showDetails: document.getElementById('show-details'),
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
};

// fetch the popular movies
const displayPopularMovies = async () => {
  const {results} = await fetchApiData('movie/popular');
  results.forEach(movie => {
    const {id, title, poster_path: poster, release_date: release} = movie;
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="movie-details.html?id=${id}">
          ${
            poster
              ? `<img src="${global.posterUrl}${poster}" alt="${title}" class="card-img-top">`
              : `<img src="../images/no-image.jpg" class="card-img-top" alt="Movie Title" />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${release}</small>
          </p>
        </div>
    `;
    global.popularMovies.appendChild(div);
  });
};

// fetch the popular TV shows
const displayPopularShows = async () => {
  const {results} = await fetchApiData('tv/popular');
  results.forEach(show => {
    const {id, name: title, poster_path: poster, first_air_date: release} = show;
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="tv-details.html?id=${id}">
          ${
            poster
              ? `<img src="${global.posterUrl}${poster}" alt="${title}" class="card-img-top">`
              : `<img src="../images/no-image.jpg" class="card-img-top" alt="Show Title" />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">
            <small class="text-muted">Air Date: ${release}</small>
          </p>
        </div>
    `;
    global.popularShows.appendChild(div);
  });
};

//fetch movie details: https://api.themoviedb.org/3/movie/{movie_id}
const displayMovieDetails = async () => {
  const pageSearchParams = new URL(window.location).searchParams;
  const id = pageSearchParams.get('id');
  const movie = await fetchApiData(`movie/${id}`);
  const {
    budget,
    genres,
    homepage,
    overview,
    poster_path: poster,
    production_companies: companies,
    release_date: release,
    revenue,
    runtime,
    status,
    title,
    vote_average: rating,
    backdrop_path: backdrop,
  } = movie;

  // Overlay for background image
  displayBackgroundImage('movie', backdrop);

  const divTop = document.createElement('div');
  const divBottom = document.createElement('div');
  divTop.classList.add('details-top');
  divBottom.classList.add('details-bottom');
  divTop.innerHTML = `
    <div>
      ${
        poster
          ? `<img src="${global.posterUrl}${poster}" alt="${title}" class="card-img-top">`
          : `<img src="../images/no-image.jpg" class="card-img-top" alt="Movie Title" />`
      }
    </div>
    <div>
      <h2>${title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>${rating.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${release}</p>
      <p>${overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${genres.map(genre => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  `;
  divBottom.innerHTML = `
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${numberWithCommas(budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${numberWithCommas(revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${numberWithCommas(runtime)} minutes</li>
      <li><span class="text-secondary">Status:</span> ${status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${companies
      .map(company => `<span>${company.name}</span>`)
      .join(', ')}</div>
  `;

  global.movieDetails.appendChild(divTop);
  global.movieDetails.appendChild(divBottom);
};

//fetch show details: https://api.themoviedb.org/3/movie/{movie_id}
const displayShowDetails = async () => {
  const pageSearchParams = new URL(window.location).searchParams;
  const id = pageSearchParams.get('id');
  const show = await fetchApiData(`tv/${id}`);
  const {
    genres,
    homepage,
    overview,
    poster_path: poster,
    production_companies: companies,
    first_air_date: airDate,
    status,
    name,
    vote_average: rating,
    backdrop_path: backdrop,
    number_of_episodes: episodes,
    last_episode_to_air: {name: lastEpisode},
  } = show;
  console.log(show);

  // Overlay for background image
  displayBackgroundImage('show', backdrop);

  const divTop = document.createElement('div');
  const divBottom = document.createElement('div');
  divTop.classList.add('details-top');
  divBottom.classList.add('details-bottom');
  divTop.innerHTML = `
    <div>
      ${
        poster
          ? `<img src="${global.posterUrl}${poster}" alt="${name}" class="card-img-top">`
          : `<img src="../images/no-image.jpg" class="card-img-top" alt="${name}" />`
      }
    </div>
    <div>
      <h2>${name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>${rating.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${airDate}</p>
      <p>${overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${genres.map(genre => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  `;
  divBottom.innerHTML = `
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Number of Episodes:</span> ${episodes}</li>
      <li><span class="text-secondary">Last Episode to Air:</span> ${lastEpisode}</li>
      <li><span class="text-secondary">Status:</span> ${status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${companies
      .map(company => `<span>${company.name}</span>`)
      .join(', ')}</div>
  `;

  global.showDetails.appendChild(divTop);
  global.showDetails.appendChild(divBottom);
};

// display backdrop on details pages
const displayBackgroundImage = (type, backdrop) => {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdrop})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
};

// display SLIDER now playing movies on home page
const displaySwiper = async () => {
  const {results} = await fetchApiData('movie/now_playing');
  results.forEach(movie => {
    console.log(movie.title);
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="${global.posterUrl}${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
      </h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
  });
};

const initSwiper = () => {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 40,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {slidesPerView: 2, spaceBetween: 20},
      700: {slidesPerView: 3, spaceBetween: 20},
      1200: {slidesPerView: 4, spaceBetween: 20},
    },
  });
};

// searching for a movie/show
const search = async () => {
  // getting the url data/query string
  const searchParams = new URL(window.location).searchParams;
  global.search.type = searchParams.get('type');
  global.search.term = searchParams.get('search-term');
  console.log(global.search.type);
  console.log(global.search.term);
  // checking if the search term is not null or empty
  if (global.search.term !== null && global.search.term !== '') {
    // fetching the data from TMDB API
    const {results, total_pages, page, total_results} = await searchApiData();
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    global.search.page = page;
    if (results.length === 0) {
      showAlert('No Results Found');
      return;
    }
    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
  } else {
    // displaying error message if search term is empty
    showAlert('Please enter a search term.');
  }
};

const displaySearchResults = results => {
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach(result => {
    console.log(result);
    const poster = result.poster_path;
    const title = result.title || result.name;
    const date = result.release_date || result.first_air_date;
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
      ${
        result.poster_path
          ? `<img src="${global.posterUrl}${poster}" alt="${title}" class="card-img-top">`
          : `<img src="../images/no-image.jpg" class="card-img-top" alt="${global.search.type} Title" />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${date}</small>
      </p>
    </div>`;
    document.querySelector('#search-results-heading').innerHTML = `
      <h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>
    `;
    document.querySelector('#search-results').appendChild(div);
  });
  displayPagination();
};

// create and display pagination for search results
const displayPagination = () => {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
  document.querySelector('#pagination').appendChild(div);
  const prevBtn = document.querySelector('#prev');
  const nextBtn = document.querySelector('#next');
  // disable the prev/next buttons if on the first/last page
  if (global.search.page === 1) {
    prevBtn.disabled = true;
  }
  if (global.search.page === global.search.totalPages) {
    nextBtn.disabled = true;
  }
  // add event listeners to the prev and next buttons
  prevBtn.addEventListener('click', async () => {
    global.search.page--;
    console.log('clicked prevBtn');
    const {results} = await searchApiData();
    displaySearchResults(results);
  });
  nextBtn.addEventListener('click', async () => {
    global.search.page++;
    const {results} = await searchApiData();
    console.log('clicked nextBtn', results);
    displaySearchResults(results);
  });
};

// fetch the data from TMDB API
const fetchApiData = async endpoint => {
  global.spinner.classList.add('show');
  const response = await fetch(
    `${global.baseUrl}/${endpoint}?api_key=${global.apiKey}&language=en-US`,
  );
  const data = await response.json();
  global.spinner.classList.remove('show');
  return data;
};

// make request to search
const searchApiData = async () => {
  global.spinner.classList.add('show');
  const response = await fetch(
    `${global.baseUrl}/search/${global.search.type}?api_key=${global.apiKey}&language=en-US&query=${global.search.term}&page=${global.search.page}`,
  );
  const data = await response.json();
  global.spinner.classList.remove('show');
  return data;
};

// highlight nav-links
const highlightActiveLink = () => {
  const navLinks = document.querySelectorAll('.nav-link'); // anchor elements
  navLinks.forEach(link => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
};

// add commas to number, using regex
const numberWithCommas = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// show alert
const showAlert = (message, className = 'error') => {
  const alertEl = document.createElement('div');
  alertEl.className = `alert alert-${className}`;
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);
  setTimeout(() => {
    alertEl.remove();
  }, 3000);
};

// initialize the app
const init = () => {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home');
      displaySwiper();
      displayPopularMovies();
      break;
    case '/shows.html':
      console.log('Shows');
      displayPopularShows();
      break;
    case '/movie-details.html':
      console.log('Movie Details');
      displayMovieDetails();
      break;
    case '/tv-details.html':
      console.log('TV Details');
      displayShowDetails();
      break;
    case '/search.html':
      console.log('Search');
      search();
      break;
  }

  highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);
