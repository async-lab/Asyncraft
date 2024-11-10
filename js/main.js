const favicon_dark = '/img/favicon-dark.svg';
const favicon_light = '/img/favicon-light.svg';

// favicon 策略
new ThemeStrategy('link[rel="icon"]',
    element => element.href = favicon_dark,
    element => element.href = favicon_light
);

// logo 策略
new ThemeStrategy('.navbar__logo img',
    element => element.src = favicon_dark,
    element => element.src = favicon_light
);

// 图片策略
new ThemeStrategy('img.qq',
    element => element.src = '/img/qrcode-dark.png',
    element => element.src = '/img/qrcode-light.png'
);

// iframe.kook 策略
new ThemeStrategy('iframe.kook',
    element => element.src = element.src.replace('theme=light', 'theme=dark'),
    element => element.src = element.src.replace('theme=dark', 'theme=light')
);

// giscus 策略
new ThemeStrategy('giscus-widget',
    element => element.theme = "transparent_dark",
    element => element.theme = "light"
);
