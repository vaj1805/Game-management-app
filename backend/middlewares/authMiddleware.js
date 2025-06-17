export  function ensureLoggedIn(req,res,next) {
    if(!req.user) {
        return res.redirect("/api/auth/login");
    }
    next();
}

export  function ensurePlayer(req,res,next) {
    if(req.user.role !== "Player") {
        return res.status(403).send("Forbidden : Players only");
    }
    next();
}

export  function ensureOwner(req,res,next) {
    if(req.user.role !== "Owner") {
        return res.status(403).send("Forbidden : Business owners only");
    }
    next();
}

