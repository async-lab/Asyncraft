const favicon_dark = '/img/favicon-dark.svg';
const favicon_light = '/img/favicon-light.svg';

function setFavicon() {
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (faviconLink) {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        faviconLink.href = isDarkMode ? favicon_dark : favicon_light;
    }
}

function setLogo() {
    const logos = document.querySelectorAll('.navbar__logo img');
    const html = document.querySelector('html');
    if (logos.length != 0 && html) {
        logos.forEach(logo => {
            if (html.dataset.theme === 'dark') {
                logo.src = favicon_dark;
            } else {
                logo.src = favicon_light;
            }
        });
    }
}

function setPic() {
    const img = document.querySelector('img.qq');
    const iframe = document.querySelector('iframe.kook');
    const html = document.querySelector('html');
    if (html.dataset.theme === 'light') {
        if (img) img.src = '/img/qrcode-light.png';
        if(iframe) iframe.src = iframe.src.replace('theme=dark', 'theme=light');
    } else {
        if (img) img.src = '/img/qrcode-dark.png';
        if(iframe) iframe.src = iframe.src.replace('theme=light', 'theme=dark');
    }
}

// 如果你希望在颜色模式更改时更新 favicon，你可以添加以下代码
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setFavicon);

window.addEventListener('load', event => {
    setFavicon();
    setInterval(setFavicon, 100);

    setLogo();
    new MutationObserver(setLogo).observe(document.querySelector('html'), { attributes: true });

    setPic();
    new MutationObserver(setPic).observe(document.querySelector('html'), { attributes: true });
});
