const express = require('express');
// const serverless = require("serverless-http");
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');
const { json } = require('stream/consumers');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret      : 'your_secret_key',
    resave      : false,
    saveUninitialized: false,
    cookie      : { secure: false } // Set to true if using HTTPS
}));

const Users = [];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve index.html
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/compute', (req, res) => {
    const { age, first_day_of_mens, period_length, cycle_length } = req.body;
    require('./utils/compute_calendar.js');
    const obj = require('./utils/compute_calendar.js');
    obj.compute_calendar(age, first_day_of_mens, period_length, cycle_length).then((result) => {
        console.log('Result:', result);

        obj.saveQuery(age, first_day_of_mens, period_length, cycle_length).then((result) => {
            console.log('Saved:', result);
        });
        res.send(JSON.stringify(result));
    });
});

app.post('/feedback', (req, res) => {
    const { willing_to_try, another_method, others } = req.body;
    const obj = require('./utils/feedback_saving.js');
    obj.save_feedback(willing_to_try, another_method, others).then((result) => {
        console.log('Feedback saved:', result);
        res.send(JSON.stringify(result));
    }).catch((error) => {
        console.error('Error saving feedback:', error);
        res.status(500).send(JSON.stringify({'message':'Error saving feedback'}));
    });
});

app.post('/fpmethods', (req, res) => {
    const obj = require('./models/fpmethods.js');
    const fpmethods = new obj.FPMethods();
    fpmethods.getAll().then((result) => {
        console.log('FPMethods:', result);
        res.send(JSON.stringify(result));
    }).catch((error) => {
        console.error('Error getting FPMethods:', error);
        res.status(500).send(JSON.stringify({'message':'Error getting FPMethods'}));
    });
});

// signin route
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signin.html'));
});

app.post('/signin', (req, res) => {
    var db = require('./utils/db.js');

    const { email, password } = req.body;

    db.verifyUser(email, password).then((result) => {
        console.log('Verification result:', result);
        if (result === "User verified:") {
            res.send(JSON.stringify({'adminh_url':'/admin'}));
        }
        else if (result === "Invalid password") {
            res.send(JSON.stringify({'message':'Invalid password: '}));
        }
        else if (result === "User not found") {
            res.send(JSON.stringify({'message':'User not found'}));
        }
        else {
            console.log('Unknown error:', result);
            res.send(JSON.stringify({'message':'Unknown error'}));
        }
    }
    ).catch((error) => {
        console.error('Error during verification:', error);
        return "Error during verification";
    });
});

app.post('/admin', (req, res) => {
    // recheck user credentials and set session
    var db = require('./utils/db.js');
    const { email, password } = req.body;
    db.verifyUser(email, password).then((result) => {
        console.log('Verification result:', result);
        if (result === "User verified:") {
            Users.push(email); // Add user to Users array
            req.session.user = email; // Store user in session
            res.redirect('/dashboard');
        }
        else {
            res.redirect('/signin');
        }
    });
});

// from https://www.tutorialspoint.com/expressjs/expressjs_authentication.htm
function checkSignIn(req, res, next){
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      res.redirect('/signin'); // redirect to login page
   }
}

app.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/index');
});

app.get('/dashboard', checkSignIn, (req, res) => {
    console.log('User:', req.session.user);
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

app.get('/chartdata', checkSignIn, (req, res) => {
    
});

app.get('/admin', checkSignIn, (req, res) => {
    console.log('User:', req.session.user);
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.post('/add_user', checkSignIn, (req, res) => {
    var obj = require('./models/users.js');
    const { email, password } = req.body;
    console.log('Creating user object for:', email);
    const user = new obj.User();
    user.username = email;
    user.password = password;
    console.log('Saving:', user);
    user.save();
});

app.post('/get_users', checkSignIn, (req, res) => {
    var obj = require('./models/users.js');
    const user = new obj.User();
    user.getAll().then((result) => {
        console.log('Users:', result);
        res.send(JSON.stringify(result));
    }).catch((error) => {
        console.error('Error getting users:', error);
        res.status(500).send(JSON.stringify({'message':'Error getting users'}));
    });
});

app.post('/delete_user', checkSignIn, (req, res) => {
    var obj = require('./models/users.js');
    const { email } = req.body;
    console.log('Deleting user:', email);
    const user = new obj.User();
    user.username = email;
    user.delete().then((result) => {
        console.log('User deleted:', result);
        res.send(JSON.stringify(result));
    }).catch((error) => {
        console.error('Error deleting user:', error);
        res.status(500).send(JSON.stringify({'message':'Error deleting user'}));
    });
});

app.post('/update_user', checkSignIn, (req, res) => {
    var obj = require('./models/users.js');
    const { email, password } = req.body;
    console.log('Updating user:', email);
    const user = new obj.User();
    user.username = email;
    user.password = password;
    user.update().then((result) => {
        console.log('User updated:', result);
        res.send(JSON.stringify(result));
    }).catch((error) => {
        console.error('Error updating user:', error);
        res.status(500).send(JSON.stringify({'message':'Error updating user'}));
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// module.exports.handler = serverless(app);