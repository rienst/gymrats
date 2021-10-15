import express from 'express'
import {
  insertUser,
  getUser,
  patchUser,
  deleteUser,
} from '../controllers/usersControllers'

const usersRouter = express.Router()

usersRouter.post('/', insertUser)
usersRouter.get('/:_id', getUser)
usersRouter.patch('/:_id', patchUser)
usersRouter.delete('/:_id', deleteUser)

export default usersRouter
