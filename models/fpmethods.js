const BaseModel = require('./base.js').BaseModel;

class FPMethods extends BaseModel {
    constructor() {
        super();
        this.description = null;
    }
    
    tableName() {
        return "lib_fp_methods";
    }
}

exports.FPMethods = FPMethods;
