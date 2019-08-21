exports.requireNoSignature = function(req, res, next) {
    if (req.session.signatureId) {
        return res.redirect("/thanks");
    }
    next();
};

exports.requireSignature = function(req, res, next) {
    if (!req.session.signatureId) {
        return res.redirect("/petition");
    }
    next();
};

//user id middleware function, user doesnot have an id, user has an id
