export function showPlayerDashboard(req,res) {
    res.render("dashboard/player" , {user : req.user});
}

export function showOwnerDashboard(req,res) {
    res.render("dashboard/owner" , {user : req.user});
}

