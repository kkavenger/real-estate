import express from "express";
import { createListing, deleteListing } from "../controllers/listing.controllers.js";
import { verifyToken } from "../utilies/Verifyuser.js";

const router = express.Router();

router.post('/create', verifyToken ,createListing);
router.delete('/delete/:id', verifyToken, deleteListing);

export default router;