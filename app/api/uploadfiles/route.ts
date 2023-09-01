import { NextApiHandler } from 'next';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle the file upload
const uploadMiddleware = (handler: NextApiHandler) => async (req: any, res: any) => {
  await new Promise<void>((resolve, reject) => {
    upload.array('files', 10)(req, res, (err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
  handler(req, res);
};

// Define the API route handler
const handler: NextApiHandler = async (req, res) => {
  try {
    const colabScriptUrl =
      'https://colab.research.google.com/drive/1zmCw4yqf_IIpGvCGaJN353I-oq29FMlZ#scrollTo=mJDswR4_efZF';

    const files = req.body as Express.Multer.File[]; // Use req.files
    console.log(files)
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file.buffer, { filename: file.originalname, contentType: file.mimetype });
    });

    const response = await axios.post(colabScriptUrl, formData, {
      headers: {
        ...req.headers,
        'Content-Type': 'multipart/form-data',
      },
    });

    res.status(200).json({ message: 'Files uploaded and sent to Colab script.' });
  } catch (error) {
    console.error('Error uploading and sending files:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};

export default uploadMiddleware(handler);
