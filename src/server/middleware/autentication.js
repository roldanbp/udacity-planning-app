module.exports = (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
        const body = {
            ...req.body,
            userId: `GUEST-${Math.random()}`,
        }
        req.body = body;
    }
    
    next();
}