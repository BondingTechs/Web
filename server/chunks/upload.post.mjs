import { d as defineEventHandler, b as callNodeListener, a as request } from './nitro/node-server.mjs';
import FormData from 'form-data';
import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

function uuid() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++)
    s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
  s[14] = "4";
  s[19] = hexDigits.substr(s[19] & 3 | 8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

const uploadService = () => {
  const folderPath = "./";
  const { limits: templateLimits } = {
    limits: {
      files: 1,
      fieldNameSize: 400,
      fileSize: 80 * 1024 * 1024
    }
  };
  const { filename } = {
    filename: (_req, file, cb) => {
      const name = `${uuid()}.${file.mimetype.split("/").pop()}`;
      cb(null, name);
    }
  };
  const destination = () => {
    const { destination: destination2 } = {
      destination: (_req, _file, cb) => {
        cb(null, folderPath);
      }
    };
    return destination2;
  };
  const generateHandler = (itemType, fileType) => {
    if (!fileType || fileType !== "document" && fileType !== "icon" && fileType !== "image")
      throw new Error("File type error.");
    if (!itemType || itemType !== "assortment" && itemType !== "carousel" && itemType !== "catalog")
      throw new Error("Item type error.");
    const options = {
      limits: {
        ...templateLimits
      },
      storage: multer.diskStorage({
        filename,
        destination: destination()
      })
    };
    return multer(options).single("file");
  };
  return { generateHandler };
};

const upload_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  try {
    const handler = uploadService().generateHandler("carousel", "image");
    await callNodeListener(handler, event.req, event.res);
    const formData = new FormData();
    const fileName = uuid();
    const fileType = (_a = event == null ? void 0 : event.req) == null ? void 0 : _a.file.originalname.split(".").pop();
    const minifyPath = await minify((_b = event == null ? void 0 : event.req) == null ? void 0 : _b.file.filename);
    formData.append("file", fs.createReadStream(minifyPath));
    formData.append("key", `${fileName}.${fileType}`);
    const data = await request.post("/comm/upload", formData, {
      headers: formData.getHeaders()
    });
    fs.unlink((_c = event == null ? void 0 : event.req) == null ? void 0 : _c.file.path, () => {
    });
    fs.unlink(minifyPath, () => {
    });
    return { error: false, code: 1e3, message: "\u4E0A\u50B3\u6210\u529F", data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});
async function minify(inputImagePath) {
  const outputFilePath = `minify_${inputImagePath}`;
  const targetWidth = 1024;
  const targetHeight = 1024;
  try {
    await sharp(inputImagePath).resize(targetWidth, targetHeight).toFile(outputFilePath);
    console.log("\u58D3\u7E2E\u5F8C\u7684\u5716\u7247\u5DF2\u4FDD\u5B58\u5230:", outputFilePath);
    return outputFilePath;
  } catch (error) {
    console.error("\u5716\u7247\u58D3\u7E2E\u5931\u6557:", error);
    return "";
  }
}

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
