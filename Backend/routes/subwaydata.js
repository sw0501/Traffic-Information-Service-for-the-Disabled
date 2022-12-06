﻿const serviceKey = require('../Key/serviceKey.json');
const router = require('express').Router();
const request = require('request');
const convert = require('xml-js');

const SQL_info = require('../Key/SQL_info.json')
const mysql = require('mysql');

const conn = {
	host: SQL_info.host,
	port: SQL_info.port,
	user: SQL_info.user,
	password: SQL_info.password,
	database: SQL_info.database
};

let connection = mysql.createConnection(conn);  // DB Connect

//SubwayStation Name List from DB
function getSubwayStationName(stNm, callback){
	try {

		let sql = "Select *  FROM stationinfotest WHERE StNm like ?; ";

		let NameList = [];
		connection.query(sql, ["%"+stNm+"%"], function (err, results, fields) {
			if (err) {
				console.log(err);
			}
			for (let i = 0; i < results.length; i++) {
				if (results[i].LnNm[results[i].LnNm.length - 2] == "호") {
					results[i].LnNm = results[i].LnCd;
				}
				NameList.push({
					railCd: results[i].RailCd,
					lnCd: results[i].LnCd,
					lnNm: results[i].LnNm,
					stCd: results[i].StCd,
					stNm: results[i].StNm
				})
			}

			callback(NameList);
		});
		
	}
	catch (e) {
		console.error(e);
		callback(e);
	}
}

function getSubwayStationInfo(stCd, stNm, callback) {
	try {

		let sql = "Select * FROM stationinfotest WHERE StCd = ? and StNm = ?;";

		connection.query(sql, [stCd, stNm], function (err, results, fields) {
			if (err) {
				console.log(err);
			}

			console.log(results);

			const url = 'https://openapi.kric.go.kr/openapi/convenientInfo/stationInfo';
			let queryParams = '?' + encodeURI('serviceKey');
			queryParams += '=' + serviceKey.subwayRailKey;
			queryParams += '&' + encodeURI('format') + '=' + encodeURI('json');
			queryParams += '&' + encodeURI('railOprIsttCd');
			queryParams += '=' + encodeURI(results[0].RailCd);
			queryParams += '&' + encodeURI('lnCd');
			queryParams += '=' + encodeURI(results[0].LnCd);
			queryParams += '&' + encodeURI('stinCd');
			queryParams += '=' + encodeURI(results[0].StCd);
			queryParams += '&' + encodeURI('stinNm');
			queryParams += '=' + encodeURI(results[0].StNm);
			
			return request({
				url: url + queryParams,
				method: 'GET'
			}, function (error, response, body) {

				console.log(body);

				const stationinfo = JSON.parse(body).body[0];

				callback({
					railCd: stationinfo.railOprIsttCd,
					lnCd: stationinfo.lnCd,
					stCd: stationinfo.stinCd,
					stNm: stationinfo.stinNm,
					roadNm: stationinfo.roadNmAdr,
					tmX: stationinfo.stinLocLon,
					tmY: stationinfo.stinLocLat,
				});
					//tNum:
					//wNum:
			});
			

		});

	}
	catch (e) {
		console.error(e);
		callback(e);
	}
}

function getLiftPos(stCd, stNm, railCd, lnCd, callback) {
	try {

		const url = 'https://openapi.kric.go.kr/openapi/vulnerableUserInfo/stationWheelchairLiftLocation';
		let queryParams = '?' + encodeURI('serviceKey') + '=' + serviceKey.subwayRailKey;
		queryParams += '&' + encodeURI('format') + '=' + encodeURI('json');
		queryParams += '&' + encodeURI('railOprIsttCd') + '=' + encodeURI(railCd);
		queryParams += '&' + encodeURI('lnCd') + '=' + encodeURI(lnCd);
		queryParams += '&' + encodeURI('stinCd') + '=' + encodeURI(stCd);

		console.log(url + queryParams);

		return request({
			url: url + queryParams,
			method: 'GET'
		}, function (error, response, body) {

			liftPosInfo = JSON.parse(body).body;

			console.log(liftPosInfo[0]);

			callback(liftPosInfo[0]);


			//tNum:
			//wNum:
		});

	}
	catch {
		console.error(e);
		callback(e);
	}
}

function getLiftMove(stCd, stNm, railCd, lnCd, callback) {
	try {

		console.log("LiftMove");
		//console.log(stNm);

		const url = 'https://openapi.kric.go.kr/openapi/vulnerableUserInfo/stationWheelchairLiftMovement';
		let queryParams = '?' + encodeURIComponent('serviceKey');
		queryParams += '=' + serviceKey.subwayRailKey;
		queryParams += '&' + encodeURIComponent('format') + '=' + encodeURIComponent('json');
		queryParams += '&' + encodeURIComponent('railOprIsttCd') + '=' + encodeURIComponent(railCd);
		queryParams += '&' + encodeURIComponent('lnCd') + '=' + encodeURIComponent(lnCd);
		queryParams += '&' + encodeURIComponent('stinCd') + '=' + encodeURIComponent(stCd);

		console.log(url + queryParams);

		return request({
			url: url + queryParams,
			method: 'GET'
		}, function (error, response, body) {

			liftMoveInfo = JSON.parse(body).body;
			console.log(liftMoveInfo.length);
			callback(liftMoveInfo);
		});
	}
	catch (e) {
		console.error(e);
		callback(e);
	}
}

function getElevatorPos(stCd, stNm, railCd, lnCd, callback) {
	try {
		console.log(stNm);

		const url = 'https://openapi.kric.go.kr/openapi/convenientInfo/stationElevator';

		let queryParams = '?' + encodeURIComponent('serviceKey');
		queryParams += '=' + serviceKey.subwayRailKey;
		queryParams += '&' + encodeURIComponent('format') + '=' + encodeURIComponent('json');
		queryParams += '&' + encodeURIComponent('railOprIsttCd') + '=' + encodeURIComponent(railCd);
		queryParams += '&' + encodeURIComponent('lnCd') + '=' + encodeURIComponent(lnCd);
		queryParams += '&' + encodeURIComponent('stinCd') + '=' + encodeURIComponent(stCd);

		console.log(url + queryParams);

		return request({
			url: url + queryParams,
			method: 'GET'
		}, function (error, response, body) {
			ElevatorPosInfo = JSON.parse(body).body;
			callback(ElevatorPosInfo);
		});
	}
	catch (e) {
		console.error(e);
		callback(e);
	}
}


function getElevatorMove(stCd, stNm, railCd, lnCd, callback) {
	try {

		console.log(stNm);
		
		const url = 'https://openapi.kric.go.kr/openapi/trafficWeekInfo/stinElevatorMovement';
		let queryParams = '?' + encodeURIComponent('serviceKey');
		queryParams += '=' + serviceKey.subwayRailKey;
		queryParams += '&' + encodeURIComponent('format') + '=' + encodeURIComponent('json');
		queryParams += '&' + encodeURIComponent('railOprIsttCd') + '=' + encodeURIComponent(railCd);
		queryParams += '&' + encodeURIComponent('lnCd') + '=' + encodeURIComponent(lnCd);
		queryParams += '&' + encodeURIComponent('stinCd') + '=' + encodeURIComponent(stCd);

		console.log(url + queryParams);

		return request({
			url: url + queryParams,
			method: 'GET'
		}, function (error, response, body) {
			JSON.parse(body).body;
			callback(JSON.parse(body).body);
		});
	}
	catch (e) {
		console.error(e);
		callback(e);
	}
}


function getTransfer(stCd, stNm, railCd, lnCd, callback) {
	try {

		console.log(stNm);

		//환승역 검색을 통해서 찾아야함
		//환승역 여러 개인 경우 선택할지 아니면 다 보여줄 지

		const url = 'https://openapi.kric.go.kr/openapi/vulnerableUserInfo/transferMovement';
		let queryParams = '?' + encodeURIComponent('serviceKey');
		queryParams += '=' + serviceKey.subwayRailKey;
		queryParams += '&' + encodeURIComponent('format') + '=' + encodeURIComponent('json');
		queryParams += '&' + encodeURIComponent('railOprIsttCd') + '=' + encodeURIComponent(railCd);
		queryParams += '&' + encodeURIComponent('lnCd') + '=' + encodeURIComponent(lnCd);
		queryParams += '&' + encodeURIComponent('stinCd') + '=' + encodeURIComponent(stCd);
		queryParams += '&' + encodeURIComponent('prevStinCd') + '=' + encodeURIComponent(stCd);
		queryParams += '&' + encodeURIComponent('chthTgtLn') + '=' + encodeURIComponent(stCd);
		queryParams += '&' + encodeURIComponent('chtnNextStinCd') + '=' + encodeURIComponent(stCd);

		console.log(url + queryParams);

		return request({
			url: url + queryParams,
			method: 'GET'
		}, function (error, response, body) {
			console.log(body);
			callback(body);
		});
	}
	catch (e) {
		console.error(e);
		callback(e);
	}
}

function getConvenience(stCd, stNm, railCd, lnCd, callback) {
	try {

		console.log(stNm);

		const url = 'https://openapi.kric.go.kr/openapi/vulnerableUserInfo/stationWheelchairLiftMovement';
		let queryParams = '?' + encodeURIComponent('serviceKey');
		queryParams += '=' + serviceKey.subwayRailKey;
		queryParams += '&' + encodeURIComponent('format') + '=' + encodeURIComponent('json');
		queryParams += '&' + encodeURIComponent('railOprIsttCd') + '=' + encodeURIComponent(railCd);
		queryParams += '&' + encodeURIComponent('lnCd') + '=' + encodeURIComponent(lnCd);
		queryParams += '&' + encodeURIComponent('stinCd') + '=' + encodeURIComponent(stCd);

		console.log(url + queryParams);

		return request({
			url: url + queryParams,
			method: 'GET'
		}, function (error, response, body) {
			console.log(body);
			callback(body);
		});
	}
	catch (e) {
		console.error(e);
		callback(e);
	}
}

router.get('/stNm/:stNm', async (req, res) => {
	try {

		stNm = req.params.stNm;

		await getSubwayStationName(stNm, stationList => {
			if (stationList == 0) {
				return res.status(404).json({
					error: "No Station"
				})
			}
			else {
				console.log(stationList);
				return res.json(
					stationList,
				)
			}

		});
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({
			error: e,
			errorString: e.toString(),
		})
	}
})

router.get('/stationInfo/:stCd/:stNm', async (req, res) => {
	try {

		stCd = req.params.stCd;
		stNm = req.params.stNm;

		await getSubwayStationInfo(stCd, stNm, stationinfo => {
			//console.log(stationinfo.tmY);
			return res.json({
				stationinfo
			})
		})
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({
			error: e,
			errorString: e.toString(),
		})
	}
})

router.get('/liftPos/:stCd/:stNm/:railCd/:lnCd', async (req, res) => {
	try {
		stCd = req.params.stCd;
		stNm = req.params.stNm;
		railCd = req.params.railCd;
		lnCd = req.params.lnCd;

		await getLiftPos(stCd, stNm, railCd, lnCd, liftPosInfo => {
			//console.log(callback);

			return res.json({
				"railOprIsttCd": liftPosInfo.railOprIsttCd,
				"lnCd": liftPosInfo.lnCd,
				"stinCd": liftPosInfo.stinCd,
				"exitNo": liftPosInfo.exitNo,
				"dtlLoc": liftPosInfo.dtlLoc,
				"grndDvNmFr": liftPosInfo.grndDvNmFr,
				"runStinFlorFr": liftPosInfo.runStinFlorFr,
				"grndDvNmTo": liftPosInfo.grndDvNmTo,
				"runStinFlorTo": liftPosInfo.runStinFlorTo,
				"len": liftPosInfo.len,
				"wd": liftPosInfo.wd,
				"bndWgt": liftPosInfo.bndWgt
			});
		})

		
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({
			error: e,
			errorString: e.toString(),
		})
	}
})

router.get('/liftMove/:stCd/:stNm/:railCd/:lnCd', async (req, res) => {
	console.log("liftMove");
	try {
		stCd = req.params.stCd;
		stNm = req.params.stNm;
		railCd = req.params.railCd;
		lnCd = req.params.lnCd;

		await getLiftMove(stCd, stNm, railCd, lnCd, callback => {
			//console.log(callback);
			return res.json(callback);
		});
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({
			error: e,
			errorString: e.toString(),
		})
	}
})

router.get('/ElevatorPos/:stCd/:stNm/:railCd/:lnCd', async (req, res) => {
	try {
		stCd = req.params.stCd;
		stNm = req.params.stNm;
		railCd = req.params.railCd;
		lnCd = req.params.lnCd;

		await getElevatorPos(stCd, stNm, railCd, lnCd, callback => {
			console.log(callback);
			return res.json(callback)
		});
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({
			error: e,
			errorString: e.toString(),
		})
	}
})

router.get('/ElevatorMove/:stCd/:stNm/:railCd/:lnCd', async (req, res) => {
	try {
		stCd = req.params.stCd;
		stNm = req.params.stNm;
		railCd = req.params.railCd;
		lnCd = req.params.lnCd;

		await getElevatorMove(stCd, stNm, railCd, lnCd, callback => {
			console.log(callback);
			return res.json({
				callback
			})
		});
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({
			error: e,
			errorString: e.toString(),
		})
	}
})


router.get('/transferMove/:stCd/:stNm/:railCd/:lnCd', async (req, res) => {
	try {
		stCd = req.params.stCd;
		stNm = req.params.stNm;
		railCd = req.params.railCd;
		lnCd = req.params.lnCd;

		await getTranferMove(stCd, stNm, railCd, lnCd, callback => {
			console.log(callback);
			return res.json({
				callback
			})
		});
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({
			error: e,
			errorString: e.toString(),
		})
	}
});


router.get('/convenience/:stCd/:stNm/:railCd/:lnCd', async (req, res) => {
	try {
		stCd = req.params.stCd;
		stNm = req.params.stNm;
		railCd = req.params.railCd;
		lnCd = req.params.lnCd;

		return res.json({

		})
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({
			error: e,
			errorString: e.toString(),
		})
	}
});

router.get('/nevigation', async (req, res) => {
	try {
		return res.json({

		})
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({
			error: e,
			errorString: e.toString(),
		})
	}
});

module.exports = router;