module.exports = {

	getPendingRequests: async function (req, res) {

		var requestsToBeApproved = await Requests.find({
			where: { status: "pending" }
		});
		if (requestsToBeApproved == undefined) {
			await logs.create({ level: "info", log: "No requests to approve" });
			return res.status(200).json({ status: "No requests to approve" });
		}
		else {
			await logs.create({ level: "info", log: "pending requests returned sucessfully" });
			return res.status(200).json(requestsToBeApproved);
		}
	},

	createRERequest: async function (req, res) {
		var name = req.param('name');
		var MlsID = req.param('MlsID');
		var MortID = req.param('MortID');

		var createdRERequest = await Requests.create({ name: name, MlsID: MlsID, MortID: MortID }).fetch();
		sails.log(createdRERequest);

		if (createdRERequest) {
			await logs.create({ level: "info", log: MortID +" Request Created Sucessfully" });
			return res.status(200).json(createdRERequest);
		}
		else {
			await logs.create({ level: "error", log: "Error Creating Request  for " + MortID });
			return res.status(500).json("Error Creating Request  for " + MortID);
		}
	},

	appriase: async function (req, res) {

		var MortID = req.param('MortID');
		var appraisedAmount = req.param('appraisedAmount');
		var status = req.param('status');

		sails.log(appraisedAmount);
		var appraisedRequest = await Requests.updateOne({ MortID: MortID })
			.set({
				appraisedAmount: appraisedAmount, status: status
			});

		sails.log(appraisedRequest);

		var request = require('request');
		request.post({
			url: 'https://prod-12.northcentralus.logic.azure.com:443/workflows/866075411ba344338a36415f016ddca3/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=WohA-PuLRxv4mCWuG3aPZ2ip1f-TNyOMnKI0dWM33kw',
			body: appraisedRequest,
			json: true
		}, function (error, response, body) {
			sails.log(body);
		});

		if (appraisedRequest) {
			await logs.create({ level: "info", log: JSON.stringify(MortID + " Upraised Sucessfully") });
			return res.status(200).json(appraisedRequest);
		}
		else {
			await logs.create({ level: "info", log: "MorID: "+MortID+ " Not Found " });
			return res.status(404).send( "MorID: "+MortID+ " Not Found ");
		}
	},

}