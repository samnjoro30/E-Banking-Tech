

exports.Cookie = {
    getOptions: () => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60  * 1000, 
    }),
    set: (res, name, value, options = {}) => {
        const opts = { ...Cookie.getOptions(), ...options };
        res.cookie(name, value, opts);
    },
    clear: (res, name, option) => {
        res.clearCookie(name, { ...Cookie.getOptions(), ...option});
    },
    get: (res, name) => {
        return res.cookies[name];
    }
}