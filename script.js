// Laden van bestaande winkelwagen en favorieten uit localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Zorg ervoor dat cart en favorites altijd arrays zijn
if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(favorites)) favorites = [];

// Functie om de winkelwagen weer te geven
function updateCartDisplay() {
    const cartContainer = document.querySelector(".cart-items");
    const totalPriceElement = document.querySelector(".total-price");

    if (!cartContainer || !totalPriceElement) return;

    cartContainer.innerHTML = "";
    let total = 0;

    // Doorloop de winkelwagen en haal de prijs op uit de JSON
    cart.forEach((item, index) => {
        fetch('producten.json')
            .then(response => response.json())
            .then(data => {
                const product = data.find(p => p.name === item.name);
                if (product) {
                    item.price = parseFloat(product.newPrice.replace(",", "."));
                }

                total += item.price * item.quantity; // Voeg de prijs voor dit item toe aan het totaal

                // Voeg het product toe aan de winkelwagen display
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="price">€${item.price.toFixed(2)}</p>
                        <input type="number" value="${item.quantity}" min="1" class="quantity" data-index="${index}">
                        <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartContainer.appendChild(cartItem);

                // Bijwerken van de totale prijs
                totalPriceElement.textContent = `€${total.toFixed(2)}`;
            });
    });
}

// Functie om favorieten weer te geven
function updateFavoritesDisplay() {
    const favoriteContainer = document.querySelector(".favorite-items");
    if (!favoriteContainer) return;

    favoriteContainer.innerHTML = "";

    favorites.forEach((item, index) => {
        fetch('producten.json')
            .then(response => response.json())
            .then(data => {
                const product = data.find(p => p.name === item.name);
                if (product) {
                    item.price = parseFloat(product.newPrice.replace(",", "."));
                }

                const favoriteItem = document.createElement("div");
                favoriteItem.classList.add("favorite-item");
                favoriteItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="price">€${item.price.toFixed(2)}</p>
                        <button class="remove-favorite" data-index="${index}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                favoriteContainer.appendChild(favoriteItem);
            });
    });
}

// Functie om producten te laden uit het JSON-bestand
function loadProducts() {
    fetch('producten.json')
        .then(response => response.json())
        .then(data => {
            const productBox = document.querySelector('.product-box');
            if (!productBox) return;

            data.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">
                            <span class="old-price">€${product.oldPrice}</span> 
                            €${product.newPrice}
                        </p>
                        <button class="btn">Toevoegen aan winkelwagentje</button>
                        <i class="fas fa-heart heart-icon"></i>
                    </div>
                `;
                productBox.appendChild(productElement);
            });

            // Markeer favorieten
            document.querySelectorAll(".heart-icon").forEach(heart => {
                const product = heart.closest(".product");
                const name = product.querySelector(".product-name").textContent;

                if (favorites.some(item => item.name === name)) {
                    heart.classList.add("liked");
                }
            });
        })
        .catch(error => console.error('Er is een fout opgetreden bij het laden van de producten:', error));
}

// Laden van producten bij het laden van de pagina
document.addEventListener("DOMContentLoaded", function() {
    if (document.body.classList.contains('cart-page')) {
        updateCartDisplay();  // Update winkelwagen op cart.html
    }

    loadProducts();
    updateFavoritesDisplay();
});

// Event Listener voor het toevoegen van een product aan de winkelwagen
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn")) {
        const product = event.target.closest(".product");
        const name = product.querySelector(".product-name").textContent;
        const price = parseFloat(product.querySelector(".product-price").textContent.replace("€", "").trim());
        const image = product.querySelector(".product-image").src;

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }

        // Update winkelwagen in localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update de weergave van de winkelwagen
        if (document.body.classList.contains('cart-page')) {
            updateCartDisplay();
        }

        // Verander de knoptekst naar "Toegevoegd"
        const addToCartButton = event.target;
        addToCartButton.textContent = "Toegevoegd";

        // Zet de knop weer terug naar "Voeg toe aan winkelwagentje" na 2 seconden
        setTimeout(() => {
            addToCartButton.textContent = "Voeg toe aan winkelwagentje";
        }, 2000);
    }

    // Toevoegen of verwijderen van favorieten
    if (event.target.classList.contains("heart-icon")) {
        const heart = event.target;
        const product = heart.closest(".product");
        const name = product.querySelector(".product-name").textContent;
        const price = parseFloat(product.querySelector(".product-price").textContent.replace("€", "").trim());
        const image = product.querySelector(".product-image").src;

        if (heart.classList.contains("liked")) {
            favorites = favorites.filter(item => item.name !== name);
            heart.classList.remove("liked");
        } else {
            favorites.push({ name, price, image });
            heart.classList.add("liked");
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavoritesDisplay();
    }

    // Verwijderen van items uit de winkelwagen
    if (event.target.classList.contains("remove-item") || event.target.closest(".remove-item")) {
        const index = event.target.closest(".remove-item").dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    }

    // Verwijderen van favorieten
    if (event.target.classList.contains("remove-favorite") || event.target.closest(".remove-favorite")) {
        const index = event.target.closest(".remove-favorite").dataset.index;
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavoritesDisplay();
    }
});

// Update aantal producten in winkelwagen
document.addEventListener("change", function(event) {
    if (event.target.classList.contains("quantity")) {
        const index = event.target.dataset.index;
        cart[index].quantity = parseInt(event.target.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        if (document.body.classList.contains('cart-page')) {
            updateCartDisplay();
        }
    }
});
