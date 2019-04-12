
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//定义一个 schema,描述 mydata 此集合里有哪些字段，字段是什么类型
//只有schema中有的属性才能被保存到数据库中
// unique 唯一的， 所以多次插入操作只会保存一条数据用户名相同的数据。

const articleSchema = new Schema({
  title: { type: String , default: ""},
  article_id: { type: String , default: ""},
});

const Article = mongoose.model('Article', articleSchema);

export default Article;