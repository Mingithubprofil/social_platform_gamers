
/*document.addEventListener('DOMContentLoaded', function() {
    const queryParams = new URLSearchParams(window.location.search);
    const username = queryParams.get('username');

    // Fetch user details from your backend and update the DOM
    document.getElementById('userName').textContent = username;

    // Handle follow button click
    document.getElementById('followButton').addEventListener('click', function() {
        // Example follow action
        console.log('Follow', username);
        // You'll need to send a request to your backend to follow the user
    });
}); */

document.addEventListener('DOMContentLoaded', function() {
    const queryParams = new URLSearchParams(window.location.search);
    const username = queryParams.get('username');

    // Fetch user details to get the user ID
    fetch(`/api/user/profile/${username}`)
        .then(response => response.json())
        .then(data => {
            // Update the UI with the fetched user data
            document.getElementById('userName').textContent = data.username;

            // Store the fetched user ID in a variable for later use
            const userId = data.id;

            // Handle follow button click
            document.getElementById('followButton').addEventListener('click', function() {
                // Send a request to follow the user
                fetch('/api/user/follow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include authorization header if your API requires
                    },
                    body: JSON.stringify({ followUserId: userId }),
                    credentials: 'include' // Include credentials if your API uses sessions or cookies
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Followed successfully');
                        // Update the UI accordingly
                    } else {
                        console.error('Failed to follow');
                    }
                })
                .catch(error => {
                    console.error('Error following the user:', error);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
});

