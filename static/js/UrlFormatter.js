// 在所有页面URL后面添加斜杠("/")，以避免重定向

function formatURL() {
    // 获取当前路径
    var currentPath = window.location.pathname;

    // 如果不是根页面且不以斜杠("/")结尾
    if (currentPath !== "/" && !currentPath.endsWith("/")) {
        // 使用history.replaceState更改地址栏URL，但不重新加载页面
        history.replaceState({}, "", currentPath + "/");
    }
};



setInterval(formatURL, 100);