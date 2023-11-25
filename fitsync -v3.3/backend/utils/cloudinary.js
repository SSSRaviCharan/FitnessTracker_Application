const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dqw1sokea', 
  api_key: '322151558995449', 
  api_secret: 'BG3aTNynudOjU_-4JIMQ5FPlmls' 
});

module.exports = cloudinary;