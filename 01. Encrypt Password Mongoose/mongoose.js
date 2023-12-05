const bcrypt = require('bcrypt'); // Yêu Cầu: npm i bcrypt
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
});

// Mã Hoá Mật Khẩu Trước Khi Thực Hiên Insert Hoặc Update Vào Database
UserSchema.pre('save', async function (next) {
    // Nếu Password không được thay đổi sẽ không làm gì
    if (!this.isModified('password')) return next();
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
