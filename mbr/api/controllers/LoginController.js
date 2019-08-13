module.exports = {
    
    login: async function (req, res) {
        // Get password and username from request
        var username = req.param('username');
        var password = req.param('password');
        if (!(username && password)) {
            await logs.create({ level: "info", log: "No username or password specified!" });
            res.status(403).json("No username or password specified!");
        }
        else {
            var user = await User.find({
                username: username,
                password: password 
            });
            sails.log(user.length);


            if (user.length == 0) {
                await logs.create({ level: "info", log: "Wrong username or password Combination for "+ username });
                res.status(403).send("false");
            }
            else {
                req.session.authenticated = true;
                req.session.User = user;
                await logs.create({ level: "info", log: username + " logged in successfully" });
                res.status(200).send("true");
            }
        }
    },

}