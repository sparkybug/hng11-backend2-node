const { Organization, User } = require('../models');

exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await req.user.getOrganizations();
    res.status(200).json({
      status: 'success',
      message: 'Organizations retrieved successfully',
      data: { organizations },
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to retrieve organizations' });
  }
};

exports.getOrganization = async (req, res) => {
  const { orgId } = req.params;

  try {
    const organization = await Organization.findByPk(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const users = await organization.getUsers({ where: { userId: req.user.userId } });
    if (users.length === 0) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organization retrieved successfully',
      data: organization,
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to retrieve organization' });
  }
};

exports.createOrganization = async (req, res) => {
  const { name, description } = req.body;

  try {
    const organization = await Organization.create({ name, description });
    await req.user.addOrganization(organization);

    res.status(201).json({
      status: 'success',
      message: 'Organization created successfully',
      data: organization,
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create organization' });
  }
};

exports.addUserToOrganization = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const organization = await Organization.findByPk(orgId);
    const user = await User.findByPk(userId);

    if (!organization || !user) {
      return res.status(404).json({ message: 'Organization or User not found' });
    }

    await organization.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organization successfully',
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add user to organization' });
  }
};
