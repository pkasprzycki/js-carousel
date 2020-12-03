import '../stylesheets/style.scss';

const slider = document.getElementById('slider');
const sliderItems = document.getElementById('slides');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

function slide(wrapper, items, prev, next) {
    let posX1 = 0,
        posX2 = 0,
        posInitial,
        posFinal,
        threshold = 0,
        slides = items.getElementsByClassName('slide'),
        slidesLength = slides.length,
        slideSize = items.getElementsByClassName('slide')[0].offsetWidth,
        firstSlide = slides[0],
        lastSlide = slides[slidesLength - 1],
        cloneFirst = firstSlide.cloneNode(true),
        cloneLast = lastSlide.cloneNode(true),
        index = 0,
        speed = 4000,
        allowShift = true;

    let dragAction = (event) => {
        event = event || window.event;

        if (event.type === 'touchmove') {
            posX2 = posX1 - event.touches[0].clientX;
            posX1 = event.touches[0].clientX;
        } else {
            posX2 = posX1 - event.clientX;
            posX1 = event.clientX;
        }
        items.style.left = (items.offsetLeft - posX2) + "px";
    }

    let dragEnd = () => {
        posFinal = items.offsetLeft;
        if (posFinal - posInitial < -threshold) {
            shiftSlide(1, 'drag');
        } else if (posFinal - posInitial > threshold) {
            shiftSlide(-1, 'drag');
        } else {
            items.style.left = (posInitial) + "px";
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }

    let shiftSlide = (dir, action) => {
        items.classList.add('shifting');

        if (allowShift) {
            if (!action) { posInitial = items.offsetLeft; }

            if (dir === 1) {
                items.style.left = (posInitial - slideSize) + "px";
                index++;
            } else if (dir === -1) {
                items.style.left = (posInitial + slideSize) + "px";
                index--;
            }
        };

        allowShift = false;
    }

    let checkIndex = () => {
        items.classList.remove('shifting');

        if (index === -1) {
            items.style.left = -(slidesLength * slideSize) + "px";
            index = slidesLength - 1;
        }

        if (index === slidesLength) {
            items.style.left = -(slideSize) + "px";
            index = 0;
        }

        allowShift = true;
    }
    let dragStart = (event) => {
        event = event || window.event;
        event.preventDefault();
        posInitial = items.offsetLeft;

        if (event.type === 'touchstart') {
            posX1 = event.touches[0].clientX;
        } else {
            posX1 = event.clientX;
            document.onmouseup = dragEnd;
            document.onmousemove = dragAction;
        }
    }

    let autoplay = () => {
        shiftSlide(1)
    }

    setInterval(autoplay, speed);

    // Clone first and last slide
    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);
    wrapper.classList.add('loaded');

    // Mouse events
    items.onmousedown = dragStart;

    // Touch events
    items.addEventListener('touchstart', dragStart);
    items.addEventListener('touchend', dragEnd);
    items.addEventListener('touchmove', dragAction);

    // Click events
    prev.addEventListener('click', () => { shiftSlide(-1) });
    next.addEventListener('click', () => { shiftSlide(1) });

    // Transition events
    items.addEventListener('transitionend', checkIndex);
}
document.addEventListener('DOMContentLoaded', () => { setTimeout(slide(slider, sliderItems, prev, next), 200); })