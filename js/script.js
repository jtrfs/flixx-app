const global = {
  currentPage: window.location.pathname,
  baseUrl: 'https://api.themoviedb.org/3',
  apiKey: 'ab5d6a8bde23e8b4d69f4853df741f50',
  posterUrl: 'https://image.tmdb.org/t/p/w500',
};

// fetch the popular movies
const displayPopularMovies = async () => {
  const {results} = await fetchApiData('movie/popular');
  results.forEach((movie, i) => {
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
    document.getElementById('popular-movies').appendChild(div);
  });
};

// fetch api data
const fetchApiData = async endpoint => {
  const response = await fetch(
    `${global.baseUrl}/${endpoint}?api_key=${global.apiKey}&language=en-US`,
  );
  const data = await response.json();
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

// initialize the app
const init = () => {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home');
      displayPopularMovies();
      break;
    case '/shows.html':
      console.log('Shows');
      break;
    case '/movie-details.html':
      console.log('Movie Details');
      break;
    case '/tv-details.html':
      console.log('TV Details');
      break;
    case '/search.html':
      console.log('Search');
      break;
  }

  highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);
