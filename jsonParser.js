'use strict';

function MyJson() {

	this.eatTillComma = function(str) {
		let cnt = 0;
		let i = 0;
		for(i=0; i<str.length; i++) {
			if(str[i] == ",") {
				break;
			}
		}
		str = str.substr(i+1);
		return str;
	}

	this.getValueTillComma = function(str) {
		let newStr = "";
		let cnt = 0;
		for(var i=0; i<str.length; i++) {
			if(str[i] == "," || str[i] == "]" || str[i] == "}") {
				cnt = i;
				break;
			}
		}
		if(cnt > 0) {
			newStr = str.slice(0,cnt);
		}
		return newStr;
	}

	this.getStringTillValue = function(str, value) {
		let newStr = "";
		let cnt = 0;
		for(var i=0; i<str.length; i++) {
			if(str[i] == value) {
				cnt = i;
				break;
			}
		}
		if(cnt > 0) {
			newStr = str.slice(0,cnt);
		}
		return newStr;
	}

	this.findArrayEnd = function(str) {
		let bracesMatch = 0;
		let cnt = 0;
		for(var i=0; i < str.length; i++) {
			if(str[i] == "[") {
				bracesMatch++;
			} else if(str[i] == "]") {
				bracesMatch--;
				if(bracesMatch == 0) {
					cnt = i;
					break;
				}
			}
		}
		if(cnt > 0) {
			return str.slice(0,cnt+1);
		}
		return str;
	}

	this.findObjectEnd = function(str) {
		let bracesMatch = 0;
		let cnt = 0;
		for(var i=0; i < str.length; i++) {
			if(str[i] == "{") {
				bracesMatch++;
			} else if(str[i] == "}") {
				bracesMatch--;
				if(bracesMatch == 0) {
					cnt = i;
					break;
				}
			}
		}
		if(cnt > 0) {
			return str.slice(0,cnt+1);
		}
		return str;
	}

	this.parseString = function(str) {
		if(str[1] == "\"") {
			return "";
		}
		str = str.substr(1);
		let newStr = "";
		let j = 0;
		while(str[j] !== "\"") {
			newStr += str[j];
			j++;
			if(str[j] == "\\") {
				newStr += str[j++];
				newStr += str[j+1];
				j++;
			}
		}
		return newStr;
	}
};

MyJson.prototype.parseArray = function(str) {
	let obj = [];

	//check if object is empty
	if(str[1] == "]") return [];

	//remove first curly braces
	str = str.substr(1);

	//while closing of this object
	while(str[0]) {
		let value = "";
		if(str[0] == "[") {
			let arrStr = this.findArrayEnd(str);
			value = this.parseArray(arrStr);
			str = str.substr(arrStr.length);
		} else if(str[0] == "{") {
			let objStr = this.findObjectEnd(str);
			value = this.parseObject(objStr);
			str = str.substr(objStr.length);
		} else if(str[0] == "\"") {
			value = this.parseString(str);
		} else {
			value = this.getValueTillComma(str);
		} 
		obj.push(value);
		str = this.eatTillComma(str);
	}
	return obj;
}

MyJson.prototype.parse = function(str) {
	str = str.trim();
	let obj = {};
	if(str[0] == "{") {
		obj = this.parseObject(str);
	}
	if(str[0] == "[") {
		obj = this.parseArray(str);
	}
	return obj; 
}

MyJson.prototype.parseObject = function(str) {
	let obj = {};

	//check if object is empty
	if(str[1] == "}") return {};

	//remove first curly braces
	str = str.substr(1);

	//while closing of this object
	while(str[0]) {
		//get object first key
		let key = this.parseString(str);
		str = str.substr(key.length + 2);
		if(str[0] !== ":") {
			console.log("invalid json string line 43");
			return {};
		}

		//remove semi colon
		str = str.substr(1);
		let value = "";
		if(str[0] == "[") {
			let arrStr = this.findArrayEnd(str);
			value = this.parseArray(arrStr);
			str = str.substr(arrStr.length);
		} else if(str[0] == "{") {
			let objStr = this.findObjectEnd(str);
			value = this.parseObject(objStr);
			str = str.substr(objStr.length);
		} else if(str[0] == "\"") {
			value = this.parseString(str);
		} else {
			value = this.getValueTillComma(str);
		} 
		obj[key] = value;
		str = this.eatTillComma(str);
	}

	return obj;
};

module.exports = MyJson;

if(require.main === module) {
	(function(){
		let myJson = new MyJson();
		var obj = myJson.parse("{}");
		console.log(obj)
	})();
}