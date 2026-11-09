var searchBox = document.getElementById("searchBox");
var priceFilter = document.getElementById("priceFilter");
var cards = document.querySelectorAll(".serviceCard");
var noResults = document.getElementById("noResults");

function filterCards() {
    var searchText = searchBox.value.toLowerCase();
    var priceChoice = priceFilter.value;
    var shown = 0;

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var cardText = card.textContent.toLowerCase();
        var cardPrice = Number(card.dataset.price);

        var matchesSearch = cardText.indexOf(searchText) !== -1;
        var matchesPrice = true;

        if (priceChoice === "low" && cardPrice > 250) {
            matchesPrice = false;
        }
        if (priceChoice === "high" && cardPrice < 300) {
            matchesPrice = false;
        }

        if (matchesSearch && matchesPrice) {
            card.classList.remove("hidden");
            shown = shown + 1;
        } else {
            card.classList.add("hidden");
        }
    }

    if (shown === 0) {
        noResults.classList.remove("hidden");
    } else {
        noResults.classList.add("hidden");
    }
}

searchBox.addEventListener("input", filterCards);
priceFilter.addEventListener("change", filterCards);