const http = require("http");
const cors = require('cors');
//var XMLHttpRequest = require("xhr2");
const fs = require('fs').promises;
const formidable = require('formidable');
const path = require('path');

const host = '0.0.0.0';
const port = '8000';

const backEndString = process.env.MVSE_BACK_END_HOST;
const archiveDict = process.env.MVSE_ARCHIVE_DICT || "{}";
console.log(backEndString);
const backEndHost = backEndString.split(':')[0];
const backEndPort = parseInt(backEndString.split(':')[1]);

const mvseTempImageFiles = path.join(path.join(path.join(process.env.MVSE_LOCAL_SHARED_ROOT, "mvse_shared"), "image"), "files");
const mvseTempVideoFiles = path.join(path.join(path.join(process.env.MVSE_LOCAL_SHARED_ROOT, "mvse_shared"), "video"), "files");
const mvseFrontEndRootPrefix = process.env.MVSE_LOCAL_SHARED_ROOT;

const express = require('express');

const app = express();


const getIndex = function (req, res) {
	fs.readFile(path.join(__dirname, 'dist', 'mvse-front-1.0', 'index.html'))
		.then(contents => {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end(contents);
		})
		.catch(err => {
			res.writeHead(500);
			res.end(err);
			return;
		});
};

const forwardPost = function (client_req, client_res) {
	console.log('serve: ' + client_req.url + " to " + backEndHost);

	var options = {
		hostname: backEndHost,
		port: backEndPort,
		path: client_req.url,
		method: client_req.method,
		headers: client_req.headers
	};

	var proxy = http.request(options, function (res) {
		client_res.writeHead(res.statusCode, res.headers)
		res.pipe(client_res, {
			end: true
		});
	});

	client_req.pipe(proxy, {
		end: true
	});
}


const forwardFilename = function (command, filename, server_result) {


	var options = {
		hostname: backEndHost,
		port: backEndPort,
		path: command,
		method: "POST",
	};

	var proxy = http.request(options, function (res) {
		console.log("sent");
		res.pipe(server_result, { end: true });
	});

	var to_send = { "name": filename };
	console.log(backEndHost);
	console.log(backEndPort);
	console.log(JSON.stringify(to_send));

	proxy.end(JSON.stringify(to_send));


}

const forwardFilenames = function (command, filenames, server_result) {


	var options = {
		hostname: backEndHost,
		port: backEndPort,
		path: command,
		method: "POST",
	};

	var proxy = http.request(options, function (res) {
		console.log("sent");
		res.pipe(server_result, { end: true });
	});

	var to_send = { "names": filenames };

	console.log("point A");
	console.log(JSON.stringify(to_send));

	proxy.end(JSON.stringify(to_send));


}
const forwardFilenames2 = function (command, filenames, keywords, server_result) {


	var options = {
		hostname: backEndHost,
		port: backEndPort,
		path: command,
		method: "POST",
	};

	var proxy = http.request(options, function (res) {
		console.log("sent");
		res.pipe(server_result, { end: true });
	});

	var to_send = { "names": filenames, "keywords": keywords };

	console.log("point AA");
	console.log(JSON.stringify(to_send));

	proxy.end(JSON.stringify(to_send));


}

const forwardFilenamesV2 = function (command, facenames, audionames, scenenames, objectnames, soundeventnames, eventnames, keywords, server_result) {


	var options = {
		hostname: backEndHost,
		port: backEndPort,
		path: command,
		method: "POST",
	};

	var proxy = http.request(options, function (res) {
		console.log("sent");
		res.pipe(server_result, { end: true });
	});

	var to_send = { "facenames": facenames, "scenenames": scenenames, "audionames": audionames, "objectnames": objectnames, "soundeventfiles": soundeventnames , "eventnames": eventnames, "keywords": keywords };

	console.log("send query to backend V2");
	console.log(JSON.stringify(to_send));

	proxy.end(JSON.stringify(to_send));


}

const saveFile = function (uploadDir, uploadCommand, req, res) {
	console.log("save file");
	console.log(uploadDir);
	console.log("dir");
	console.log(mvseTempImageFiles);
	var form = new formidable.IncomingForm();

	form.uploadDir = uploadDir;
	form.parse(req, function (err, fields, files) {
		if (err) console.log(err);
		var oldpath = files.file.filepath;
		forwardFilename(uploadCommand, files.file.newFilename, res);





	});

}

const saveFiles = function (uploadDir, uploadCommand, req, res) {
	console.log("save files");
	console.log(uploadDir);
	var form = new formidable.IncomingForm();
	var files = [];
	var fields = [];
	var filenames = [];
	var keywords = [];
	var endReceived = false;

	form.uploadDir = uploadDir;
	console.log(form);
	form.on('field', function (field, value) {
		console.log("field ====?  " + field);
		if (field == "filename") {
			filenames.push(path.basename(value));
		}
		if (field == "keywords") {
			console.log("keywords value is  " + path.basename(value));
			keywords.push(value);
		}
	});

	form.on('file', function (field, file) {
		console.log("length " + files.length);
		files.push(file);
	});
	form.on('end', function () {
		if (!endReceived) // bug in node.js, sometimes end is sent twice
		{
			endReceived = true;
			console.log('done');
			for (let i = 0; i < files.length; i++) {
				console.log(files[i].newFilename);
				filenames.push(files[i].newFilename);
			}

			forwardFilenames2(uploadCommand, filenames, keywords, res);
		}
	});
	form.parse(req);

}

const saveFilesV2 = function (uploadDir, uploadCommand, req, res) {
	console.log("save files");
	console.log(uploadDir);
	var form = new formidable.IncomingForm();

	var files = [];
	var facenames = [];

	var audionames = [];

	var scenenames = [];

	var objectnames = [];

	var keywords = [];

	var soundeventfiles = [];

	var eventnames = [];

	var endReceived = false;

	form.uploadDir = uploadDir;
	console.log(form);
	form.on('field', function (field, value) {
		console.log("field ====?  " + field);
		if (field == "objectnames") {
			console.log("objectnames value is  " + path.basename(value));
			objectnames.push(value);
		}
		else if (field == "facenames") {
			console.log("facenames value is  " + path.basename(value));
			facenames.push(value);
		}
		else if (field == "audionames") {
			console.log("audionames value is  " + path.basename(value));
			audionames.push(value);
		}
		else if(field == "soundeventfiles"){
			console.log("soundevent filename " + path.basename(value));
			soundeventfiles.push(value);
		}

		else if(field == "eventnames"){
			console.log("event name is " + path.basename(value));
			eventnames.push(value);
		}

		else if(field == "eventnames"){
			//
		}
		else if (field == "scenenames") {
			console.log("scenenames value is  " + path.basename(value));
			scenenames.push(value);
		}
		else if (field == "keywords") {
			console.log("keywords value is  " + path.basename(value));
			keywords.push(value);
		}
	});

	form.on('file', function (field, file) {

		console.log("event comming ");

		console.log(file)

		console.log("oldname " + file.originalFilename);
		console.log("newname " + file.newFilename);
		files.push(file);
	});
	form.on('end', function () {
		if (!endReceived) // bug in node.js, sometimes end is sent twice
		{
			endReceived = true;
			console.log('all send done');
			var n_facenames = [];//new face file name 
			var n_audionames = [];//new audo file name 
			var n_scenenames = [];// new scene file name 
			var n_objectnames = [];// new object file name
			var n_soundeventnames = [];

			for (let i = 0; i < files.length; i++)// check witch modal this file belong to, and record the new file name 
			{
				console.log(files[i].newFilename);
				var oldname = files[i].originalFilename;
				console.log("old name====== " + oldname);
				if (objectnames.includes(oldname)) {
					objectnames = objectnames.filter(item => item !== oldname);
					n_objectnames.push(files[i].newFilename);
				}
				else if (audionames.includes(oldname)) {
					audionames = audionames.filter(item => item !== oldname);
					n_audionames.push(files[i].newFilename);
				}
				else if (scenenames.includes(oldname)) {
					scenenames = scenenames.filter(item => item !== oldname);
					n_scenenames.push(files[i].newFilename);
				}
				else if (facenames.includes(oldname)) {
					facenames = facenames.filter(item => item !== oldname);
					n_facenames.push(files[i].newFilename);
				}
				else if(soundeventfiles.includes(oldname)){
					soundeventfiles = soundeventfiles.filter(item => item !== oldname);
					n_soundeventnames.push(files[i].newFilename);
				}
			}
			// if there are some filename do not in files, it means that this name is just a name from the server, not the file upload by browser
			if (facenames.length > 0) {
				n_facenames = n_facenames.concat(facenames);
			}
			if (objectnames.length > 0) {
				n_objectnames = n_objectnames.concat(objectnames);
			}
			if (audionames.length > 0) {
				n_audionames = n_audionames.concat(audionames);
			}
			if (scenenames.length > 0) {
				n_scenenames = n_scenenames.concat(scenenames);
			}
			if (n_soundeventnames.length > 0){
				n_soundeventnames = n_soundeventnames.concat(soundeventfiles);
			}
			console.log("Sound event files: " + n_soundeventnames);
			//function (command, facenames,audionames,scenenames,objectnames,keywords,server_result)
			forwardFilenamesV2(uploadCommand, n_facenames, n_audionames, n_scenenames, n_objectnames, n_soundeventnames, eventnames, keywords, res);
		}
	});
	form.parse(req);

}

const requestListener = function (req, res) {
	console.log("Inside request listener");
	if (req.url.startsWith("/mvse_shared")) {
		let contentType = "application/data";
		if (req.url.endsWith("jpg"))
			contentType = "image/jpg";
		else if (req.url.endsWith("mp4"))
			contentType = "video/mp4";

		console.log(req.url);


		fs.readFile(mvseFrontEndRootPrefix + req.url)
			.then(contents => {
				res.setHeader("Content-Type", contentType);
				res.writeHead(200);
				res.end(contents);
			}).catch(err => {
				// res.writeHead(500);
				// res.end("Failed to read");
				// res.end(err) is causing UI container crash
				// res.end(err);
				console.log(err);
				return "/image-failed.png";
			});

		// fs.readFile(mvseFrontEndRootPrefix + req.url)
		// 	.then(contents => {
		// 		res.setHeader("Content-Type", contentType);
		// 		res.writeHead(200);
		// 		res.end(contents);
		// 	})
		// 	.catch(err => {
		// 		// Handle the error
		// 		console.error(err);

		// 		// Return a static image in case of an error
		// 		const staticImagePath = '/image-load-failed.png';

		// 		// Read the static image and send it as a response
		// 		fs.readFile(staticImagePath, (staticImageErr, staticImageContents) => {
		// 			if (staticImageErr) {
		// 				// res.writeHead(500);
		// 				// console.log("Failed to read static image");
		// 				// res.end("Failed to read static image");
		// 				return;
		// 			} else {
		// 				res.setHeader("Content-Type", "image/png"); // Set the content type for the image
		// 				res.writeHead(200);
		// 				res.end(staticImageContents);
		// 			}
		// 		});
		// 	});
		return;
	}
	else if (req.method == "POST" && req.url.startsWith("/upload_search_image")) {
		saveFile(mvseTempImageFiles, "/upload_search_image", req, res);
		return true;
	}
	else if (req.method == "POST" && req.url.startsWith("/upload_search_video")) {
		saveFile(mvseTempVideoFiles, "/upload_search_video", req, res);
		return true;
	}
	else if (req.method == "POST" && req.url.endsWith("/analyse_video")) {
		saveFile(mvseTempVideoFiles, "/analyse_video", req, res);
		return true;
	}
	else if (req.method == "POST" && req.url.startsWith("/upload_image_search_video")) {
		saveFile(mvseTempImageFiles, "/upload_image_search_video", req, res);
		return true;
	}
	else if (req.method == "POST" && req.url.endsWith("/multi_modals_search_video_V2")) {
		saveFilesV2(mvseTempImageFiles, "/multi_modals_search_video_V2", req, res);
		return true;
	}
	else if (req.method == "POST" && req.url.endsWith("/multi_modals_search_video_new")) {
		console.log("Inside node from angular app!!");
		saveFiles(mvseTempImageFiles, "/multi_modals_search_video_new", req, res);
		return true;
	}
	else if (req.method == "POST" && req.url.startsWith("/multi_modals_search_video")) {
		saveFiles(mvseTempImageFiles, "/multi_modals_search_video", req, res);
		return true;
	}
	else if (req.method == "GET" && req.url.endsWith("/archive_dict")) {
		console.log("Inside node from angular app!!");
		console.log(archiveDict);
		res.writeHead(200);
		res.end(JSON.stringify(archiveDict));
		return true;
	}
	else {
		console.log("Index function of node!!");
		getIndex(req, res);
		return;
	}
};

app.use(express.static(path.join(__dirname, 'dist', 'mvse-front-1.0')));
app.use(cors());

app.use(requestListener);
// const server = http.createServer(requestListener);
app.listen(port, host, () => {
	console.log(`Server is really running on http://${host}:${port}`);
});

