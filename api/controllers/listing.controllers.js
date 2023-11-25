import listing from "../models/listing.module.js";
import { error } from "../utilies/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listings  = await listing.create(req.body);
        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};
export const deleteListing = async(req, res, next) => {
    const listings = await listing.findById(req.params.id);
    if(!listings) {
       return next(error(404, 'Listing not found')); 
    }
    if(req.user.id !== listings.userRef){
        return next(error(401, 'You can only delete your own listings'))
    }
    try {
        await listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const updateListing = async(req, res, next) => {
    const listings = await listing.findById(req.params.id);
    if(!listings){
        return next(error(401, 'Listing not found'))
    }
    if(req.user.id !== listings.userRef){
        return next(error(404, 'You can only update your own listings'))
    }
    try {
        const updatedlistings = await listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new : true }
        )
        res.status(200).json(updatedlistings)
    } catch (error) {
        next(error)
    }
}
export const getListings = async(req, res, next) => {
    try {
        const listings = await listing.findById(req.params.id);
        if(!listings){
            return next(error(404, 'Listing not found'));
        }
        res.status(200).json(listings)
    } catch (error) {
        next(error)
    }
}