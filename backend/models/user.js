const mongoose = require("mongoose");


function UserSchema() {
    const UserSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
    });
    const Users = mongoose.model("Users", UserSchema);
    return Users;
}

export default UserSchema;
