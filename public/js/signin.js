document.addEventListener('DOMContentLoaded', () => {
    var submit = document.getElementById("submit");
    submit.addEventListener("click", function(event) {
        hideMessage();
        event.preventDefault();
        const form = document.getElementById("signin-form");
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showMessage(data.message);
            }
            else if (data.adminh_url) {
                form.action = data.adminh_url;
                const theOtherSubmit = document.getElementById("another_submit");
                theOtherSubmit.click();
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

function showMessage(message) {
    const messageBox = document.getElementById("message");
    messageBox.style.display = "block";
    const messageElement = document.getElementById("message_proper");
    messageElement.innerText = message;
    
}

function hideMessage() {
    const messageElement = document.getElementById("message");
    messageElement.style.display = "none";
}