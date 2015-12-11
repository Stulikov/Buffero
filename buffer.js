function push(data) {
	if (DEBUG) console.log("Push message called with data: " + data);
}
function read() {
	if (DEBUG) console.log("Read called");
}

exports.push = push;
exports.read = read;