// Laden van de winkelwagen uit localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Functie om de winkelwagen weer te geven op de afrekenpagina
function updateCartSummary() {
    const cartContainer = document.querySelector(".cart-items");
    const totalPriceElement = document.querySelector(".total-price");

    if (!cartContainer || !totalPriceElement) return;

    cartContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">€${item.price.toFixed(2)}</p>
                <p class="quantity">Aantal: ${item.quantity}</p>
            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    totalPriceElement.textContent = `Totaal: €${total.toFixed(2)}`;
}

// Update winkelwagen bij het laden van de pagina
document.addEventListener("DOMContentLoaded", function() {
    updateCartSummary();
});

// Afrekenformulier verzenden
document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Hier zou je de gegevens kunnen versturen naar een server
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;

    // Simuleer een succesvolle bestelling
    alert(`Bestelling geplaatst!\n\nNaam: ${name}\nEmail: ${email}\nAdres: ${address}`);

    // Maak de winkelwagen leeg na een succesvolle bestelling
    localStorage.removeItem("cart");
    window.location.href = "index.html"; // Terug naar de homepage
});