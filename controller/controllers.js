const path = require('path');
const { users, logs } = require('../models/Schema.js');
var c = 1;
const index = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
};

const add = async(req, res) => {
    let name = req.body.username;
    let user = new users({ username: name });
    let result = await user.save();
    console.log(result);
    res.json({
        "username": result.username,
        "_id": result['_id']
    })
}

const view = async(req, res) => {
    let result = await users.find();
    res.send(result);
};

const addExercise = async(req, res) => {
    let id = req.params.id;
    try {
        let re = await users.findOne({
            _id: id
        });
        if (re) {
            let desc = req.body.description;
            let dur = req.body.duration;
            let date = req.body.date;
            if (desc == '') {
                res.writeHead(404, { 'content-type': 'text/plain' }).end('Path `description` is required');
            } else if (dur == '') {
                res.writeHead(404, { 'content-type': 'text/plain' }).end('Path `duration` is required');
            } else {
                if (date == '') {
                    let dt = new Date()
                    date = dt.toDateString();
                } else {
                    let dt = new Date(date)
                    date = dt.toDateString();
                }
                let result = await logs.findOne({
                    _id: id
                });
                var log = { duration: dur, description: desc, date: date };
                console.log(log);
                if (result) {
                    c = result.Log.length + 1;
                    result.count = c;
                    result.Log.push(log);
                    let r = await result.save();
                    console.log(r);
                    res.json({
                        username: r.username,
                        description: desc,
                        duration: dur,
                        date: date,
                        _id: id
                    });
                } else {
                    let l = new logs({
                        username: re.username,
                        _id: id,
                        count: c,
                        Log: log
                    });
                    let r = await l.save();
                    console.log(r);
                    res.json({
                        username: r.username,
                        description: desc,
                        duration: dur,
                        date: date,
                        _id: id
                    });
                }
            }
        } else {
            res.writeHead(404, { 'content-type': 'text/plain' }).end('Unknown userId');
        }
    } catch (e) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end(e);
    }

}

const viewLogs = async(req, res) => {
    let id = req.params.id;
    let from = req.query.from;
    let too = req.query.to;
    let limit = parseInt(req.query.limit);
    let tarr = [];
    try {
        let result = await logs.findOne({ _id: id });
        if (result) {
            if (limit) {
                let t = result.Log[0].date;
                let dt = new Date(t);
                let date = dt.toDateString();
                tarr = [{
                    "description": result.Log[0].description,
                    "duration": result.Log[0].duration,
                    "date": date
                }];
                if (limit <= result.count) {
                    for (i = 1; i < limit; i++) {
                        t = result.Log[i].date;
                        dt = new Date(t);
                        date = dt.toDateString();
                        let tO = { description: result.Log[i].description, duration: result.Log[i].duration, date: date };
                        tarr.push(tO);
                    }
                } else {
                    for (i = 1; i < result.count; i++) {
                        t = result.Log[i].date;
                        dt = new Date(t);
                        date = dt.toDateString();
                        let tO = { description: result.Log[i].description, duration: result.Log[i].duration, date: date };
                        tarr.push(tO);
                    }
                }
            } else if (from || too) {
                for (i = 0; i < result.count; i++) {
                    let fromDate = new Date(from);
                    let toDate = new Date(too);
                    if (result.Log[i].date.getTime() >= fromDate.getTime() && result.Log[i].date.getTime() <= toDate.getTime()) {
                        t = result.Log[i].date;
                        dt = new Date(t);
                        date = dt.toDateString();
                        let tO = { description: result.Log[i].description, duration: result.Log[i].duration, date: date };
                        tarr.push(tO);
                    }
                }
                if (limit) {
                    if (limit <= result.count) {
                        tarr = tarr.slice(0, limit);
                    }
                }
            } else {
                let t = result.Log[0].date;
                let dt = new Date(t);
                let date = dt.toDateString();
                tarr = [{
                    "description": result.Log[0].description,
                    "duration": result.Log[0].duration,
                    "date": date
                }];
                for (i = 1; i < result.count; i++) {
                    t = result.Log[i].date;
                    dt = new Date(t);
                    date = dt.toDateString();
                    let tO = { description: result.Log[i].description, duration: result.Log[i].duration, date: date };
                    tarr.push(tO);
                }
            }
            res.json({
                _id: result['_id'],
                username: result.username,
                count: tarr.length,
                log: tarr
            })
        } else {
            res.writeHead(404, { 'content-type': 'text/plain' }).end('Unknown userId');
        }
    } catch (e) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end(e);
    }
};

module.exports = { index, add, view, addExercise, viewLogs };