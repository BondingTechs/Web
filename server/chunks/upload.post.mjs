import { defineEventHandler, callNodeListener } from 'h3';
import { r as request } from './nitro/node-server.mjs';
import FormData from 'form-data';
import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'klona';
import 'defu';
import 'ohash';
import 'ufo';
import 'unstorage';
import 'unstorage/drivers/fs';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'axios';
import 'http-graceful-shutdown';

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
  const targetWidth = 800;
  const targetHeight = 600;
  try {
    await sharp(inputImagePath).resize(targetWidth, targetHeight).toFile(outputFilePath);
    console.log("\u538B\u7F29\u540E\u7684\u56FE\u7247\u5DF2\u4FDD\u5B58\u5230:", outputFilePath);
    return outputFilePath;
  } catch (error) {
    console.error("\u56FE\u7247\u538B\u7F29\u5931\u8D25:", error);
    return "";
  }
}

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
