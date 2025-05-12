const obj = require('./models/records.js');

var compute_calendar = function(age, first_day_of_mens, period_length, cycle_length) {
    return new Promise((resolve, reject) => {
        // Check if the input values are valid
        if (age < 0 || period_length <= 0 || cycle_length <= 0) {
            reject("Invalid input values");
            return;
        }
        // Check if the first day of mens is a valid date
        var first_day_of_mens_date = new Date(first_day_of_mens);
        if (isNaN(first_day_of_mens_date.getTime())) {
            reject("Invalid date format");
            return;
        }
        // Check if the first day of mens is in the future
        var today = new Date();
        if (first_day_of_mens_date > today) {
            reject("First day of mens cannot be in the future");
            return;
        }
        // Check if the period length is less than the cycle length
        if (period_length >= cycle_length) {
            reject("Period length cannot be greater than or equal to cycle length");
            return;
        }
        // Check if the cycle length is less than 21 or greater than 35
        if (cycle_length < 26 || cycle_length > 32) {
            reject("This can only be used reliably by women with Cycle length between 26 and 32 days");
            return;
        }
        // Check if the first day of mens is more than 5 months ago
        var five_months_ago = new Date();
        five_months_ago.setMonth(today.getMonth() - 5);
        if (first_day_of_mens_date < five_months_ago) {
            reject("First day of mens cannot be more than 5 months ago");
            return;
        }
        // Check if the first day of mens is more than 1 month in the future    
        var one_month_later = new Date();
        one_month_later.setMonth(today.getMonth() + 1);
        if (first_day_of_mens_date > one_month_later) {
            reject("First day of mens cannot be more than 1 month in the future");
            return;
        }

        // Calculate the next period date
        var next_period_date = new Date(first_day_of_mens);
        next_period_date.setDate(next_period_date.getDate() + cycle_length);

        // Calculate the fertile window
        var fertile_start = new Date(first_day_of_mens);
        fertile_start.setDate(fertile_start.getDate() + 8 - 1);
        var fertile_end = new Date(first_day_of_mens);
        fertile_end.setDate(fertile_end.getDate() + 19 - 1);

        // Calculate unprotected days
        var unprotected_start = new Date(first_day_of_mens);
        var unprotected_end = new Date(first_day_of_mens);
        unprotected_end.setDate(unprotected_end.getDate() + 8 - 2);
        var unprotected_start2 = new Date(first_day_of_mens);
        unprotected_start2.setDate(unprotected_start2.getDate() + 19); 
        var unprotected_end2 = new Date(first_day_of_mens);
        unprotected_end2.setDate(unprotected_end2.getDate() + cycle_length - 1);

        resolve({
            next_period_date: next_period_date,
            fertile_window: {
                start: fertile_start,
                end: fertile_end
            },
            unprotected_days: {
                start: unprotected_start,
                end: unprotected_end,
                start2: unprotected_start2,
                end2: unprotected_end2
            }
        });
    });
}

exports.compute_calendar = compute_calendar;