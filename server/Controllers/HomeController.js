const RequestService = require('../Services/RequestService');

exports.Index = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    return res.json({ reqInfo:reqInfo });
};

exports.Other = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    return res.json({ reqInfo:reqInfo });
};
