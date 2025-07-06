const Admin = require('../models/admin_reg');
const bcrypt = require('bcrypt');
const { generateOTP, sendOTPEmail } = require('../utils/otp');

const RegisterAdmin = async (req, res) =>{
    const { FirstName, LastName, email, PhoneNumber, Password} = req.body;

    try{

        let admin = await Admin.findOne({ email })
        if (admin){
            return res.status(400).json({
                message: 'Admin already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);


        admin = new Admin({
            FirstName,
            LastName,
            email,
            PhoneNumber,
            Password: hashedPassword,
        })

        await admin.save();

    }catch(err){

    }
}

module.exports = {
    RegisterAdmin,
}