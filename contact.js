/* Contact form: validation and sending the email (uses jQuery) */

$(document).ready(function () {

    var recipient = 'Someone@gmail.com';

    // Show how many characters have been typed
    $('#message').on('input', function () {
        $('#messageCount').text($(this).val().length + ' / 1000');
    });

    // Check each field when the user clicks away from it
    $('#contactName').on('blur', function () { checkName('contactName'); });
    $('#contactEmail').on('blur', function () { checkEmail('contactEmail'); });
    $('#contactPhone').on('blur', function () { checkPhone('contactPhone', false); });
    $('#reason').on('change', function () { checkSelect('reason', 'Please choose a type of message.'); });
    $('#subject').on('blur', function () { checkLength('subject', 3, 80, 'Enter a subject (3 to 80 characters).'); });
    $('#message').on('blur', function () { checkLength('message', 20, 1000, 'Your message must be 20 to 1000 characters.'); });

    $('#contactForm').on('submit', function (event) {
        event.preventDefault();

        // Run every check so all the errors show at once
        var ok = true;
        if (!checkName('contactName')) ok = false;
        if (!checkEmail('contactEmail')) ok = false;
        if (!checkPhone('contactPhone', false)) ok = false;
        if (!checkSelect('reason', 'Please choose a type of message.')) ok = false;
        if (!checkLength('subject', 3, 80, 'Enter a subject (3 to 80 characters).')) ok = false;
        if (!checkLength('message', 20, 1000, 'Your message must be 20 to 1000 characters.')) ok = false;
        if (!ok) return;

        // Put the details together into an email
        var reason = $('#reason option:selected').text();
        var subject = reason + ' - ' + $('#subject').val().trim();
        var body = 'Name: ' + $('#contactName').val().trim() + '\n' +
                   'Email: ' + $('#contactEmail').val().trim() + '\n' +
                   'Phone: ' + ($('#contactPhone').val().trim() || 'Not provided') + '\n' +
                   'Type of message: ' + reason + '\n\n' +
                   $('#message').val().trim();

        // Open the visitor's email app with the email filled in
        window.location.href = 'mailto:' + recipient +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);

        $('#contactResponse').removeClass('hidden').html(
            '<h3>Your email is ready to send</h3>' +
            '<p>Press <strong>Send</strong> in your email app to deliver your message to us.</p>');
        this.reset();
        $('#messageCount').text('0 / 1000');
    });
});
