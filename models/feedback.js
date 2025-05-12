const BaseModel = require('./base.js').BaseModel;

class Feedback extends BaseModel {
    constructor() {
        super();
        this.willing_to_try = null;
        this.another_method = null;
        this.others = null;
    }
    
    tableName() {
        return "feedback_records";
    }
}

exports.Feedback = Feedback;
