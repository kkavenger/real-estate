import listing from "../models/listing.module.js";

export const createListing = async (req, res, next) => {
    try {
        const listings  = await listing.create(req.body);
        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};