module.exports = {
	
	submitEmployeeDetails: async function (req, res) {

		var empID = req.param('empID');
		var MortID = req.param('MortID');
		var url = req.param('url');
		var name = req.param('name');

		sails.log(MortID);

		var employee = await EmployeeDetails.findOne({
			id: empID, name: name
		});

		sails.log(employee);

		if (employee == undefined) {
			await logs.create({ level: "info", log: "No Record found for " + empID + name });
			return res.status(404).json({ status: "No Record found for " + empID + name});
		}
		else {
			var request = require('request');
			
			var updatedEmp = await EmployeeDetails.updateOne({empid:empID})
			.set({
				mortID:MortID, url: url
			});

			sails.log(updatedEmp);

			var request = require('request');
			request.post({
				url: url,
				body: updatedEmp,
				json: true 
			}, function (error, response, body) {
				sails.log(error);
				sails.log(body);
			});

			await logs.create({ level: "info", log: JSON.stringify(updatedEmp) });
			return res.status(200).json(updatedEmp);
		}
	},


}