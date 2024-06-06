const sendEmail = require("../utils/sendMail");
const Volunteer = require("./models/Volunteer");
const Role = require("./models/Role");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("./passport");
const Organization = require("./models/Organization");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const AuthCode = require("./models/AuthCode");
const { ROLES } = require("../_constants/Roles");

const generateRandomDigits = () => {
  const digit1 = Math.floor(Math.random() * 10);
  const digit2 = Math.floor(Math.random() * 10);
  const digit3 = Math.floor(Math.random() * 10);
  const digit4 = Math.floor(Math.random() * 10);

  const randomDigits = `${digit1}${digit2}${digit3}${digit4}`;

  return randomDigits;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const deleteAcc = async (req, res) => {
  const deletedUser = await req.Model.destroy({
    where: {
      email: req.user.email,
    },
  });

  if (deletedUser) {
    return res.status(200).json({ message: "Account deleted successfully" });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

const sendVerificationEmail = async (req, res) => {
  console.log(req.body);
  if (!isValidEmail(req.body.email)) return res.status(300).send({ message: "email is required" });
  const authCode = await AuthCode.findOne({
    where: { email: req.body.email },
    order: [["valid_till", "DESC"]],
  });
  if (authCode && new Date(authCode.valid_till).getTime() > Date.now()) {
    res.status(200).send({ message: "Auth code is already sent." });
  } else {
    const code = generateRandomDigits();
    const obj = AuthCode.create({
      email: req.body.email,
      code,
      valid_till: Date.now() + 120000,
    });
    const { error, message } = await sendEmail(req.body.email, "Auth code hh : ", code);
    if (error) {
      obj.destroy();
      return res.status(300).send({ error, message });
    } else return res.status(200).send({ code });
  }
};

const verifyCode = async (req, res) => {
  console.log(req.body);
  if (!req.body.email?.length || !req.body.role?.length || !req.body.code?.length) {
    return res.status(300).send({ message: "Bad Credentials" });
  }
  const authCode = await AuthCode.findOne({
    where: { email: req.body.email },
    order: [["valid_till", "DESC"]],
  });
  console.log(authCode);
  if (!authCode) {
    return res.status(300).send({ message: "Wrong auth code. 1" });
  } else if (new Date(authCode.valid_till).getTime() < Date.now()) {
    return res.status(300).send({ message: "Wrong auth code. 2" });
  } else if (authCode.code !== req.body.code) {
    return res.status(300).send({ message: "Wrong auth code. 3" });
  }

  const user = await req.Model.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(300).send({ message: "User not found." });
  await user.update({ isEmailVerified: true });
  await authCode.destroy();
  return res.status(200).end();
};

const verifyRegisterCode = async (req, res) => {
  console.log(req.body);
  if (!req.body.email?.length || !req.body.role?.length || !req.body.code?.length) {
    return res.status(300).send({ message: "Bad Credentials" });
  }
  const authCode = await AuthCode.findOne({
    where: { email: req.body.email },
    order: [["valid_till", "DESC"]],
  });
  console.log(authCode);
  if (!authCode) {
    return res.status(300).send({ message: "Wrong auth code. 1" });
  } else if (new Date(authCode.valid_till).getTime() < Date.now()) {
    return res.status(300).send({ message: "Wrong auth code. 2" });
  } else if (authCode.code !== req.body.code) {
    return res.status(300).send({ message: "Wrong auth code. 3" });
  }
  await authCode.destroy();
  return res.status(200).end();
};

const volSignUp = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const volunteer = await Volunteer.create({
    email: req.body.email,
    surname: req.body.surname,
    name: req.body.name,
    password: hashedPassword,
    phoneNumber: req.body.phoneNumber,
    about: req.body.about,
    birthday: req.body.birthday,
    isEmailVerified: true,
  });
  // return await sendVerificationEmail(req, res);

  return (res.status(200).send({ "success": true }));
};

const orgSignUp = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const organization = await Organization.create({
    orgType: req.body.orgType,
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    about: req.body.about,
    password: hashedPassword,
    isEmailVerified: true,
  });

  return (res.status(200).send({ "success": true }));
};

const signIn = async (req, res) => {
  if (!req.body.email?.length || !req.body.password?.length || !req.body.role?.length) {
    return res.status(300).send({ message: "Bad Credentials" });
  }
  const user = await req.Model.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(300).send({ message: "User email or password is incorrect" });
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) return res.status(300).send({ message: "User email or password is incorrect" });
  let code

  if (!user.isEmailVerified && req.body.role !== ROLES.moderator) code = sendVerificationEmail(req, res);
  else code = "Approved";

  const role = await Role.findOne({ where: { name: req.body.role } });

  if (req.body.role !== ROLES.moderator) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: { id: role.id, name: role.name },
      },
      jwtOptions.secretOrKey,
      {
        expiresIn: 60 * 60,
      }

    );
    return (res.status(200).send({ role: role.name, roleId: role.id, token, code, user }));
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: { id: role.id, name: role.name },
    },
    jwtOptions.secretOrKey,
    {
      expiresIn: 30 * 24 * 60 * 60,
    }
  );
  return res.status(200).send({ token, user });
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ message: "Error during logout", error: err });
    }
    res.status(200).send({ message: "Logout successful" });
  });
};

const updateOrg = async (req, res) => {
  try {
    const organizationId = req.user.id;
    const orgDetails = {
      orgType: req.body.orgType,
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      about: req.body.about,
    };

    const organization = await Organization.findByPk(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }
    for (const key in req.files) {
      const oldFilePath = organization[key];
      if (oldFilePath) {
        fs.unlinkSync(path.join(__dirname, "..", "..", oldFilePath));
      }
      const currentFilePath = req.files[key][0].path;
      const newFolderPath = path.join("public", "organization", organizationId.toString());
      const newFilePath = path.join(newFolderPath, organizationId + "_" + req.files[key][0].filename);

      fs.mkdirSync(newFolderPath, { recursive: true });
      fs.renameSync(currentFilePath, newFilePath);
      orgDetails[key] = `/organization/${organizationId}/${organizationId}_${req.files[key][0].filename}`;
    }
    await organization.update(orgDetails);
    return res.status(200).json({ message: "Organization updated successfully." });
  } catch (error) {
    console.error("Error updating organization:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateVol = async (req, res) => {
  try {
    const { email, surname, name, about, phoneNumber, birthday } = req.body;
    const volunteer = await Volunteer.findByPk(req.user.id);
    if (!volunteer) {
      return res.status(404).send({ message: "Volunteer not found." });
    }
    const volDetails = { email, surname, name, about, phoneNumber, birthday };

    for (const fileType of ["imageURL", "frontCardView", "backCardView", "selfie"]) {
      if (req.files[fileType]) {
        const oldFilePath = volunteer[fileType];
        if (oldFilePath) {
          fs.unlinkSync(path.join(__dirname, "..", "..", "public", oldFilePath)); // Путь к файлу в базе должен быть относительным
        }
        const currentFilePath = req.files[fileType][0].path;
        const newFolderPath = path.join("public", "volunteer", volunteer.id.toString());
        const newFilePath = path.join(newFolderPath, volunteer.id + "_" + req.files[fileType][0].filename);

        fs.mkdirSync(newFolderPath, { recursive: true });
        fs.renameSync(currentFilePath, newFilePath);
        volDetails[
          fileType
          ] = `/volunteer/${volunteer.id}/${volunteer.id}_${req.files[fileType][0].filename}`;
      }
    }
    await volunteer.update(volDetails);

    return res.status(200).json({ message: "Volunteer updated successfully" });
  } catch (error) {
    console.error("Error updating volunteer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user;
    if (role.name === ROLES.volunteer) {
      user = await Volunteer.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
    } else if (role.name === ROLES.organization) {
      user = await Organization.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
    } else {
      return res.status(400).send({ message: "Invalid user role" });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyCode,
  verifyRegisterCode,
  orgSignUp,
  volSignUp,
  signIn,
  deleteAcc,
  updateOrg,
  updateVol,
  logout,
  getUserInfo,
};
