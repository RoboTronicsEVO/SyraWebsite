document.addEventListener('DOMContentLoaded', () => {
    const loadPageContent = async () => {
        const rootElement = document.getElementById('root');
        if (!rootElement) {
            console.error('Root element not found.');
            return;
        }

        try {
            const response = await fetch('page.html');
            if (!response.ok) {
                throw new Error(`Failed to fetch page content: ${response.statusText}`);
            }
            const content = await response.text();
            rootElement.innerHTML = content;
        } catch (error) {
            console.error('Error loading page:', error);
            rootElement.innerHTML = `<div class="text-center text-red-500">Failed to load page content.</div>`;
        }
    };

    loadPageContent();
});
