const express = require('express');
const { body } = require('express-validator');

const rolesController = require('../controllers/roles');
const Role = require('../models/role');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

const roleValidators = (isAdd) => {
    return [
        body('name')
            .not().isEmpty()
            .withMessage('This field is required.')
            .isLength({ min: 3 })
            .withMessage('This field at least 3 characters.')
            .custom((value, { req }) => {
                return Role.findOne(isAdd ? { name: value } : { name: req.body.name, _id: { $ne: req.params.id } }).then(oldUser => {
                    if (oldUser) {
                        return Promise.reject('Role name exists already, please pick a different one.');
                    }
                });
            })
            .trim(),
        body('description')
            .not().isEmpty()
            .withMessage('This field is required.')
            .isLength({ min: 4, max: 400 })
            .withMessage('This field must be between 4 and 400 characters.')
    ]
}

// GET /roles
router.get('/', rolesController.getRoles);

// GET /roles/5
router.get('/:id', rolesController.getRole);

// POST /roles
router.post('/', [roleValidators(true)], rolesController.postRole);

// PUT /roles/5
router.put('/:id', [roleValidators(false)], rolesController.putRole);

// DELETE /roles/5
router.delete('/:id', rolesController.deleteRole);

module.exports = router;