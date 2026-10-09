db = {
    kv: () => {
        return {
            put: async (key, v) => {this[key] = v; return true},
            get: async (key) => {
                if(this[key] == undefined) return JSON.stringify({status: false})
                else return JSON.stringify({v: this[key]})
            }
        }
    }
}

const vmRequired = {}
const fs = require('fs');
const files = fs.readdirSync(__dirname+'/serverless/code/');

files.map(f => vmRequired[f.split('.js')[0]] = require(__dirname+'/serverless/code/'+f.split('.js')[0]))

vm = (bundleID) => {
    return vmRequired[bundleID]
}
