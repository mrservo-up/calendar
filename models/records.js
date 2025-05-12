const BaseModel = require('./base.js').BaseModel;

class MainRecords extends BaseModel {
    constructor() {
        super();
        this.age = null;
        this.first_day_of_mens = null;
        this.period_length = null;
        this.cycle_length = null;
    }
    
    tableName() {
        return "main_records";
    }
}

exports.MainRecords = MainRecords;
