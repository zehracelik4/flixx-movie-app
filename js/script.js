const global = {
    currentPage: window.location.pathname,
}

async function displayPopularMovies() {
    const { results } = await fetchAPIData('/movie/popular');
    
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card');

        div.innerHTML = `
        <a href="/movie-details.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
        </a>

        <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
            <small class="text-muted">Released: ${movie.release_date}</small></p>
        </div>
        `;

        document.querySelector('#popular-movies').appendChild(div);
    });
}

async function displayPopularShows() {
    const { results } = await fetchAPIData('/tv/popular');
    
    results.forEach((show) => {
        const div = document.createElement('div');
        div.classList.add('card');

        div.innerHTML = `
        <a href="/tv-details.html?id=${show.id}">
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${movie.title}">
        </a>

        <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
            <small class="text-muted">Air Date: ${show.first_air_date}</small></p>
        </div>
        `;

        document.querySelector('#popular-shows').appendChild(div);
    });
}

async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1];
    const movie = await fetchAPIData(`/movie/${movieId}`);

    displayBackgroundImage('movie', movie.backdrop_path);

    const div = document.createElement('div');
    
    div.innerHTML = `
    <div class="details-top">
          <div>
            <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
                ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map(genre => `<li class="list-group-item">${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary"> Budget: </span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes </li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${movie.production_companies.map(company => `<li class="list-group-item">${company.name}</li>`).join('')}
          </div>
        </div>
    `;
    document.querySelector('#movie-details').appendChild(div);
}

function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('background-image');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280${backgroundPath})`;
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

    if(type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv)
    } else {
            document.querySelector('#show-details').appendChild(overlayDiv)
    }
}

async function fetchAPIData(endpoint) {
    const API_KEY = 'ab60d473df10890068aa790aaed730b8';
    const API_URL = 'https://api.themoviedb.org/3/';

    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();

    hideSpinner();

    return data;
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show')
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show')  
}

function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    });
}

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function init() {
    switch(global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case'/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            console.log('TV Details');
            break;
        case '/search.html':
            console.log('Search');
            break;
    }

    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);