/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    code: async (req, res) => {
        console.log(req.ips);
        length = 6;
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        console.log("Res: ", result);
        await Codes.create({'code': result});
        res.status(200).send(result);
    },
    checkCode: async (req, res) => {
        let data = req.allParams();
        // receive code & email
        // Check if code has been set within 15 minutes
        // set code to user
        var getNow = Date.now()-900000;

        if (data.email && data.code){
            var codeId = await Codes.find({ where: {code: data.code, updatedAt: {'>=': getNow}}, select: ['id']})
            if (codeId.length > 0){
                let theCode = codeId[0].id
                var updated = await Users.updateOne({email: data.email}).set({code: theCode});
                if (updated.length > 0){
                    updated = 'success'
                }
            } else {
                var updated = 'failed';
            }
        } else {
            res.status(500);
        }

        res.status(200).send(updated);

    },
    loginCode: async (req, res) => {
        let data = req.allParams();
        // check code against user table and return correct video
        console.log("LOGIN COde: ", data.code);
        let codeId = await Codes.find({where: {code: data.code}, select: ['id']});
        console.log("codeId: ", codeId);
        if (codeId.length > 0){
            var video = await Users.find({code: codeId[0].id});
            if (video.length > 0){
                console.log("Video Info: ", video[0].video);
                if (video[0].video.length > 0) {
                    console.log("Video Available Sending: ", video[0].video)
                    let dV = 'http://lobbyvideo.senorcoders.com/' + video[0].video
                    res.status(200).send(dV);
                } else {
                    let defaultVideo = 'http://lobbyvideo.senorcoders.com/uscenes_soft_coral_tank.mp4';
                    //console.log("Video N/A Sending: ", video.video)
                    defaultVideo = {"video":defaultVideo}
                    res.status(200).send(defaultVideo);
                }
            } else {
                res.status(200).send('none');
                return;
            }
    
        } else {
            res.status(200).send('none');
            return;
        }
        
        
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
                        console.log("Token: ", tokenUser);
                        let user = tokenUser[1];
                        let token = tokenUser[0];
                        
                        let sendBody = {'token':token, 'userid': user.id}
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
    setCode: async (req, res) => {
        data = req.allParams();
        let code = data.code;
        let email = data.email;

        let setCode = await Codes.find({code: code});
        if (setCode.length > 0){
            console.log("Code Info: ", setCode);
            let video = await Users.update({email: email}).set({code: setCode[0].id}).fetch();
            res.send("Updated")
        } else {
            res.send("Incorrect Code");
        }
        // check if code is valid in code table
    },
    setVideo: async (req, res) => {
        let data = req.allParams();
        let email = data.email
        if (data.video.length > 0){
            var video = await Users.update({email: data.email}).set({video: data.video}).fetch();
        } else {
            res.status(500);
        }

        res.status(200).send(video);
    },
    sendMail: async(req, res) => {
        let data = req.body;
        await sails.helpers.mailer(data);
        res.status(200);
    },
};

