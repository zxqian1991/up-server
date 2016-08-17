module.exports = {
	name: "qianzhixiang",
	routers: {
		qzx: './ada/asdasd',
		xad: "./asd/qff"
	},
	before: {
		"before-test1": "./before/before-test1.js",
		"before-test2": "./before/before-test2.js"
	},
	after: {
		"after-test1": "./after/after-test1.js",
		"after-test2": "./after/after-test2.js"
	},
	hosts: {
		"default":{
			before: {
				default: ['before-test2'],
				private: {
					"/test23": "before-test2"
				}
			}
		},
		"localhost": {
			"80": {
				static: "./test"
			},
			"90": {
				static: "./test/test2"
			}
		},
		"127.0.0.1": {
			"80": {
				static: "./test/test2"
			}
		}
	}
}