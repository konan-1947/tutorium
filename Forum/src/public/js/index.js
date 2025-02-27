document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const currentPath = window.location.pathname;

    async function loadContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
            }
            const html = await response.text();

            mainContent.innerHTML = html;

            // Xử lý script của trang con (nếu có)
            const scripts = mainContent.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.text = script.text;
                mainContent.appendChild(newScript);
                script.remove();
            });

        } catch (error) {
            console.error('Lỗi khi tải nội dung:', error);
            mainContent.innerHTML = `<p>Lỗi khi tải nội dung: ${error.message}</p>`;
        }
    }

    if (currentPath === '/posts') {
        loadContent('/posts');
    } else if (currentPath === '/newpost') {
        loadContent('/newpost');
    } else {
        mainContent.innerHTML = '<h1>Chào mừng bạn đến với trang chủ!</h1>';
    }
});

