
/* 
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to login');
            }

            const data = await response.json();

            alert('Login successful');

            // Redirect to home page or dashboard as needed
             window.location.href = '/';
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    });
}); 

document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');

    // Check if the user is logged in
    fetch('/api/auth/status')
        .then(res => res.json())
        .then(data => {
            if (data.isAuthenticated) {
                authButton.textContent = 'Sign Out';
                authButton.onclick = signOut;
            } else {
                authButton.textContent = 'Sign In';
                authButton.onclick = () => window.location.href = '/login';
            }
        });

    function signOut() {
        fetch('/api/logout', { method: 'POST' })
            .then(() => {
                // After logging out, redirect to sign in page or update UI
                window.location.href = '/login';
            })
            .catch(err => console.error('Sign out failed:', err));
    }
}); */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const authButton = document.getElementById('authButton');

    // Login form submission handling
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    throw new Error('Failed to login');
                }

                alert('Login successful');
                // Redirect to home page or dashboard as needed
                window.location.href = '/';
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed');
            }
        });
    }

    // Dynamically update "Sign In"/"Sign Out" button
    if (authButton) {
        fetch('/api/auth/status')
            .then(res => res.json())
            .then(data => {
                if (data.isAuthenticated) {
                    authButton.textContent = 'Sign Out';
                    authButton.onclick = signOut;
                } else {
                    authButton.textContent = 'Sign In';
                    authButton.onclick = () => window.location.href = '/login';
                }
            });

        function signOut() {
            fetch('/api/logout', { method: 'POST' })
                .then(() => {
                    // After logging out, redirect to sign in page or update UI
                    window.location.href = '/login';
                })
                .catch(err => console.error('Sign out failed:', err));
        }
    }
});


