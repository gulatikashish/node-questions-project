const User = require('./user');
const findAll = async () => {
  let allUsers = await User.find();
  return allUsers;
};
const findOneByEmail = async email => {
  let data = await User.findOne({ email: email });
  return data;
};
const findOneById = async id => {
  let data = await User.findById(id);
  return data;
};
const validEmailPassword = async (email, password) => {
  let data = await User.findOne({
    email,
    password,
  });
  return data;
};
const insert = async (name, email, password) => {
  return  await User.create({
    name,
    email,
    password,
  });
};
const updatePassword = async (id, password) => {
  let data = await User.findOneAndUpdate({ _id: id }, { password: password }, { new: true });
  return data;
};
module.exports = {
  findAll,
  findOneByEmail,
  findOneById,
  insert,
  validEmailPassword,
  updatePassword,
};
