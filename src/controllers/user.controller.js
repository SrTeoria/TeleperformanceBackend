const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


module.exports = {
  async createUser(req, res){
    try{
      const { email, password, name, lastName, role, salary, dateOfAdmision, userType, active} = req.body
      if(userType === 'admin'){
        const admin = await User.create({ email, password, name, lastName, role, salary, dateOfAdmision, userType, active})
        await admin.save({validateBeforeSave: false})
      } else {
        const user = await User.create({ email, password, name, lastName, role, salary, dateOfAdmision, userType, active })
        await user.save({validateBeforeSave: false})
      }

      const token = jwt.sign(
        {
          userType: userType === 'admin'  ? 'admin' : 'user'
        },
        process.env.SECRET,
        {expiresIn: 60*60}
      )
      const userKind = userType === 'admin' ? 'admin' : 'user'
      res.status(201).json({token, userKind})
    } catch(error) {
      res.status(400).json({error: error. message})
    }
  },
  async list(req, res){
    try{
      const { query } = req
      const users = await User.find(query)
      res.status(201).json(users)
    } catch(error){
      res.status(400).json({ message: `No se puede encontrar los usuarios ${error}`})
    }
  },
  async update(req, res){
    try{
      const { body, user: {_id}} = req
      const user = await User.findByIdAndUpdate(_id, body, {new: true})

      res.status(201).json(user)
    } catch(error){
      res.status(400).json({message: 'No se pudo actualizar el usuario', error})
    }
  },
  async deleteUser(req, res){
    try{
      const { body } = req
      const user = await User.findByIdAndDelete(body)

      res.status(201).json('El usuario se ha eliminado exitosamente')
    } catch(error){
      res.status(400).json({message: 'No se pudo eliminar el usuario', error})
    }
  },
  async login(req, res){
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email })

      if(!user){
        throw Error('El correo del usuario es invalido')
      }

      const isValid = await bcrypt.compare(password, user.password)

      if(!isValid){
        throw Error('Contraseña invalida')
      }

      const token = jwt.sign(
        {
          userType: user.userType === 'admin' ? 'admin' : 'user'
        },
        process.env.SECRET,
        { expiresIn: 60*60 }
      )

      const userKind = user.userType === 'admin' ? 'admin' : 'user'
      res.status(201).json({token, userKind})
    } catch(error){
      res.status(401).json({message: error.message})
    }
  },
  async getUser(req, res){
    try {
      const { params: { userId } } = req
      const user = await User.findById(userId)

      res.status(201).json({message: 'Usuario cargado con exito', user})
    } catch(error){
      res.status(400).json({message: 'No se pudo obtener la informacion del usuario'}, error)
    }
  }
}
