var save_feeback = function(willing_to_try, another_method, others) {
    const feedback = {
        willing_to_try: willing_to_try,
        another_method: another_method,
        others: others
    };
    console.log('Saving feedback:', feedback);
    return new Promise((resolve, reject) => {
        const Feedback = require('./models/feedback.js');
        const feedbackObj = new Feedback();
        feedbackObj.willing_to_try = feedback.willing_to_try;
        feedbackObj.another_method = feedback.another_method;
        feedbackObj.others = feedback.others;

        feedbackObj.save()
            .then((result) => {
                console.log('Feedback saved:', result);
                resolve(result);
            })
            .catch((error) => {
                console.error('Error saving feedback:', error);
                reject(error);
            });
    });
}

exports.save_feedback = save_feeback;