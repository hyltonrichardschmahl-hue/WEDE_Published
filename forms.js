/* Shared validation helpers (uses jQuery) */

// Shows or clears the red error message under a field.
// Returns true if there is no error.
function setError(id, message) {
    $('#' + id + 'Error').text(message);
    $('#' + id).toggleClass('invalid', message !== '');
    return message === '';
}

function checkName(id) {
    var value = $('#' + id).val().trim();
    if (value === '') return setError(id, 'Please enter your name.');
    if (!/^[A-Za-z\s'-]{2,50}$/.test(value)) return setError(id, 'Use letters only (2 to 50 characters).');
    return setError(id, '');
}

// Returns an error message for an email, or '' if it is valid
function emailProblem(value) {
    if (value === '') return 'Please enter your email address.';
    if (value.indexOf(' ') !== -1) return 'Your email cannot contain spaces.';
    if (value.indexOf('@') === -1) return 'Your email must contain an @ symbol.';

    var parts = value.split('@');
    if (parts.length > 2) return 'Your email can only contain one @ symbol.';
    if (parts[0] === '') return 'Add the part before the @, e.g. name@example.com.';
    if (parts[1].indexOf('.') === -1) return 'Your email must contain a . after the @, e.g. name@example.com.';

    // Final check of the whole format
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(value)) {
        return 'Enter a valid email address, e.g. name@example.com.';
    }
    return '';
}

// Returns an error message for a South African phone number, or '' if it is valid
// Valid: 0 + 9 digits (10 digits in total) OR +27 + 9 digits
function phoneProblem(value, required) {
    var phone = value.replace(/[\s-]/g, '');   // ignore spaces and dashes

    if (phone === '') return required ? 'Please enter your phone number.' : '';
    if (!/^\+?[0-9]+$/.test(phone)) return 'Your phone number can only contain numbers (and a + at the start).';

    if (phone.charAt(0) === '+') {
        if (phone.indexOf('+27') !== 0) return 'International numbers must start with +27.';
        var digitsAfter = phone.length - 3;
        if (digitsAfter !== 9) return 'A number starting with +27 needs 9 digits after it. You entered ' + digitsAfter + '.';
    } else {
        if (phone.charAt(0) !== '0') return 'Your phone number must start with 0 or +27.';
        if (phone.length !== 10) return 'A number starting with 0 must have exactly 10 digits. You entered ' + phone.length + '.';
    }

    if (!/^(0|\+27)[1-8][0-9]{8}$/.test(phone)) return 'Enter a valid South African number, e.g. 012 345 7890.';
    return '';
}

function checkEmail(id) {
    return setError(id, emailProblem($('#' + id).val().trim()));
}

function checkPhone(id, required) {
    return setError(id, phoneProblem($('#' + id).val().trim(), required));
}

function checkSelect(id, message) {
    if ($('#' + id).val() === '') return setError(id, message);
    return setError(id, '');
}

// Checks that a text box is not empty and is between min and max characters
function checkLength(id, min, max, message) {
    var length = $('#' + id).val().trim().length;
    if (length < min || length > max) return setError(id, message);
    return setError(id, '');
}
