module.exports = {

	quoteHouse: async function (req, res) {

		var MortID = req.param('MortID');
		var appraisedAmount = req.param('appraisedAmount');
		var name = req.param('name');
		var MlsID = req.param('MlsID');

		//Check Insurance

		var myMap = new Map();
		myMap.set(1, 100000);
		myMap.set(2, 200000);
		myMap.set(3, 0);
		myMap.set(4, 200);
		myMap.set(5, 20000);

		sails.log(myMap.get(MlsID));

		insuredValue = (myMap.get(MlsID) + appraisedAmount) * 0.15;
		deductibleValue = insuredValue * 0.5;

		sails.log(insuredValue)
		sails.log(deductibleValue)

		var insuredHouse = await Requests.create({ MortID: MortID, MlsID: MlsID, appraisedAmount: appraisedAmount, name: name, insuredValue: insuredValue, deductibleValue: deductibleValue })
			.fetch();

		sails.log(insuredHouse);

		var request = require('request');
		request.post({
			url: 'https://prod-12.northcentralus.logic.azure.com:443/workflows/8e0e6f4a038f4ceaa59ba2b79ce38990/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nxY048nt8UxqbmQEf3uHKyBVfQEmhQAujzHyLpXyxbA',
			body: insuredHouse,
			json: true
		}, function (error, response, body) {
			sails.log(error);
			sails.log(body);
		});

		if (insuredHouse) {
			await logs.create({ level: "info", log: "Houses "+MlsID+" Insurance is sucessfully quoted "});
			return res.status(200).json(insuredHouse);
		}
		else {
			await logs.create({ level: "info", log: "Houses "+MlsID+" Insurance Quote is unsucessfull "});
			return res.status(500).json("error");
		}

	},

}