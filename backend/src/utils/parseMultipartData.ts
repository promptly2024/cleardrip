// utils/parseMultipartData.ts
import { FastifyRequest } from "fastify";
import { MultipartFile, MultipartValue } from "@fastify/multipart";

export const parseMultipartData = async (req: FastifyRequest) => {
    console.log('Parsing multipart data...')
    const parts = req.parts();
    const fields: Record<string, any> = {};
    const files: MultipartFile[] = [];

    for await (const part of parts) {
        if ('file' in part && part.file) {
            console.log(`Received file: ${part.filename}`);
            files.push(part as MultipartFile);
        } else {
            console.log(`Received field: ${part.fieldname}`);
            const fieldPart = part as MultipartValue;
            fields[part.fieldname] = fieldPart.value;
        }
    }
    console.log('Finished parsing multipart data.');
    console.log(`Parsed fields: ${JSON.stringify(fields)}`);
    console.log(`Parsed files: ${JSON.stringify(files)}`);
    console.log(`Parsed file lengths: ${files.length}`);
    return { fields, files };
};
