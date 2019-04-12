'use strict';

import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema({
	user_id: Number,
	img_id: Number,
	sku_id: Number, 
	admin_id: Number,
  statis_id: Number,
  article_id: Number
});

const Ids = mongoose.model('Ids', idsSchema);

Ids.findOne((err, data) => {
	if (!data) {
    new Ids({
      user_id: 10,
      img_id: 0,
      sku_id: 0, 
      admin_id: 0,
      statis_id: 0,
      article_id: 0      
    }).save();
    // Ids.create({
    //   user_id: 0,
    //   img_id: 0,
    //   sku_id: 0, 
    //   admin_id: 0,
    //   statis_id: 0,
    //   article_id: 0
    // });
	}
});

export default Ids