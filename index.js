'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var interpolate = require('lodash._reinterpolate');
var template = _.template;

module.exports = function (data, options) {
    if (!options.allowEsInterpolate) {
        _.templateSettings.interpolate = options.interpolate || interpolate; // change default interpolate behaving.
    }
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-template', 'Streaming not supported'));
			return cb();
		}

		try {
			file.contents = new Buffer(template(file.contents.toString(), options)(data));
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-template', err, {fileName: file.path}));
		}

		this.push(file);
		cb();
	});
};
