import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import Ids from '../../models/id';
import qiniu from 'qiniu';
import fetch from 'node-fetch';
var superagent = require('superagent');
qiniu.conf.ACCESS_KEY = 'g0fRA4-B7oOVe6SB0PXEimS3m0_inKqCB4d5GKBq';
qiniu.conf.SECRET_KEY = 'G1xh0SqRBefPWPJuSW93hBdQO6cddZ8CUtK5vDuL';

export default class BaseComponent {
	constructor() {
		this.uploadImg = this.uploadImg.bind(this);
		this.tencentkey = 'RLHBZ-WMPRP-Q3JDS-V2IQA-JNRFH-EJBHL';
	}

	async fetch(url = '', data = {}, type = 'GET', resType = 'JSON'){
		type = type.toUpperCase();
		resType = resType.toUpperCase();
		if (type == 'GET') {
			let dataStr = ''; //数据拼接字符串
			Object.keys(data).forEach(key => {
				dataStr += key + '=' + data[key] + '&';
			})

			if (dataStr !== '') {
				dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
				url = url + '?' + dataStr;
			}
		}

		let requestConfig = {
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}

		if (type == 'POST') {
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}
		let responseJson;
		try {
			const response = await fetch(url, requestConfig);
			if (resType === 'TEXT') {
				responseJson = await response.text();
			}else{
				responseJson = await response.json();
			}
		} catch (err) {
			console.log('获取http数据失败', err);
			throw new Error(err)
		}
		return responseJson
	}	
	//获取id列表
  getId(type) {
		return new Promise(async (resolve, reject) => {
			try {
				const idData = await Ids.findOne();
				idData[type]++;
				await idData.save();
				resolve(idData[type])
			} catch (err) {
				console.log('获取ID数据失败');
				reject('获取ID数据失败');
			}
		});
	}
	// async uploadImg(req, res, next) {
	// 	const {
	// 		des,
	// 		base64Data
	// 	} = req.body;
	// 	var fileName = Date.now() + '.png';
	// 	// 构建图片路径 需要在上一层目录下新建一个image
	// 	var filePath =  path.resolve(__dirname, '../../public/images/' + fileName);
	// 	// 过滤data:URL
	// 	var base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
	// 	var dataBuffer = new Buffer(base64, 'base64');
	// 	fs.writeFile(filePath, dataBuffer, function (err) {
	// 		if (err) {
	// 			console.log(err)
	// 			// 写入失败
	// 			res.send({
	// 				status: '0',
	// 				msg: '文件写入失败'
	// 			});
	// 		} else {
	// 			res.send({
	// 				status: '1',
	// 				data: fileName,
	// 				msg: 'ok'
	// 			});
	// 		}
	// 	})
	// }

	async uploadImg(req, res, next) {
		try {
			//const image_path = await this.qiniu(req);
			const image_path = await this.getPath(req, res);
			res.send({
				status: 1,
				image_path,
			})
		} catch (err) {
			console.log('上传失败', err);
			res.send({
				status: 0,
				type: 'ERROR_UPLOAD_IMG',
				message: '上传失败'
			})
		}
	}

	async getPath(req, res) {
		return new Promise((resolve, reject) => {
			const form = formidable.IncomingForm();
			form.uploadDir = './public/images';
			form.parse(req, async (err, fields, files) => {
				console.log(files.file.path) // 上传后的图片所在的文件路径
				let img_id;
				try {
					img_id = await this.getId('img_id');
				} catch (err) {
					console.log('获取图片id失败');
					fs.unlinkSync(files.file.path);
					reject('获取图片id失败');
				}
				const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + img_id;
				const extname = path.extname(files.file.name);
				if (!['.jpg', '.jpeg', '.png'].includes(extname)) {
					fs.unlinkSync(files.file.path);
					res.send({
						status: 0,
						type: 'ERROR_EXTNAME',
						message: '文件格式错误'
					})
					reject('上传失败');
					return
				}
				const fullName = hashName + extname;
				const repath = './public/images/' + fullName;
				try {
					fs.renameSync(files.file.path, repath);
					resolve(fullName)
					// gm(repath)
					// 	.resize(200, 200, "!")
					// 	.write(repath, async (err) => {
					// 		if (err) {
					// 			console.log('裁切图片失败鸟!');
					// 			reject('裁切图片失败');
					// 			return
					// 		}
					// 		resolve(fullName)
					// 	})
				} catch (err) {
					console.log('保存图片失败llll', err);
					if (fs.existsSync(repath)) {
						fs.unlinkSync(repath);
					} else {
						fs.unlinkSync(files.file.path);
					}
					reject('保存图片失败lala')
				}
			});
		})
	}

	async qiniu(req, type = 'default') {
		return new Promise((resolve, reject) => {
			const form = formidable.IncomingForm();
			form.uploadDir = './public/images';
			form.parse(req, async (err, fields, files) => {
				let img_id;
				try {
					img_id = await this.getId('img_id');
				} catch (err) {
					console.log('获取图片id失败');
					fs.unlinkSync(files.file.path);
					reject('获取图片id失败');
				}
				const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + img_id;
				const extname = path.extname(files.file.name);
				const repath = './public/images/' + hashName + extname;
				try {
					const key = hashName + extname;
					await fs.rename(files.file.path, repath);
					const token = this.uptoken('node_demo', key);
					const qiniuImg = await this.uploadFile(token.toString(), key, repath);
					fs.unlinkSync(repath);
					resolve(qiniuImg)
				} catch (err) {
					console.log('保存至七牛失败', err);
					fs.unlinkSync(files.file.path)
					reject('保存至七牛失败')
				}
			});

		})
	}

	uptoken(bucket, key) {
		var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
		return putPolicy.token();
	}

	uploadFile(uptoken, key, localFile) {
		return new Promise((resolve, reject) => {
			var extra = new qiniu.io.PutExtra();
			qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
				if (!err) {
					resolve(ret.key)
				} else {
					console.log('图片上传至七牛失败', err);
					reject(err)
				}
			});

		})
	}

	//获取定位地址
	async guessPosition(req){
		return new Promise(async (resolve, reject) => {
			let ip;
	 		if (process.env.NODE_ENV == 'development') {
	 			ip = '210.21.237.99';
	 		}
	 		try{
				 let result = await superagent.get('http://apis.map.qq.com/ws/location/v1/ip').query({ip, key: this.tencentkey});
				result = JSON.parse(result.text);
		 		if (result.status == 0) {
		 			const cityInfo = {
		 				lat: result.result.location.lat,
		 				lng: result.result.location.lng,
		 				city: result.result.ad_info.city,
		 			}
		 			cityInfo.city = cityInfo.city.replace(/市$/, '');
		 			resolve(cityInfo)
		 		}else{
		 			console.log('定位失败', result)
		 			reject('定位失败');
		 		}
	 		}catch(err){
	 			reject(err);
	 		}
		})
	}	

}

