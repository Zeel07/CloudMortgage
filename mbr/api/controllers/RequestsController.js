module.exports = {

	getMortgageStatus: async function (req, res) {

		var MortID = req.param('MortID');
		var MortgageRequest = await Responses.findOne({
			where: { mortID: MortID }
		});

		sails.log(MortgageRequest);

		if (MortgageRequest == undefined) {
			await logs.create({ level: "info", log: "No Record found for " + MortID });
			return res.status(404).json({ status: "No Record found for " + MortID });
		}
		else {
			await logs.create({ level: "info", log: JSON.stringify(MortgageRequest) });
			return res.status(200).json(MortgageRequest);
		}
	},

	createMortgageRequest: async function (req, res) {
		var name = req.param('name');
		var address = req.param('address');
		var phoneNumber = req.param('phoneNumber');
		var employerName = req.param('employerName');
		var emailID = req.param('emailID');
		var MlsID = req.param('MlsID');
		var mortgageValue = req.param('mortgageValue');

		var createdMortagageRequest = await Requests.create({ name: name, address: address, phoneNumber: phoneNumber, employerName: employerName, MlsID: MlsID, mortgageValue: mortgageValue, emailID: emailID }).fetch();
		sails.log(createdMortagageRequest);

		var statusUpdate = await Responses.create({ name: name, MlsID: MlsID, mortID: createdMortagageRequest['id'], mortValue: mortgageValue }).fetch();

		sails.log(statusUpdate);

		var request = require('request');


		// Trigger Notification Email
		if (createdMortagageRequest) {
			var request = require('request');
			request.post({
				url: 'https://prod-05.northcentralus.logic.azure.com:443/workflows/12b98f0e62a84cf691966452a7e37ff8/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0pRH6u0M0ueT6xCphFSfocEn5L7w72aMotmleDt3LU8',
				body: {
					email: emailID,
					MortID : createdMortagageRequest['id'],
					name: name
				  },
				  json: true 
			}, function (error, response, body) {
				sails.log(error);
				//sails.log(response);
				sails.log(body);
			});
			await logs.create({ level: "info", log: JSON.stringify(createdMortagageRequest) });
			return res.status(200).json(createdMortagageRequest);

		}
		else {
			await logs.create({ level: "error", log: "DB Down" });
			return res.status(500).json("DB Down");
		}
	},


}