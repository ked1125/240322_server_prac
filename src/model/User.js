const mongoose = require("mongoose");
// // mongoose에서 Schema작성할 때 Schema, model -> 이렇게 두가지를 잘 신경써줘야 함!
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
        required: true,
      },
    },
    age: Number,
    email: String,
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
// // mongoose에서 Schema작성할 때 Schema, model -> 이렇게 두가지를 잘 신경써줘야 함!
module.exports = { User };
// module.exports작업도 누락되기 쉬우므로 꼭 신경쓸 것!
