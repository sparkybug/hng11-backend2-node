const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', organizationController.getOrganizations);
router.get('/:orgId', organizationController.getOrganization);
router.post('/', organizationController.createOrganization);
router.post('/:orgId/users', organizationController.addUserToOrganization);

module.exports = router;
