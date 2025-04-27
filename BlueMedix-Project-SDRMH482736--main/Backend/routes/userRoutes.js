const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createUser);

// Protected routes
router.get('/', protect, authorize(['Admin+DataScientist']), getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize(['Admin+DataScientist']), deleteUser);
router.put('/:id/password', protect, changePassword);

module.exports = router;
