module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        return res.status(401).redirect('/login');
    }

    if(req.user.isAdmin === false) {
        return res.status(401).redirect('/');
    }

    next();
}