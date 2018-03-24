const https = require('https');
const http = require('http');

function printError(err) {
	console.error(err.message);
}

function printMessage(username, badgeCount, points) {
	const message = `${username} has ${badgeCount} total badges and ${points} points in JavaScript courses`;
	console.log(message);
}

function getProfile(username) {
	try {
		const request = https.get(`https://teamtreehouse.com/${username}.json`, (res) => {
			if (res.statusCode === 200) {
				let body = '';

				// Attaching a 'data' event listener to a stream that has not been explicitly paused will switch the stream into flowing mode.
				// Data will then be passed as soon as it is available.
				res.on('data', (data) => {
					body += data.toString();
				});

				// The 'end' event is emitted when there is no more data to be consumed from the stream.
				res.on('end', () => {
					try {
						const profile = JSON.parse(body);
						printMessage(username, profile.badges.length, profile.points.JavaScript);
					} catch (err) {
						console.error('Profile is not found. Error: ' + err.message);
					}
				});
			} else {
				const errMessage = `There was an error getting the profile for the ${username} profile. The status code is: ${res.statusCode} - ${http.STATUS_CODES[res.statusCode]}`;
				//console.error(errMessage);
				const err = new Error(errMessage);
				printError(err);
			}
		});
		request.on('error', err => console.error(`Problem with request: ${err.message}`));
	} catch (err) {
		printError(err);
	}
}

module.exports.getProfile = getProfile;
