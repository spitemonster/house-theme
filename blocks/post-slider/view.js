import BlazeSlider from 'blaze-slider'

window.addEventListener('DOMContentLoaded', () => {
    const postSlider = document.querySelector('.post-slider.blaze-slider')

    if (postSlider) {
        const { postsVisible, postsToSlide, autoplay, loop } =
            postSlider.dataset

        const config = {
            slidesToScroll: Number(postsToSlide),
            enableAutoplay: autoplay === '1',
            loop: loop === '1',
            slidesToShow: Number(postsVisible),
        }

        new BlazeSlider(postSlider, {
            all: config,
        })
    }
})
