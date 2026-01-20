const API_URL = '/api/blogs';

// Get elements
const blogForm = document.getElementById('blogForm');
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');
const authorInput = document.getElementById('author');
const blogIdInput = document.getElementById('blogId');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const refreshBtn = document.getElementById('refreshBtn');
const blogList = document.getElementById('blogList');
const messageDiv = document.getElementById('message');

// Load blogs when page loads
window.onload = function() {
    loadBlogs();
};

// Form submit
blogForm.onsubmit = async function(e) {
    e.preventDefault();

    const title = titleInput.value;
    const body = bodyInput.value;
    const author = authorInput.value;
    const blogId = blogIdInput.value;

    const data = { title, body };
    if (author) data.author = author;

    try {
        let response;
        if (blogId) {
            // Update
            response = await fetch(`${API_URL}/${blogId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Create
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            resetForm();
            loadBlogs();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
};

// Cancel button
cancelBtn.onclick = function() {
    resetForm();
};

// Refresh button
refreshBtn.onclick = function() {
    loadBlogs();
};

// Load all blogs
async function loadBlogs() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            displayBlogs(result.data);
        } else {
            blogList.innerHTML = '<p>No blogs found.</p>';
        }
    } catch (error) {
        blogList.innerHTML = '<p>Error loading blogs.</p>';
    }
}

// Display blogs
function displayBlogs(blogs) {
    blogList.innerHTML = '';

    blogs.forEach(blog => {
        const div = document.createElement('div');
        div.className = 'blog-item';

        const date = new Date(blog.createdAt).toLocaleDateString();

        div.innerHTML = `
            <h3>${blog.title}</h3>
            <p>${blog.body}</p>
            <div class="meta">Author: ${blog.author} | Date: ${date}</div>
            <button class="edit-btn" onclick="editBlog('${blog._id}')">Edit</button>
            <button class="delete-btn" onclick="deleteBlog('${blog._id}')">Delete</button>
        `;

        blogList.appendChild(div);
    });
}

// Edit blog
async function editBlog(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();

        if (result.success) {
            titleInput.value = result.data.title;
            bodyInput.value = result.data.body;
            authorInput.value = result.data.author;
            blogIdInput.value = result.data._id;
            submitBtn.textContent = 'Update';
        }
    } catch (error) {
        showMessage('Error loading blog', 'error');
    }
}

// Delete blog
async function deleteBlog(id) {
    if (confirm('Are you sure you want to delete this blog?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showMessage(result.message, 'success');
                loadBlogs();
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Error deleting blog', 'error');
        }
    }
}

// Reset form
function resetForm() {
    blogForm.reset();
    blogIdInput.value = '';
    submitBtn.textContent = 'Create';
    messageDiv.style.display = 'none';
}

// Show message
function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = type;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}