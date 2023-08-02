const http = require("http");
//var XMLHttpRequest = require("xhr2");
const fs = require('fs').promises;
const formidable = require('formidable');
const path = require('path');

const host = '0.0.0.0';
const port = '8000';

const backEndString = process.env.MVSE_BACK_END_HOST;
console.log(backEndString);
const backEndHost = backEndString.split(':')[0];
const backEndPort = parseInt (backEndString.split(':')[1]);

const mvseTempImageFiles = path.join (path.join( path.join (process.env.MVSE_LOCAL_SHARED_ROOT,"mvse_shared"), "image"), "files");
const mvseTempVideoFiles = path.join (path.join( path.join (process.env.MVSE_LOCAL_SHARED_ROOT,"mvse_shared"), "video"), "files");
const mvseFrontEndRootPrefix = process.env.MVSE_LOCAL_SHARED_ROOT;

const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'dist', 'mvse-front-1.0')));


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

const forwardPost = function (client_req, client_res)
{
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


const forwardFilename = function (command, filename, server_result)
{
	

  var options = {
    hostname: backEndHost,
    port: backEndPort,
    path: command,
    method: "POST",
  };

  var proxy = http.request(options, function (res) {
   console.log ("sent");
   res.pipe(server_result, { end: true});
		});

	var to_send = { "name": filename };
	console.log (backEndHost);
	console.log (backEndPort);
	console.log(JSON.stringify(to_send));
	
	proxy.end(JSON.stringify(to_send));
	

}

const forwardFilenames = function (command, filenames, server_result)
{
	

  var options = {
    hostname: backEndHost,
    port: backEndPort,
    path: command,
    method: "POST",
  };

  var proxy = http.request(options, function (res) {
   console.log ("sent");
   res.pipe(server_result, { end: true});
		});

	var to_send = { "names": filenames };
	
	console.log ("point A");
	console.log(JSON.stringify(to_send));
	
	proxy.end(JSON.stringify(to_send));
	

}
const forwardFilenames2 = function (command, filenames, keywords,server_result)
{
	

  var options = {
    hostname: backEndHost,
    port: backEndPort,
    path: command,
    method: "POST",
  };

  var proxy = http.request(options, function (res) {
   console.log ("sent");
   res.pipe(server_result, { end: true});
		});

	var to_send = { "names": filenames,"keywords":keywords };
	
	console.log ("point AA");
	console.log(JSON.stringify(to_send));
	
	proxy.end(JSON.stringify(to_send));
	

}

const saveFile = function (uploadDir, uploadCommand, req, res)
{
    console.log("save file");
	console.log (uploadDir);
console.log ("dir");
console.log (mvseTempImageFiles);
	var form = new formidable.IncomingForm();

	form.uploadDir = uploadDir;
	form.parse(req, function (err, fields, files) {
						if (err) console.log(err);
						var oldpath = files.file.filepath;
						forwardFilename (uploadCommand, files.file.newFilename,res);
						
						


		
	});

}

const saveFiles = function (uploadDir, uploadCommand, req, res)
{
    console.log("save files");
	console.log (uploadDir);
	var form = new formidable.IncomingForm();
	var files = [];
	var fields = [];
	var filenames = [];
	var keywords=[];
	var endReceived = false;

	form.uploadDir = uploadDir;
	console.log (form);
	form.on('field', function(field, value) {
		console.log ("field ====?  " + field);
        if (field == "filename")
		{
			filenames.push(path.basename(value));
		}
		      if (field == "keywords")
		{
			console.log ("keywords value is  " + path.basename(value));
			keywords.push(value);
		}
    });
    
    form.on('file', function(field, file) {
		console.log ("length " + files.length);
 		files.push(file);
    });
    form.on('end', function() {
		if (!endReceived) // bug in node.js, sometimes end is sent twice
		{
			endReceived = true;
			console.log('done');
			for (let i=0; i < files.length; i++)
			{
				console.log (files[i].newFilename);
				filenames.push (files[i].newFilename);
			}

			forwardFilenames2 (uploadCommand, filenames,keywords,res);
		}
   });
 	form.parse(req);

}

const requestListener = function (req, res)
	{
		if (req.url.startsWith ("/mvse_shared"))
		{
			let contentType = "application/data";
			if (req.url.endsWith ("jpg"))
				contentType = "image/jpg";
			else if (req.url.endsWith("mp4"))
				contentType = "video/mp4";
			
			
			fs.readFile(mvseFrontEndRootPrefix + req.url)
			.then(contents =>
			{
				res.setHeader("Content-Type",contentType);
				res.writeHead(200);
				res.end(contents);
			}).catch(err =>
			{
				res.writeHead(500);
				res.end(err);
				return;
			});
			return;
		}
		else if (req.method == "POST" && req.url.startsWith ("/upload_search_image"))
		{
			saveFile (mvseTempImageFiles, "/upload_search_image", req,res);
			return true;
		}
		else if (req.method == "POST" && req.url.startsWith ("/upload_search_video"))
		{
			saveFile (mvseTempVideoFiles, "/upload_search_video", req,res);
			return true;
		}
		else if (req.method == "POST" && req.url.startsWith ("/analyse_video"))
		{
			saveFile (mvseTempVideoFiles, "/analyse_video", req,res);
			return true;
		}
		else if (req.method == "POST" && req.url.startsWith ("/upload_image_search_video"))
		{
			saveFile (mvseTempImageFiles, "/upload_image_search_video", req,res);
			return true;
		}
		else if (req.method == "POST" && req.url.startsWith ("/multi_modals_search_video_new"))
		{
			saveFiles (mvseTempImageFiles, "/multi_modals_search_video_new", req,res);
			return true;
		}
		else if (req.method == "POST" && req.url.startsWith ("/multi_modals_search_video"))
		{
			saveFiles (mvseTempImageFiles, "/multi_modals_search_video", req,res);
			return true;
		}
		else
		{
			getIndex (req, res);
			return;
		}
	};

app.use(requestListener);
// const server = http.createServer(requestListener);
app.listen(port, host, () =>
	{
		console.log(`Server is really running on http://${host}:${port}`);
	});
	
