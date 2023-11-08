// import { error } from "./error.js";
// import jwt from "jsonwebtoken"

// export const verifyToken = (res, req, next) => {

//     const token = req.cookies.access_token;

//     if(!token) {
//         return next(error(401, "Unauthorized"));
//     }
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//         if(err){
//             return next(error(403, "Forbidden"));
//         }
//         req.user = user;
//         next();
//     });
// };
import { error } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(error(401, "Unauthorized"));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return next(error(403, "Forbidden"));
        }

        req.user = user;
        next();
    });
};
