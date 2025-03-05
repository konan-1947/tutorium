const multer = require('multer');
const { google } = require('googleapis');
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load credentials từ file JSON
const KEYFILEPATH = path.join(__dirname, '../config/credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

// Folder ID trên Google Drive
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Multer middleware
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToDrive = async (file) => {
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const response = await drive.files.create({
        requestBody: {
            name: file.originalname,
            parents: [FOLDER_ID], // Lưu vào thư mục đã chia sẻ
        },
        media: {
            mimeType: file.mimetype,
            body: bufferStream,
        },
    });

    const fileId = response.data.id;
     // Đặt quyền công khai cho file
     await drive.permissions.create({
        fileId: fileId,
        requestBody: {
            role: "reader",
            type: "anyone",
        },
    });

    return response.data.id; // Trả về fileId
};
const  deleteFromDrive = async (fileId) => {
    try {
        await drive.files.delete({ fileId });
        console.log(`🗑️  Đã xóa file trên Google Drive: ${fileId}`);
        return true;
    } catch (error) {
        console.error(`❌ Lỗi khi upload ảnh lên Drive:`, error.response?.data || error.message);
        return false;
    }
};

module.exports = { upload, uploadToDrive, deleteFromDrive };


