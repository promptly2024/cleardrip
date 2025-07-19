// File: backend/src/utils/uploadToCloudinary.ts
import { MultipartFile } from "@fastify/multipart";
import cloudinary from "./cloudinary";

const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

type UploadOptions = {
    folder: string;
    filenamePrefix?: string;
    files: MultipartFile[];
};

type UploadResult = {
    filename: string;
    mimetype: string;
    size: number;
    url: string;
};

export async function uploadToCloudinary({ files, folder, filenamePrefix = "" }: UploadOptions): Promise<UploadResult[]> {
    const uploads: UploadResult[] = [];

    for (const file of files) {
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error(`Unsupported file type: ${file.mimetype}`);
        }

        if (file.file.bytesRead > MAX_SIZE) {
            throw new Error(`File size exceeds 5MB: ${file.filename}`);
        }

        const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';

        const publicId = `${filenamePrefix}_${Date.now()}_${file.filename}_${Math.random().toString(36).substring(2, 8)}`;

        const url = await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder,
                    public_id: publicId
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result.secure_url);
                }
            );

            file.file.pipe(uploadStream);
        });

        uploads.push({
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.file.bytesRead,
            url,
        });
    }

    return uploads;
}