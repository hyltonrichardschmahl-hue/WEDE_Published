var items = document.querySelectorAll(".galleryItem");
var lightbox = document.getElementById("lightbox");
var bigImage = document.getElementById("lbImage");
var caption = document.getElementById("lbCaption");
var counter = document.getElementById("lbCounter");

var current = 0;

function showImage(number) {
    if (number < 0) {
        number = items.length - 1;
    }
    if (number >= items.length) {
        number = 0;
    }
    current = number;

    var link = items[current];
    var thumbnail = link.querySelector("img");

    bigImage.src = link.href;
    bigImage.alt = thumbnail.alt;
    caption.textContent = thumbnail.alt;
    counter.textContent = (current + 1) + " / " + items.length;
}

function openLightbox(number) {
    showImage(number);
    lightbox.classList.remove("hidden");
}

function closeLightbox() {
    lightbox.classList.add("hidden");
}

function nextImage() {
    showImage(current + 1);
}

function previousImage() {
    showImage(current - 1);
}

for (var i = 0; i < items.length; i++) {
    items[i].addEventListener("click", function (event) {
        event.preventDefault();
        var position = Array.prototype.indexOf.call(items, this);
        openLightbox(position);
    });
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbNext").addEventListener("click", nextImage);
document.getElementById("lbPrev").addEventListener("click", previousImage);

lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", function (event) {
    if (lightbox.classList.contains("hidden")) {
        return;
    }
    if (event.key === "ArrowRight") {
        nextImage();
    } else if (event.key === "ArrowLeft") {
        previousImage();
    } else if (event.key === "Escape") {
        closeLightbox();
    }
});