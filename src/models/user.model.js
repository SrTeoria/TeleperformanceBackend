const { model, models, Schema } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      async validator(email) {
        try {
          const user = await models.User.findOne({ email })
          return !user
        } catch (error) {
          return false
        }
      },
      message: 'El correo ya esta en uso'
    },
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  lastName: String,
  role: String,
  salary: Number,
  dateOfAdmision: Date,
  userType: String,
  active: String,
}, {
  timestamps: true,
})

userSchema.pre('save', async function(){
  if(this.password && this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 8)
  }
})

const User = model('User', userSchema)

module.exports = User
