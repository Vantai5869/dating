import Users from "../models/user.js"
import jwt from 'jsonwebtoken'

const authMiddleware =async (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]
   	console.log(authHeader )
	if (!token)
		return res
			.status(401)
			.json({ message: 'Vui lòng đăng nhập' })

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decoded)
		const user = await Users.findOne({_id: decoded.id})
		req.user = user
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({  message: 'Invalid token' })
	}
}

export default authMiddleware