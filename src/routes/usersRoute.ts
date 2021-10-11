import express from 'express'
import UserController from '../controllers/UsersController'

const router = express.Router()

router.post('/', UserController.post)
router.get('/:_id', UserController.getSingle)
router.patch('/:_id', UserController.patchSingle)
router.delete('/:_id', UserController.deleteSingle)

export default router
