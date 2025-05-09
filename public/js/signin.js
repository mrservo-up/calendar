document.addEventListener('DOMContentLoaded', () => {
    var message = document.getElementById("message");
    var error = document.getElementById("error");
    if (message) {
        error.innerHTML = message;
    }
});