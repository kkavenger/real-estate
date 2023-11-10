import listing from "../models/listing.module.js";

export const createListing = async (req, res, next) => {
    try {
        const listing  = await listing.create(req.body);
        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};