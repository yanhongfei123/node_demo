'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
	avatar: {type: String, default: 'default.jpg'},
	user_id: Number,
	cartList: Array,
	orderList: [{
			"productId": Number,
			"productNum": Number,
	  }],
	column_desc: {
		productId: {type: Number, default: 1},
		game_desc: {type: String, default: '玩游戏领红包'},
		game_is_show: {type: Number, default: 1},
		gift_mall_desc: {type: String, default: '0元好物在这里'},
	},
});

userInfoSchema.index({id: 1});


const UserInfo = mongoose.model('UserInfo', userInfoSchema);

export default UserInfo