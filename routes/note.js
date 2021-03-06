var db = require('../db/dbaccess');
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var dbname = 'ShopDB';

var colName = 'note';

var handleError = function(res, msg, err){
    res.send({Error : {text:msg, det:err}});
}

exports.list = function (req, res){
    db.setDB(dbname);
    var filter = db.getFilter(req.body);
    console.log("consumer filter: ", filter);
    db.load(colName, filter, function(err, recs){
        if (err !== null){
            handleError(res, "Cannot list note ", err);
        }
        else{
            res.send(recs);
        }
    });
}


exports.save = function(req, res){
    db.setDB(dbname);
    var vid = req.body;
    var filter = {};
    if (vid._id !== null && vid._id !== undefined){
        filter._id = new ObjectID(vid._id);
        vid._id = filter._id;


    db.upsert(colName, vid, filter, function(err, newid){
        if (err !== null){
            handleError(res, "Cannot add note ", err);
        }
        else{
            res.send(vid);
        }
    });
    }
    else{
        createNote(vid, res);
    }
}

exports.sendError = function(user, subject, text, attach, sender, callback){
    var note = buildNote(user, subject, text, attach, sender, 'info');
    notify(note, callback);
}

exports.sendInfo = function(user, subject, text, attach, sender, callback){
    var note = buildNote(user, subject, text, attach, sender, 'error');
    notify(note, callback);
}



function createNote(cons, res){
    db.insert(colName, cons, function(err, rec){
        if (err !== null){
            handleError(res, "Cannot add note ", err);
        }
        else{
            res.send(rec);
        }
    })
}

exports.delete = function(req, res){
    db.setDB(dbname);
    var vid = req.body;
    var pid = new ObjectID(vid._id);
    var filter = {_id : pid};
    db.delete(colName, filter, function(err, ret){
        if (err !== null){
            handleError(res, "Cannot delete note ", err);
        }
        else{
            res.send(pid);
        }
    });
}

function buildNote (user, subject, text, attach, sender, type){
    var n = {};
    n.toID = user.uid;
    n.toName = user.fname + ' ' + user.lname;
    n.status = 'new';
    n.createdTime = new Date();
    n.subject = subject;
    n.message = text;
    n.type = type;
    n.fileLink = attach;
    if (attach !== undefined){
        n.template = 'linkmsg.html';
    }
    n.senderID = sender.id;
    n.senderName = sender.name;
}

function notify(note, callback){
    db.insert(colName, note, function(err, rec){
        if (callback !== undefined){
            if (err !== null){
                callback(err, null);
            }
            else{
                callback(null, rec);
            }
        }
    })

}




