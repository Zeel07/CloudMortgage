module.exports = {
  attributes: {

    name: { type: 'string' },
    MlsID:{ type: 'number'},
    mortValue: { type: 'number'},

    //Employer Responses
    salary: { type: 'number' },
    lengthOfEmployment: { type: 'number' },
    mortID: { type: 'number'},
    
    //Insc Responses
    insuredValue: {type: 'number'},
    deductibleValue: {type: 'number'},

    //Status
    status: {type: 'string', defaultsTo: 'WaitingForEmployeeDetails'}
  },
};