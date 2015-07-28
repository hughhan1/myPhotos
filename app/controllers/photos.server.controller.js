var fs = require('fs');
var path = require('path');
var url = require('url');
var imgDir = '/public/img/';

var Photo = require('mongoose').model('Photo');

exports.create = function(req, res, next) { 
    var photo = new Photo(req.body);
    photo.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(photo);
        }
    });
};

exports.list = function(req, res, next) {
    Photo.find({}, function(err, photos) {
        if (err) {
            return next(err);
        }
        else {
            res.json(photos);
            // res.render('photos', {
            //     title: 'My Portfolio',
            //     photos: photos
            // });
        }
    });
};

exports.read = function(req, res) {
    res.json(req.photo);
};

exports.photoByID = function(req, res, next, id) {
    Photo.findOne({
            _id: id
        }, 
        function(err, photo) {
            if (err) {
                return next(err);
            }
            else {
                req.photo = photo;
                next();
            }
        }
    );
};

exports.update = function(req, res, next) {
    Photo.findByIdAndUpdate(req.photo.id, req.body, function(err, photo) {
        if (err) {
            return next(err);
        }
        else {
            res.json(photo);
        }
    });
};

exports.delete = function(req, res, next) {
    req.photo.remove(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(req.photo);
        }
    })
};

//get the list of jpg files in the image dir
function getImages(imgDir, callback) {
    var fileTypes = ['.jpg', 'png'];
    var files = [];
    fs.readdir(imgDir, function (err, list) {
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < fileTypes.length; j++) {
                if (path.extname(list[i]) === fileTypes[j]) {
                    files.push(list[i]); //store the file name into the array files
                    break;
                }
            }
        }
        callback(err, files);
    });
}