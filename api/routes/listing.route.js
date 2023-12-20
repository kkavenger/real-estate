import express from "express";
import { createListing, deleteListing, getListing, getListings, updateListing } from "../controllers/listing.controllers.js";
import { verifyToken } from "../utilies/Verifyuser.js";

const router = express.Router();

router.post('/create', verifyToken ,createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListings);
router.get('/get', getListing);

export default router;