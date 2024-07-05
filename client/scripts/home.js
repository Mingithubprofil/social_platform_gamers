

// For posting on homepage

document.addEventListener('DOMContentLoaded', function() {
    const videoObserver = initVideoAutoplay();
    document.querySelectorAll('video').forEach(video => {
        videoObserver.observe(video);
    });
document.getElementById('postButton').addEventListener('click', function() {
    const postInput = document.getElementById('postInput');
    const postsContainer = document.getElementById('postsContainer');
    const userName = document.querySelector('.profile h2').textContent;
    const fileInput = document.getElementById('imageInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    if (postInput.value.trim() !== '' || fileInput.files.length > 0) {
        const postBubble = document.createElement('div');
        postBubble.classList.add('content');
        
        const postTitle = document.createElement('h3');
        postTitle.textContent = userName;
        postBubble.appendChild(postTitle);
        
        if (postInput.value.trim() !== '') {
            const postText = document.createElement('p');
            postText.textContent = postInput.value;
            postBubble.appendChild(postText);
        }

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
          
            
            reader.onload = function(e) {
                if (file.type.startsWith('image/')) {
                    const postImage = document.createElement('img');
                    postImage.src = e.target.result;
                    postImage.style.maxWidth = '100%';
                    postImage.style.maxHeight = '50%';
                    postBubble.appendChild(postImage);
                } else if (file.type.startsWith('video/')) {
                    const postVideo = document.createElement('video');
                    postVideo.setAttribute('autoplay', '');
                    postVideo.setAttribute('muted', '');
                    postVideo.setAttribute('loop', '');
                    postVideo.controls = true;
                    postVideo.style.maxWidth = '100%';
                    postVideo.style.maxHeight = '50%';
                    const source = document.createElement('source');
                    source.src = e.target.result;
                    source.type = file.type;
                    postVideo.appendChild(source);
                    postBubble.appendChild(postVideo);
                    videoObserver.observe(postVideo);
                }
            };
            
            reader.readAsDataURL(file);
        }

        postInput.value = '';
        fileInput.value = ''; 
        imagePreviewContainer.innerHTML = ''; // Clear the image preview

        postsContainer.prepend(postBubble);
    } else {
        alert('Please write something or select a file to post.');
    }
});
});

// Function to initialize video autoplay functionality
function initVideoAutoplay() {
    // Function to be called when observed videos enter or exit the viewport
    function handleVideoVisibilityChange(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play();
            } else {
                entry.target.pause();
            }
        });
    }

    // Create an Intersection Observer instance
    const videoObserver = new IntersectionObserver(handleVideoVisibilityChange, {
        root: null, // Observe videos in relation to the viewport
        threshold: 0.5 // Trigger when at least 50% of a video's area is visible
    });

    return videoObserver;
}

// For imagepreview in container for posts

document.addEventListener('DOMContentLoaded', function() {
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    imagePreviewContainer.innerHTML = ''; // Clear existing content

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (file.type.startsWith('image/')) {
                // Create and display image preview
                const imagePreview = document.createElement('img');
                imagePreview.src = e.target.result;
                imagePreview.style.maxWidth = '100%'; // Ensure the preview fits
                imagePreviewContainer.appendChild(imagePreview);
            } else if (file.type.startsWith('video/')) {
                // Create and display video preview
                const videoPreview = document.createElement('video');
                videoPreview.controls = true;
                videoPreview.style.maxWidth = '100%'; // Ensure the preview fits
                videoPreview.style.maxHeight = '200px'; // Limit the height of the video preview
                const source = document.createElement('source');
                source.src = e.target.result;
                source.type = file.type;
                videoPreview.appendChild(source);
                imagePreviewContainer.appendChild(videoPreview);
            }
        };
        
        reader.readAsDataURL(file);
    }
});
});


// bubble pop

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.bubble-img').addEventListener('click', function() {
        // Temporarily disable pointer events to prevent re-clicks during the animation
        this.style.pointerEvents = 'none';
    
        // Start the "expand" effect
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            // Fade out to "pop"
            this.style.opacity = '0';
            setTimeout(() => {
                // Reset the bubble to its initial state
                this.style.transform = 'scale(1)';
                this.style.opacity = '1';
    
                // Re-enable pointer events after the animation completes
                this.style.pointerEvents = 'auto';
                // Navigate to the homepage after 2 seconds
            setTimeout(() => {
                window.location.href = '/';
            }, 1000); // 2000 milliseconds = 2 seconds
            }, 300); // This timeout should match the duration of the "pop" and reset animations
        }, 300);
    });
    
});


// sign in / sign out - button

document.addEventListener('DOMContentLoaded', function() {
document.getElementById('authButton').addEventListener('click', function() {
    window.location.href = '/login';
});
});


// retieve username

document.addEventListener('DOMContentLoaded', () => {
    const usernameDisplay = document.querySelector('.profile h2');

    // Function to fetch and update user profile information
    const fetchUserProfile = () => {
        fetch('/api/user/profile', {
            credentials: 'include' // Important for including the session cookie in the request
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            return response.json();
        })
        .then(data => {
            usernameDisplay.textContent = data.username; // Update the username display
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
    };

    // Call the function to update user profile information
    fetchUserProfile();
});



// go from home to profile page

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.profile').addEventListener('click', function() {
        window.location.href = '/profile';
    });
    });


// dark mode button 

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');

    darkModeToggle.addEventListener('click', () => {
        // Toggle dark mode class on the body
        document.body.classList.toggle('dark-mode');

        // Update button text based on current mode
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = 'Bright Mode';
        } else {
            darkModeToggle.textContent = 'Dark Mode';
        }
    });
});



// chat 

// Function to toggle chat visibility
function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.style.display = chatContainer.style.display === 'block' ? 'none' : 'block';
}

// Function to send message
function sendMessage(socket, username) {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const messageText = chatInput.value.trim();
    if (messageText) {
        const message = { text: messageText, username: username }; // Include username in the message
        socket.emit('chat message', message); // Emit the message to the server
        chatInput.value = ''; // Clear input after sending
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }
}

// Function to initialize chat functionality
function initializeChat(username) {
    const sendMessageButton = document.getElementById('sendMessageButton');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const socket = io(); // Initialize the socket

    socket.on('chat message', function(msg) {
        let item = document.createElement('li');
        item.textContent = `${msg.username}: ${msg.text}`;
        chatMessages.appendChild(item);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
    });

    sendMessageButton.addEventListener('click', () => sendMessage(socket, username));
    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage(socket, username);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chatButton');
    const closeChat = document.getElementById('closeChat');

    // Fetch the authentication status and initialize chat if authenticated
    fetch('/api/auth/checkToken', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                fetch('/api/user/profile', { credentials: 'include' })
                    .then(response => response.json())
                    .then(userData => {
                        initializeChat(userData.username || "Guest");
                        chatButton.style.display = 'block';
                        chatButton.addEventListener('click', toggleChat);
                        closeChat.addEventListener('click', toggleChat);
                    })
                    .catch(error => console.error('Error fetching username:', error));
            } else {
                chatButton.style.display = 'none';
            }
        })
        .catch(error => console.error('Error checking auth status:', error));
});


// search functionalities 

// search for profile

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchInput = document.getElementById('searchInput');
            const query = searchInput.value.trim();
            console.log('Search for:', query);
            // Assuming you have a server-side route to handle search and return a profile page or results
            window.location.href = '/profile?query=' + encodeURIComponent(query);
        });
    } else {
        console.error('Search button not found');
    }
});



