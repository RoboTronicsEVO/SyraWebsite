import * as auth from '../lib/auth.js';

const root = document.getElementById('root');
const authStatusContainer = document.getElementById('auth-status-container');

const routes = {
    '/': 'page.html',
    '/signin': 'signin/page.html',
    '/profile': 'profile/page.html'
};

const protectedRoutes = ['/profile'];

async function renderComponent(url, containerId) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch component: ${url}`);
        const content = await response.text();
        document.getElementById(containerId).innerHTML = content;
    } catch (error) {
        console.error('Error rendering component:', error);
    }
}

async function handleAuthStatus() {
    const session = await auth.getSession();
    if (session) {
        await renderComponent('../components/auth/profile_button.html', 'auth-status-container');
        const signOutButton = document.getElementById('sign-out-button');
        if (signOutButton) {
            signOutButton.addEventListener('click', async () => {
                await auth.signOut();
                window.location.hash = '#/';
            });
        }
    } else {
        await renderComponent('../components/auth/sign_in_buttons.html', 'auth-status-container');
    }
}

async function handleSignInPage() {
    await renderComponent('../components/auth/login_form.html', 'login-form-container');

    const form = document.getElementById('login-form');
    const googleBtn = document.getElementById('google-signin-btn');
    const githubBtn = document.getElementById('github-signin-btn');
    const errorDiv = document.getElementById('login-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.classList.add('hidden');
        const email = form.email.value;
        const password = form.password.value;
        const result = await auth.signIn('credentials', { email, password });
        if (result.ok) {
            window.location.hash = result.url.substring(1);
        } else {
            errorDiv.textContent = result.error;
            errorDiv.classList.remove('hidden');
        }
    });

    googleBtn.addEventListener('click', async () => {
        const result = await auth.signIn('google');
        if (result.ok) window.location.hash = result.url.substring(1);
    });

    githubBtn.addEventListener('click', async () => {
        const result = await auth.signIn('github');
        if (result.ok) window.location.hash = result.url.substring(1);
    });
}

async function handleProfilePage() {
    const session = await auth.getSession();
    const profileContent = document.getElementById('profile-content');
    if (session && profileContent) {
        profileContent.innerHTML = `
            <div class="flex items-center space-x-4">
                <img class="h-16 w-16 rounded-full" src="${session.user.image}" alt="User avatar">
                <div>
                    <p class="font-semibold text-lg">${session.user.name}</p>
                    <p class="text-gray-500">${session.user.email}</p>
                </div>
            </div>
            <div class="mt-6 border-t pt-4">
              <p class="text-sm text-gray-500">This is a protected page. Only authenticated users can see this content.</p>
            </div>
        `;
    }
}


async function router() {
    const path = window.location.hash.substring(1) || '/';
    const pageFile = routes[path];

    if (!pageFile) {
        root.innerHTML = `<div class="text-center text-red-500">404 - Page Not Found</div>`;
        return;
    }
    
    const session = await auth.getSession();
    if (protectedRoutes.includes(path) && !session) {
        window.location.hash = '#/signin';
        return;
    }

    try {
        const response = await fetch(pageFile);
        if (!response.ok) throw new Error(`Failed to fetch page: ${pageFile}`);
        const content = await response.text();
        root.innerHTML = content;

        if (path === '/signin') {
            await handleSignInPage();
        } else if (path === '/profile') {
            await handleProfilePage();
        }

    } catch (error) {
        console.error('Error loading page:', error);
        root.innerHTML = `<div class="text-center text-red-500">Failed to load page content.</div>`;
    }
}

async function onHashChange() {
    await handleAuthStatus();
    await router();
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.hash) {
        window.location.hash = '#/';
    }
    
    window.addEventListener('hashchange', onHashChange);

    await handleAuthStatus();
    await router();
});
