module.exports = {
  attributes: {
    name : { type: 'string', required: true},
    MlsID : { type: 'number', required: true},
    appraisedAmount: { type: 'number'},
    MortID: {type: 'number', required: true},
    insuredValue: {type: 'number'},
    deductibleValue: {type: 'number'}
  },
};