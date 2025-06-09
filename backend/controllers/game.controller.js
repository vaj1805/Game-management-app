import Game from "../models/game.model"


export async function createGame(req,res,next) {
    try {
        const newGame = new Game({
            ...req.body,
            owner : req._id
        });
        await newGame.save();
        return res.status(201).json({data : newGame});
    } catch(error) {
        next(error);
    }
}

