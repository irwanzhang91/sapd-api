exports.checkSelectResult = (results) => {
    let result = false;
    let msg = 'No Data.';
    if(results.length > 0){
        result = true;
        msg = 'Showing data.';
    }

    results = {
        result: result,
        data: results,
        length: results.length,
        msg: msg
    };
    return results;
};

exports.checkInsertResult = (results) => {
    let result = false;
    if(results > 0){
        result = true;
    }

    results = {
        result: result,
        msg: 'Insert success.',
        insertId: results
    };

    return results;
}

exports.checkUpdateResult = (results) => {
    let result = false;
    if(results > 0){
        result = true;
    }

    results = {
        result: result,
        msg: 'Update success.'
    }

    return results;
};

exports.checkDeleteResult = (results) => {
    let result = false;
    if(results > 0){
        result = true;
    }

    results = {
        result: result,
        msg: 'Delete success.'
    };

    return results;
}

exports.cantDeleteRecord = (msg) => {
    return {
        result: false,
        msg: msg
    };
}
