const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");

exports.sharedProfileData = async function (req, res, next) {
    let isVisitorsProfile = false
    let isFollowing = false
    if (req.session.user) {
        isVisitorsProfile = req.profileUser._id.equals(req.session.user._id)
        isFollowing = await Follow.isVisitorFollowing(req.profileUser._id, req.visitorId)
    }
    req.isVisitorsProfile = isVisitorsProfile
    req.isFollowing = isFollowing
    next()
}

exports.mustBeLoggedIn = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash("errors", "You must be logged in to that perform that action.")
        req.session.save(() => {
            res.redirect('/')
        })
    }
}

exports.login = (req, res) => {
    let user = new User(req.body);
    user
        .login()
        .then((result) => {
            req.session.user = {
                avatar: user.avatar,
                username: user.data.username,
                _id: user.data._id
            };
            req.session.save(() => {
                res.redirect("/");
            });
        })
        .catch((err) => {
            req.flash("errors", err);
            req.session.save(() => {
                res.redirect("/");
            });
        });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};

exports.register = (req, res) => {
    let user = new User(req.body);
    user.register().then(() => {
        req.session.user = {
            username: user.data.username,
            avatar: user.avatar,
            _id: user.data._id
        }
        req.session.save(() => {
            res.redirect("/");
        });
    }).catch((regErrors) => {
        regErrors.forEach((error) => {
            req.flash("regErrors", error);
        });
        req.session.save(() => {
            res.redirect("/");
        });
    })

};

exports.home = (req, res) => {
    if (req.session.user) {
        res.render("home-dashboard");
    } else {
        res.render("home-guest", {

            regErrors: req.flash("regErrors"),
        });
    }
};

exports.ifUserExists = function (req, res, next) {
    User.findByUsername(req.params.username).then((userDocument) => {
        req.profileUser = userDocument;
        next();
    }).catch(() => {
        res.render('404');
    })
}

exports.profilePostsScreen = function (req, res) {
    //ask our postel model for posts by a certain author id

    Post.findByAuthorId(req.profileUser._id).then((posts) => {

        res.render('profile', {
            posts: posts,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile
        })
    }).catch(() => {
        res.render('404');
    })

}


exports.profileFollowersScreen = async function (req, res) {
    try {
        let followers = await Follow.getFollowersById(req.profileUser._id)
        res.render('profile-followers', {
            followers: followers,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile
        })
    } catch {
        res.render("404")
    }
}
