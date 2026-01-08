const board = document.getElementById("board");
const form = document.getElementById("addCardForm");
const imageUrlInput = document.getElementById("imageUrl");
const titleInput = document.getElementById("title");

// Load saved cards from localStorage
let cards = JSON.parse(localStorage.getItem("cards")) || [];

// Drag & drop variables
let draggedIndex = null;

// Render cards
function render() {
  board.innerHTML = "";
  cards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.draggable = true;

    div.innerHTML = `
      <img src="${card.image}" alt="${card.title}">
      <div class="title">${card.title} 
        <span class="heart ${card.liked ? "liked" : ""}" onclick="toggleLike(${index})">&#10084;</span>
      </div>
      <button onclick="deleteCard(${index})">Delete</button>
    `;

    // Drag events
    div.addEventListener("dragstart", () => {
      draggedIndex = index;
      div.classList.add("dragging");
    });
    div.addEventListener("dragend", () => div.classList.remove("dragging"));
    div.addEventListener("dragover", e => e.preventDefault());
    div.addEventListener("drop", () => swapCards(draggedIndex, index));

    board.appendChild(div);
  });
}

// Add new card
form.addEventListener("submit", e => {
  e.preventDefault();
  const image = imageUrlInput.value;
  const title = titleInput.value;

  cards.push({ image, title, liked: false });
  saveAndRender();

  imageUrlInput.value = "";
  titleInput.value = "";
});

// Toggle like
function toggleLike(index) {
  cards[index].liked = !cards[index].liked;
  saveAndRender();
}

// Delete card
function deleteCard(index) {
  cards.splice(index, 1);
  saveAndRender();
}

// Swap cards for drag & drop
function swapCards(from, to) {
  if(from === null || to === null) return;
  const temp = cards[from];
  cards[from] = cards[to];
  cards[to] = temp;
  saveAndRender();
}

// Save to localStorage + render
function saveAndRender() {
  localStorage.setItem("cards", JSON.stringify(cards));
  render();
}

// Initial render
render();
