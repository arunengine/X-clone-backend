// 8 create route page

import express from "express" // 9 import expresss
import protectRoute from "../middleware/protectRoute.js";
import { signup , login , logout , getMe} from "../controller/auth.controller.js"; // import that newly created signup

const router = express.Router() // 10 import router


router.post("/signup" , signup ) // and replace here 
router.post("/login" , login )
router.post("/logout" , logout )
router.get("/me" , protectRoute , getMe)

export default router ;  