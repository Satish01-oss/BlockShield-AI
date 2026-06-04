async function adminMiddleware(
    req,
    res,
    next
) {

    try {

        if (req.user.role !== 'admin') {

            return res.status(403).json({
                message:
                    'Access denied. Admin only.'
            });
        }

        next();

    } catch (err) {

        console.log(
            'Admin Middleware Error:',
            err.message
        );

        res.status(500).json({
            message:
                'Internal server error'
        });
    }
}

module.exports = {adminMiddleware};