/* Enquiry form: validation, date rules and availability check (uses jQuery) */

$(document).ready(function () {

    // Dates that are already booked (replaced by bookings.json when it loads)
    var bookedDates = ['2026-11-05', '2026-11-06', '2026-11-12', '2026-11-19', '2026-11-26', '2026-12-03'];

    // Example prices – change these to match your services
    var prices = {
        services: 'A design consultation is free. Custom dress designs start from R1 500.',
        products: 'Ready-made products range from R350 to R1 200.',
        volunteering: 'Volunteering is unpaid. We will discuss the available roles with you.',
        sponsorship: 'Sponsorship packages are tailored to your budget.'
    };

    // AJAX: load the booked dates without reloading the page
    $.getJSON('bookings.json', function (data) {
        bookedDates = data.bookedDates;
    });

    // Turns a date into text like 2026-11-05
    function toText(date) {
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    }

    // Today, and the earliest date that can be booked (3 days from today)
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var earliest = new Date(today);
    earliest.setDate(today.getDate() + 3);

    // The date picker greys out dates before the earliest date
    $('#appointmentDate').attr('min', toText(earliest));

    function checkDate() {
        var value = $('#appointmentDate').val();
        if (value === '') return setError('appointmentDate', 'Please choose a date.');

        var chosen = new Date(value + 'T00:00:00');

        if (chosen < today) return setError('appointmentDate', 'You cannot select a date in the past.');
        if (chosen < earliest) return setError('appointmentDate', 'Appointments must be booked at least 3 days in advance.');
        if (chosen.getDay() === 0) return setError('appointmentDate', 'We are closed on Sundays.');
        if (bookedDates.indexOf(value) !== -1) return setError('appointmentDate', 'Sorry, that date is already booked. Please choose another.');
        return setError('appointmentDate', '');
    }

    function checkConsent() {
        var ticked = $('#enqConsent').prop('checked');
        return setError('enqConsent', ticked ? '' : 'You must agree before sending your request.');
    }

    // Check each field when the user clicks away from it
    $('#enqName').on('blur', function () { checkName('enqName'); });
    $('#enqEmail').on('blur', function () { checkEmail('enqEmail'); });
    $('#enqPhone').on('blur', function () { checkPhone('enqPhone', true); });
    $('#enquiryType').on('change', function () { checkSelect('enquiryType', 'Please choose what your enquiry is about.'); });
    $('#appointmentDate').on('change blur', checkDate);
    $('#timeSlot').on('change', function () { checkSelect('timeSlot', 'Please choose a time.'); });
    $('#enqConsent').on('change', checkConsent);

    $('#enquiryForm').on('submit', function (event) {
        event.preventDefault();
        var form = this;

        var ok = true;
        if (!checkName('enqName')) ok = false;
        if (!checkEmail('enqEmail')) ok = false;
        if (!checkPhone('enqPhone', true)) ok = false;
        if (!checkSelect('enquiryType', 'Please choose what your enquiry is about.')) ok = false;
        if (!checkDate()) ok = false;
        if (!checkSelect('timeSlot', 'Please choose a time.')) ok = false;
        if (!checkConsent()) ok = false;
        if (!ok) return;

        // AJAX: get the latest booked dates, then check the date one more time
        $.getJSON('bookings.json', function (data) {
            bookedDates = data.bookedDates;
        }).always(function () {
            if (!checkDate()) return;

            var niceDate = new Date($('#appointmentDate').val() + 'T00:00:00')
                .toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

            // Show the response (.text() keeps what the user typed safe)
            $('#enquiryResponse').empty().removeClass('hidden')
                .append($('<h3>').text('Thank you, ' + $('#enqName').val().trim() + '!'))
                .append($('<p>').text('Availability: ' + niceDate + ' is free. We have pencilled you in for the ' +
                    $('#timeSlot').val().toLowerCase() + '.'))
                .append($('<p>').text('Cost: ' + prices[$('#enquiryType').val()]));

            form.reset();
        });
    });
});
