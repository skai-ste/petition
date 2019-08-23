exports.hasNoSignature = function(req, res, next) {
    if (!req.session.signatureId) {
        next();
    } else {
        res.redirect("/thanks");
    }
};

exports.hasSignature = function(req, res, next) {
    if (req.session.signatureId) {
        next();
    } else {
        res.redirect("/petition");
    }
};

exports.hasUserId = function(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect("/register");
    }
};

exports.hasNoUserId = function(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/petition");
    } else {
        next();
    }
};
