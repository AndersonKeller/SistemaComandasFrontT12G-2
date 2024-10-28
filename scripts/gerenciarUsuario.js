document.querySelectorAll('input[type="password"]').forEach(input => {
    input.addEventListener('focus', function() {
        this.type = 'text';
    });
    input.addEventListener('blur', function() {
        this.type = 'password';
    });
});

document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.previousElementSibling;
        input.focus();
        input.select();
    });
});