"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.v2.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            }
            else {
                reject(error);
            }
        });
        streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
    });
};
const upload = (req, res, next) => {
    if (req.file) {
        const uploadAsync = (req) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield streamUpload(req);
                console.log(result.secure_url);
                req.body[req.file.fieldname] = result.secure_url;
                next();
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: "Failed to upload image" });
            }
        });
        uploadAsync(req);
    }
    else {
        next();
    }
};
exports.upload = upload;
