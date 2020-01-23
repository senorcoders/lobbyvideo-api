/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    code: async (req, res) => {
        console.log(req.headers.origin);
        length = 6;
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        console.log("Res: ", result);
        
        res.status(200).send(result);
    },
    create: async (req, res) => {
		const data = req.allParams();

        let userCheck = await Users.find({ email: data.email });
        console.log("User: ", userCheck)
		if (userCheck.length > 0) { 
			return res.send({'message':'already a user'}) 
		}
        if (data.password !== data.confirmPassword) return res.badRequest("Password not the same");

        let user = await Users.create({
                email: data.email,
                password: data.password,
				fullName: data.fullName,
			}).fetch()
			.catch((err) => {
                sails.log.error(err);
                return res.serverError("Something went wrong");
            });
        
        console.log("User: ", user);
		res.send({ token: jwToken.issue({ id: user.id }), 'userid': user.id }); // payload is { id: user.id}
          
            
    },
    login(req, res) {
        const data = req.allParams();
		let email = data.email;
		let password = data.password;
        console.log("Data Provided: ", data.email + ", " + data.password);
        if (!data.email || !data.password) return res.badRequest('Email and password required');

        Users.findOne({ email: email })
            .then((user) => {
                console.log("USER: ", user);
                if (!user) return res.notFound();
                
                Users.comparePassword(password, user.encryptedPassword)
                    .then(() => {
                        // put the token and user together to pass them to the next promise
                        const tokenUser = [{ token: jwToken.issue({ id: user.id }) }, user];
                        return tokenUser;
                    })
                    .then(async (tokenUser) => {

                        // get the team from the user and send it back with the token
                        let user = tokenUser[1];
                        let token = tokenUser[0];
                        let team = await Teams.findOne({id: user.team});
                        if (!team || team == 'null'){
                            team = '';
                        }
                        let sendBody = {'token':token, 'team':team, 'userid': user.id}
                        return res.status(200).send(sendBody);
                    })

                    .catch((err) => {
                        return res.forbidden();
                    });
                    

                
            })
            .catch((err) => {
                sails.log.error(err);
                return res.serverError();
            });
    },
};

