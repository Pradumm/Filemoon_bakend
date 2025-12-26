import { FileModel } from "../model/file.model.js"



export const fetchDashboard = async (req, res) => {
    try {
        const reports = await FileModel.aggregate([

            // {
            //     $match: {
            //         format: { $ne: "image" }   //  {$nin:["iamge","gif","pdf"]
            //     }
            // },
            {
                $group: {
                    _id: "$format",
                    total: { $sum: 1 }
                }
            },
            // {
            //     $project: {
            //         type: "$_id",
            //         total: 1,
            //         _id: 0
            //     }

            // }
        ])

        res.status(200).json(reports)
    } catch (error) {
        res.status(500).json(error.message)
    }
}