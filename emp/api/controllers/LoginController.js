module.exports = {

    login: async function (req, res) {

        var id = req.param('id');
        var password = req.param('password');

        sails.log(id + password);
        if (!(id && password)) {
            await logs.create({ level: "info", log: "No username or password specified!" });
            res.status(403).json("No username or password specified!");

        }
        else {
            var user = await User.find({
                id: id,
                password: password// TODO: hash the password first
            });

            sails.log(user.length);

            if (user.length == 0) {
                await logs.create({ level: "info", log: "Wrong username or password Combination for "+ id });
                res.status(403).send("false");
            }
            else {
                req.session.authenticated = true;
                req.session.User = user;
                await logs.create({ level: "info", log: id + " logged in successfully" });
                res.status(200).send("true");
            }
        }
    },

};