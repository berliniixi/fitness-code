const mongoose = require('mongoose')


const connectToDB = async(url) => {
  return mongoose.connect(url)
  .then(() => {
    console.log('Connected to DB...');
  })
  .catch((err)=>{console.log('err:', err);})
} 

module.exports = connectToDB;
