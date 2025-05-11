 document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById("add_user");
    if (button) {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            fetch('/add_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.status === "success") {
                    alert("User added successfully");
                } else {
                    alert("Error adding user");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }
 });