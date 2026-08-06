import BlazeSlider from 'blaze-slider'

window.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.blaze-slider')

    if (slider) {
        const { postsVisible, postsToSlide, autoplay, loop } = slider.dataset

        const config = {
            slidesToScroll: Number(postsToSlide),
            enableAutoplay: autoplay === '1',
            loop: loop === '1',
            slidesToShow: Number(postsVisible),
        }

        new BlazeSlider(slider, {
            all: config,
        })
    }
})
