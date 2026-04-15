import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File as FormidableFile } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

// simple storage (replace with DB in real apps)
let currentFilePath: string | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = formidable({
        multiples: false,
        keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "File Parsing error" });
        }

        const uploadedFile = files.file;

        let fileObj: FormidableFile | undefined;

        if (Array.isArray(uploadedFile)) {
            fileObj = uploadedFile[0];
        } else {
            fileObj = uploadedFile as FormidableFile | undefined;
        }

        if (!fileObj) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const uploadDir = path.join(process.cwd(), "uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // Keeping new file name along with path
        const newFileName = `${Date.now()}-${fileObj.originalFilename}`;
        const newFilePath = path.join(uploadDir, newFileName);

        try {
            // 🔥 STEP 1: DELETE OLD FILE (REPLACE LOGIC)
            if (currentFilePath && fs.existsSync(currentFilePath)) {
                fs.unlinkSync(currentFilePath);
            }

            // 🔥 STEP 2: MOVE NEW FILE FROM TEMP TO PERMANENT
            fs.copyFileSync(fileObj.filepath, newFilePath);

            // optional: delete temp file
            fs.unlinkSync(fileObj.filepath);

            // 🔥 STEP 3: update current file reference
            currentFilePath = newFilePath;

            let content = "";

            // read file if it's text-based
            if (fileObj.mimetype?.includes("text")) {
                content = fs.readFileSync(newFilePath, "utf-8");
            }

            return res.status(200).json({
                message: "File uploaded & replaced successfully",
                make: fields.make,
                model: fields.model,
                badge: fields.badge,
                filePath: newFilePath,
                logbook: content,
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "File processing failed" });
        }
    });
}