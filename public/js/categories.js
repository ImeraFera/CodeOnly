const dontHover = () => {
    document.addEventListener('DOMContentLoaded', function () {
        const hoverCard = document.getElementById('hoverCard');

        hoverCard.addEventListener('touchstart', function () {
            hoverCard.classList.add('card-hover');
        });

        hoverCard.addEventListener('touchend', function () {
            setTimeout(() => {
                hoverCard.classList.remove('card-hover');
            }, 2000);
        });
    });
}

export default dontHover;