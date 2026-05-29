const asyncHandler = require("express-async-handler");

exports.createOne = (Model) => asyncHandler(async (req, res, next) => {
        const document = await Model.create(req.body);
        res.status(200).json({ status: "succses", data: document })
    })

exports.getAll = (Model) => asyncHandler(async (req, res, next) => {
        const document = await Model.find();
        res.status(200).json({ status: "succses", data: document })
    })

exports.getOne = (Model) =>  asyncHandler(async (req, res, next) => {
        const document = await Model.findById(req.params.id);
        res.status(200).json({ status: "succses", data: document })
    })

exports.updateOne = (Model) => asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(req.params.id , req.body ,{ returnDocument: "after" });
        res.status(200).json({ status: "succses", data: document })
    })

exports.deleteOne = (Model) =>asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndDelete(req.params.id );
        res.status(200).json({ status: "succses"})
    })