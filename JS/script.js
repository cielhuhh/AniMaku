// script.js - AniMaku

// DOM Elements
const animeList = document.getElementById("anime-list");
const searchResults = document.getElementById("search-results");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const sectionTitle = document.getElementById("section-title");
const genreDropdown = document.getElementById("genre-dropdown");

let favorites = [];
try {
  const storedFavs = localStorage.getItem("favorites");
  favorites = storedFavs ? JSON.parse(storedFavs) : [];
  if (!Array.isArray(favorites)) favorites = [];
} catch (e) {
  console.warn("Gagal parse favorites dari localStorage. Reset ulang.");
  favorites = [];
}


// ========== FETCH & DISPLAY ANIME ==========
async function fetchTopAnime() {
  animeList.innerHTML = "<p>Loading anime list...</p>";
  try {
    const res = await fetch("https://api.jikan.moe/v4/top/anime");
    if (!res.ok) throw new Error("Jikan API error");

    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      displayAnime(data.data, animeList);
    } else {
      animeList.innerHTML = "<p>No anime found.</p>";
    }
  } catch (err) {
    console.error("Error fetching top anime:", err);
    animeList.innerHTML = `
      <p style="color: red;">Gagal memuat daftar anime. Pastikan kamu terkoneksi ke internet dan tidak diblokir oleh firewall/extension.</p>
    `;
  }
}

async function searchAnime() {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await res.json();

    animeList.style.display = "none";
    searchResults.style.display = "grid";
    sectionTitle.textContent = `Search Results for "${query}"`;

    displayAnime(data.data, searchResults);
  } catch (err) {
    console.error("Error searching anime:", err);
  }
}

function displayAnime(animeArray, container) {
  container.innerHTML = "";

  animeArray.slice(0, 18).forEach(anime => {
    const animeId = parseInt(anime.mal_id);
    const isFav = favorites.some(fav => parseInt(fav.id) === animeId);

    const card = document.createElement("div");
    card.className = "anime-card";
    card.dataset.id = animeId;

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <h3>${anime.title}</h3>
      <button class="fav-btn ${isFav ? 'favorited' : ''}" 
              data-id="${animeId}" 
              data-title="${anime.title}" 
              data-img="${anime.images.jpg.image_url}">❤️</button>
      <a href="watch.html?id=${animeId}">Watch</a>
    `;

    container.appendChild(card);
  });

  setupFavoriteButtons();
}

// ========== FAVORITE ==========
function setupFavoriteButtons() {
  const favButtons = document.querySelectorAll(".fav-btn");

  favButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const title = btn.dataset.title;
      const image = btn.dataset.img;

      const index = favorites.findIndex(fav => fav.id === id);

      if (index !== -1) {
        favorites.splice(index, 1);
        btn.classList.remove("favorited");
      } else {
        favorites.push({ id, title, image });
        btn.classList.add("favorited");
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    });
  });
}

// ========== GENRE DROPDOWN ==========
async function fetchGenres() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/genres/anime");
    const data = await res.json();
    renderGenreDropdown(data.data);
  } catch (err) {
    console.error("Error fetching genres:", err);
  }
}

function renderGenreDropdown(genreArray) {
  genreDropdown.innerHTML = "";
  genreArray.forEach(genre => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `genre.html?id=${genre.mal_id}&name=${genre.name}`;
    link.textContent = genre.name;
    li.appendChild(link);
    genreDropdown.appendChild(li);
  });
}

// ========== EVENTS ==========
searchBtn.addEventListener("click", searchAnime);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchAnime();
});

// ========== INIT ==========
window.addEventListener("DOMContentLoaded", () => {
  fetchTopAnime();
  fetchGenres();

  // Setup Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", themeToggle.checked ? "light" : "dark");
  });
});
