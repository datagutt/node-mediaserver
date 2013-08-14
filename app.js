var express = require('express'),
	xml2js = require('xml2js'),
	js2xml = require('js2xml'),
	builder = require('xmlbuilder'),
	os = require('os'),
	fs = require('fs'),
	_ = require('underscore'),
	app = express();

const VERSION = '0.9.7.28.33-f80a4a2';
var config = require('./config.js'),
	directories = [
		{
			count: 1,
			key: 'channels',
			title: 'channels'
		},
		{
			count: 1,
			key: 'clients',
			title: 'clients'
		},
		{
			count: 1,
			key: 'library',
			title: 'library'
		},
		{
			count: 1,
			key: 'music',
			title: 'music'
		},
		{
			count: 1,
			key: 'search',
			title: 'search'
		},
		{
			count: 1,
			key: 'servers',
			title: 'servers'
		},
		{
			count: 1,
			key: 'systen',
			title: 'system'
		},
		{
			count: 2,
			key: 'video',
			title: 'video'
		}
];

var logger = function(req, res, next) {
	console.log(req.originalUrl);
	next();
};

app.configure(function(){
	app.use(logger);
});
app.get('/', function(req, res){
	var root  = builder.create('MediaContainer');
	root.attributes = {
		size: 9,
		flashInstalled: 0,
		friendlyName: os.hostname(),
		machineIdentifer: 'abcdtest',
		myPlex: 0,
		platform: os.type() == 'Darwin' ? 'MacOSX' : os.type(),
		platformVersion: os.release(),
		requestParametersInCookie: 1,
		silverlightInstalled: 0,
		transcoderAudio: 0,
		transcoderVideo: 0,
		webkit: 1,
		owned: 'true',
		version: VERSION
	};
	_.each(directories, function(directory){
		root.ele('Directory', directory);
	})
	
	res.end(root.end({pretty: true}));
});

app.get('/clients', function(req, res){
	var root = builder.create('MediaContainer');
	root.attributes = req.header('X-Plex-Device') ? {
		size: 1,
		name: req.header('X-Plex-Device'),
		host: req.connection.remoteAddress,
		address: req.connection.remoteAddress,
		port: 32400,
		machineIdentifier: req.header('X-Plex-Client-Identifier'),
		version: req.header('X-Plex-Version'),
		protocol: 'plex',
		product: req.header('X-Plex-Product'),
		deviceClass: 'mobile'
	} : {};
	console.log(root.end({pretty: true}));
	
	res.end(root.end({pretty: true}));
});

app.get('/channels', function(req, res){
	var root = builder.create('MediaContainer');
	root.attributes = {
		size: 1
	};
	
	root.ele('Directory', {
		key: 'all',
		title: 'All'
	});
	
	res.end(root.end({pretty: true}));
});

app.get('/channels/all', function(req, res){
	var root = builder.create('MediaContainer');
	root.attributes = {
		size: 0
	};
	
	res.end(root.end({pretty: true}));
});

app.get('/library', function(req, res){
	var root = builder.create('MediaContainer');
	root.attributes = {
		size: 1,
		allowSync: 0,
		art: '/:/resources/library-art.png',
		identifier: 'com.plexapp.plugins.library',
		mediaTagPrefix: '/system/bundle/media/flags/',
		mediaTagVersion: '1370305901',
		title1: 'Plex Library'
	};

	root.ele('Directory', {
		key: 'sections',
		title: 'Library sections'
	});

	res.end(root.end({pretty: true}));
});

app.get('/library/recentlyAdded', function(req, res){
	var root = builder.create('MediaContainer');
	root.attributes = {
		size: 1,
		allowSync: 0,
		art: '/:/resources/library-art.png',
		identifier: 'com.plexapp.plugins.library',
		mediaTagPrefix: '/system/bundle/media/flags/',
		mediaTagVersion: '1370305901',
		mixedParents: 1
	};

	root.ele('Directory', {
		allowSync: 1,
		librarySectionId: 1,
		librarySectionUUID: 'abcdtest',
		ratingKey: 0,
		type: 'season',
		title: 'Season 7',
		parentTitle: 'Futurama',
		summary : '',
		index: 7,
		parentIndex: 1
	});

	res.end(root.end({pretty: true}));
});

app.get('/library/ondeck', function(req, res){
	var root = builder.create('MediaContainer');
	root.attributes = {
		size: 0,
		allowSync: 0,
		identifier: 'com.plexapp.plugins.library',
		mediaTagPrefix: '/system/bundle/media/flags/',
		mediaTagVersion: '1370305901',
		mixedParents: 1
	};

	res.end(root.end({pretty: true}));
});

app.get('/library/sections/1', function(req, res){
	var root = builder.create('MediaContainer');
	root.attributes = {
		size: 3,
		allowSync: 0,
		content: 'secondary',
		identifier: 'com.plexapp.plugins.library',
		mediaTagPrefix: '/system/bundle/media/flags/',
		mediaTagVersion: '1370305901',
		nocache: 1,
		agent: 'com.plexapp.agents.thetvdb',
		title1: 'TV Showws',
		viewGroup: 'secondary'
	};
	
	root.ele('Directory', {
		key: 'all',
		title: 'All Shows',
	});	
	root.ele('Directory', {
		key: 'recentlyAdded',
		title: 'Recently Added',
	});
	root.ele('Directory', {
		key: 'onDeck',
		title: 'On Deck',
	});
	
	res.end(root.end({pretty: true}));
});

app.get('/library/sections', function(req, res){
	var root = builder.create('MediaContainer');
	root.attributes = {
		size: 0,
		allowSync: 0,
		identifier: 'com.plexapp.plugins.library',
		mediaTagPrefix: '/system/bundle/media/flags/',
		mediaTagVersion: '1370305901',
		uuid: 'abcdtest',
		agent: 'com.plexapp.agents.thetvdb',
		title1: 'Plex Library',
		title2: ''
	};

	fs.stat(config.server.directory, function(err, stats) {
		if(err){
			throw err;
		}
		if(stats && stats.size){
			root.attributes.size = stats.size;

			root.ele('Directory', {
				art: '/:/resources/show-art.png',
				filters: 1,
				refreshing: 0,
				key: 1,
				type: 'show',
				title: 'TV Shows',
				agent: 'com.plexapp.agents.thetvdb',
				scanner: 'Plex Series Scanner',
				language: 'en'
			}).ele('Location', {
				path: config.server.directory
			});
			
			res.end(root.end({pretty: true}));
		}else{
			res.end(root.end({pretty: true}));
		}
	});
});

app.get('/system/players/:player/:controller/:command', function(req, res){
	var root  = builder.create('MediaContainer');
	
	res.end(root.end());
});

app.use(function(req, res, next){
	res.contentType('text/xml');
	next();
});

app.listen(config.server.port, function(){
	console.log('%s listening at %s', 'node-mediaserver','http://localhost:' + config.server.port);
});