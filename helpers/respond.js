const debug = require('debug')('sso:router')
/*
data: Sets the data to be returned
message: overrides data, applied when code >= 400
code: sets the status code
direct: if true, it won't create the response object and instead send what was received in 'data' directly
logging: if false, it won't log to console
meta_extra: everything here will be put in the response.meta property
*/
const respond = (res, { data = null, message = 'Undefined error', code = 200, direct = false, logging = true, meta = false, meta_extra = {} }) => {
    let response = { "status": code };

    if (!direct) {

        if (code < 400) {
            response.data = data;

            if (meta && response.data && response.data[response.data.length-1] && !response.data[response.data.length-1].id) {
                    response.meta = {
                        count: Array.isArray(response.data) ? response.data.length : response.data ? 1 : 0,
                        ...meta_extra
                    };
            }
            
        } else {
            response.error = message;
        }
        
    } else {
        
        response = data;
        
    }

    if (logging) {
        debug(`Responded: ${JSON.stringify(response)}`);
    }

    res.status(code).send(response);
};

module.exports = respond;