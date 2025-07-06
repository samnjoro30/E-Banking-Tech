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
        console.error(err.message);
        res.status(500).send('Error Registering, backend error');
    }
}

const LoginAdmin = async (req, res) => {
    const { email, Password} = req.body;
    try{
        const admin = await Admin.findOne({ email });
        if(!admin){
            return res.status(400).json({
                message: "Incorrect  email registerd"
            });
        }

        const isMatch = await bcrypt.compatre(Password, admin.Password)
        if(!isMatch){
            return res.status(400).json({
                message: "Incorrect Password"
            });
        }

        const token = jwt.sign(
            {

            }
        )

        res.status(200).json({
            message: 'login successful',
            token,
            admin: { FirstName, LastName, email, PhoneNumber}
        })

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            message: "Backend Error, Failed to login"
        });
    }
}

module.exports = {
    RegisterAdmin,
    LoginAdmin,
}