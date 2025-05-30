const watchlistContainer = document.getElementById("watchlist");
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const animeDB = {
  "Frieren": "frieren.jpg",
  "Fullmetal Alchemist": "fma.jpg",
  "Steins;Gate": "steins.jpg",
  "Attack on Titan": "aot.jpg",
  "One Piece Fan Letter": "opfl.jpg",
  // tambahkan jika perlu
};

favorites.forEach(title => {
  const div = document.createElement("div");
  div.classList.add("anime-card");
  div.innerHTML = `
    <img src="${animeDB[title] || 'default.jpg'}" alt="${title}">
    <h3>${title}</h3>
  `;
  watchlistContainer.appendChild(div);
});
