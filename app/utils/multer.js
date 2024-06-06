const multer = require("multer");

const storageORG = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/organization/");
  },
  filename: function (req, file, cb) {
    const fieldName = file.fieldname;
    const ext = file.originalname.split(".").pop();
    const filename = Date.now() + `_${fieldName}.${ext}`;
    cb(null, filename);
  },
});
const storageVOL = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/volunteer/");
  },
  filename: function (req, file, cb) {
    const fieldName = file.fieldname;
    const ext = file.originalname.split(".").pop();
    const filename = Date.now() + `_${fieldName}.${ext}`;
    cb(null, filename);
  },
});
const uploadVOL = multer({ storage: storageVOL });
const uploadORG = multer({ storage: storageORG });
module.exports = { uploadORG, uploadVOL };
