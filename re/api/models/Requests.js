module.exports = {
  attributes: {
    name : { type: 'string', required: true},
    MlsID : { type: 'number', required: true},
    appraisedAmount: { type: 'number'},
    MortID: {type: 'number', required: true},
    status: {type: 'string', defaultsTo: "pending"}
  },
};