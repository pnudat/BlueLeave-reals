const express = require('express');
const ldapService = require('../controllers/User');

const router = express.Router();

router.get('/user/:employeeID', (req, res) => {
    const employeeID = req.params.employeeID; // Extract employeeID from URL parameter

    ldapService.searchLDAP(employeeID, (err, data) => {
        if (err) {
            console.error('LDAP search error:', err.message);
            res.status(500).json({ error: 'LDAP search failed' });
        } else {
            console.log('LDAP search successful');
            res.json(data);
        }
    });
});

module.exports = router;