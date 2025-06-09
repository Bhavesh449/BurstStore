// const products = [...] // This array is now defined in index.html

// Remove all products from pokemon cards section by clearing the array
const pokemonProducts = [];

const productList = document.getElementById('product-list');
const modal = document.getElementById('product-detail');
const closeBtn = document.getElementById('close-btn');

const detailImage = document.getElementById('detail-image');
const detailName = document.getElementById('detail-name');
const detailPrice = document.getElementById('detail-price');
const detailDesc = document.getElementById('detail-description');

// Load favourites from localStorage if available
let favourites = [];
if (localStorage.getItem('favourites')) {
  try {
    favourites = JSON.parse(localStorage.getItem('favourites'));
  } catch (e) {
    favourites = [];
  }
}

// Save favourites to localStorage whenever they change
function saveFavourites() {
  localStorage.setItem('favourites', JSON.stringify(favourites));
}

// Update all places where favourites are changed:
// Show products with newest first (reverse order)
function showProducts(filteredProducts = products) {
  productList.innerHTML = ""; // Clear previous products if any
  // Sort so newest (last in array) is first
  const sorted = [...filteredProducts].reverse();
  if (sorted.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }
  sorted.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Check if product is already in favourites
    const isFavourite = favourites.some(fav => fav.name === product.name);

    // Show strikethrough price and real price for Magic Spring
    let priceHtml = "";
    if (product.name === "Magic Spring" && product.realPrice) {
      priceHtml = `<span style=\"font-size:small;color:grey;text-decoration:line-through;\">${product.price}</span> <span style=\"font-weight:bold;color:#222;\">${product.realPrice}</span>`;
    } else {
      priceHtml = `<span>${product.price}</span>`;
    }

    card.innerHTML = `
      <img src=\"${product.image}\" alt=\"${product.name}\" class=\"product-thumb\">
      <div class=\"product-info\">
        <h3>${product.name}</h3>
        <p>${priceHtml}</p>
        <button class=\"fav-btn-card\" ${isFavourite ? 'disabled' : ''}>
          ${isFavourite ? 'Already added' : 'Add to Favourite ❤️'}
        </button>
      </div>
    `;
    // Open product-specific YouTube Shorts link on card click (except when clicking the fav button)
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('fav-btn-card')) {
        window.open(product.link, "_blank");
      }
    });
    // Add to Favourite button event
    card.querySelector('.fav-btn-card').addEventListener('click', (e) => {
      e.stopPropagation();
      if (!favourites.some(fav => fav.name === product.name)) {
        favourites.push(product);
        saveFavourites();
        // Immediately update button state
        e.target.textContent = "Already added";
        e.target.disabled = true;
      }
    });
    productList.appendChild(card);
  });
}

function showDetail(index) {
  const product = products[index]; // Relies on global products array
  detailImage.src = product.image;
  detailName.textContent = product.name;
  detailPrice.textContent = product.price;
  detailDesc.textContent = product.description;
  modal.classList.remove('hidden');
}

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Favourites modal logic
const favouritesLink = document.getElementById('favourites-link');
const favouritesModal = document.getElementById('favourites-modal');
const favouritesList = document.getElementById('favourites-list');
const closeFavBtn = document.getElementById('close-fav-btn');

// Show favourites modal and list
favouritesLink.addEventListener('click', () => {
  favouritesList.innerHTML = '';
  if (favourites.length === 0) {
    favouritesList.innerHTML = '<li>No favourites yet.</li>';
  } else {
    favourites.forEach((item, idx) => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.padding = '6px 0';

      li.innerHTML = `
        <span>${item.name} - ${item.price}</span>
        <button class=\"remove-fav-btn\" data-index=\"${idx}\" style=\"background:none;border:none;cursor:pointer;\">
          <img src=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/trash.svg\" alt=\"Remove\" width=\"20\" height=\"20\">
        </button>
      `;
      favouritesList.appendChild(li);
    });
    // Add event listeners for remove buttons
    favouritesList.querySelectorAll('.remove-fav-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const removeIdx = parseInt(this.getAttribute('data-index'));
        favourites.splice(removeIdx, 1);
        saveFavourites();
        favouritesLink.click(); // Refresh the list
        showProducts(
          searchBox.value
            ? products.filter(product => // Relies on global products array
                product.name.toLowerCase().includes(searchBox.value.trim().toLowerCase()) ||
                product.description.toLowerCase().includes(searchBox.value.trim().toLowerCase())
              )
            : products // Relies on global products array
        );
      });
    });
  }
  favouritesModal.classList.remove('hidden');
});

closeFavBtn.addEventListener('click', () => {
  favouritesModal.classList.add('hidden');
});

const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('input', function () {
  const query = this.value.trim().toLowerCase();
  const filtered = products.filter(product => // Relies on global products array
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
  );
  showProducts(filtered);
});

showProducts(); // Initial call to display products
// Open favourites modal if URL hash is #favourites
if (window.location.hash === '#favourites') {
  setTimeout(() => {
    favouritesLink.click();
    // Optionally, remove the hash so it doesn't reopen on refresh
    history.replaceState(null, '', window.location.pathname);
  }, 100);
}

