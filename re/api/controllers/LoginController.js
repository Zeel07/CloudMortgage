module.exports = {

    login: async function (req, res) {
        var username = req.param('username');
        var password = req.param('password');
        sails.log(username + password);
        if (!(username && password)) {
            await logs.create({ level: "info", log: "No username or password specified!" });
            res.status(403).json("No username or password specified!");

        }
        else {
            if (username == "appr1" && password == "test") {
                req.session.authenticated = true;
                req.session.User = user;
                var result = {
                    success: "true",
                    role: "Appraiser"
                };
                await logs.create({ level: "info", log: username + " Logged in sucessfull" });
                res.status(200).json(result);
            }

            var user = await User.find({
                username: username,
                password: password
            });

            sails.log(user.length);

            if (user.length == 0) {
                var result = {
                    success: "false"
                };
                await logs.create({ level: "info", log: username + " Logged in unsucessfull" });
                res.status(403).json(result);
            }
            else {
                req.session.authenticated = true;
                req.session.User = user;
                var result = {
                    success: "true",
                    role: "user"
                };
                await logs.create({ level: "info", log: username + " Logged in sucessfull" });
                res.status(200).json(result);
            }
        }
    },

};