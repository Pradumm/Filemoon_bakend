import { FileModel } from "../model/file.model.js"
import fs from "fs"
import path from "path"


const getFileFormat = (mimetype) => {
    if (mimetype === "application/x-msdos-program") return "application/exe"
    return mimetype
}


export const createFile = async (req, res) => {
 

    try {
        const file = req.file;
        const { filename } = req.body
        console.log(file)


        const payload = {
            filename: filename,
            type: getFileFormat(file.mimetype),
            path: `${file.destination}${file.filename}`,
            size: file.size,
            user: req.user.id
        }

        await FileModel.create(payload)

        res.status(201).json({
            succss: true,
            message: "file uploaded successfully",
            payload
        })

    } catch (error) {
        res.status(500).json(error.message)
    }
}


export const fetchFiles = async (req, res) => {
    try {
        const files = await FileModel.find({ user: req.user.id });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteFile = async (req, res) => {
    try {
        const { id } = req.params
        const file = await FileModel.findByIdAndDelete(id)
        if (!file) {
            return res.status(404).json({ message: "file not found" })
        }

        fs.unlinkSync(file.path)
        res.status(200).json({
            message: "file deleted successfully",
            file
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const downloadFile = async (req, res) => {
    try {
        const { id } = req.params
        const file = await FileModel.findById(id)

        if (!file)
            return res.status(404).json({ message: "File not found" })

        const ext = file.type.split("/")[1]

        const root = process.cwd()
        const filepath = path.join(root, file.path);
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}.${ext}"`)

        res.sendFile(filepath, (err) => {
            if (err) {
                res.status(404).json({ message: 'file not Found' })
            }
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

}
