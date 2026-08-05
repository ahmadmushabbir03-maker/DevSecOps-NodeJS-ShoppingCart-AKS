document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-box');
    const searchInput = document.querySelector('input[name="city"]');
    const submitBtn = document.querySelector('.btn-submit');

    if (searchForm) {
        searchForm.addEventListener('submit', () => {
            if (searchInput.value.trim() !== '') {
                submitBtn.style.opacity = '0.7';
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            }
        });
    }
});
