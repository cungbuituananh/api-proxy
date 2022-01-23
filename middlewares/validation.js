exports.validateAuthorization = async (req, res, next) => {
    if (req.headers.authorization === undefined) {
        return res.status(403)
            .json({
                status: false,
                message: ['Authorization header is required']
            });
    }
    next();
}


