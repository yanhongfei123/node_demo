
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//定义一个 schema,描述 mydata 此集合里有哪些字段，字段是什么类型
//只有schema中有的属性才能被保存到数据库中
// unique 唯一的， 所以多次插入操作只会保存一条数据用户名相同的数据。

const userSchema = new Schema({
	user_id: Number,
  username: { type: String ,default: ""},
  password:{ type: String, default: "" },
  registe_time: { type: String, default: "" },
  articles: { type: Schema.Types.ObjectId, ref: 'Article' } //定义类型为objectid ,ref是关联的模型名称
  //createTime: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;