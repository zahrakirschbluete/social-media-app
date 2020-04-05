const User = require('../models/User');

exports.login = (req, res) => {
    let user = new User(req.body);
    user.login().then((result) => {
        req.session.user = {
            favColor: "blue",
            username: user.data.username
        }
        req.session.save(() => {
            res.redirect('/')
        })
    }).catch((err) => {
        res.send(err)
    })
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });

}

exports.register = (req, res) => {
    let user = new User(req.body)
    user.register();
    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send("Congrats, there are no errors")
    }
}

exports.home = (req, res) => {
    if (req.session.user) {
        res.render('home-dashboard', {
            username: req.session.user.username
        })
    } else {
        res.render('home-guest')
    }
}
