var express = require('express');
const userController = require('./controller/userController');
const bodyParser = require('body-parser');
const User = require('./entity/user');
const bcrypt = require('bcryptjs')
const app = express();
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({
        where: { username: username }
    });
    if (!user) {
        return res.status(401).json({ message: 'wrong user' })
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
        const payload = { username: username };
        const secretKey = 'hung11pp';
        const options = { expiresIn: '3h' };
        const token = jwt.sign(payload, secretKey, options);
        res.json({ 'token': token });
    } else {
        // Thông tin đăng nhập không chính xác
        res.status(401).json({ message: 'wrong password' });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null || typeof token === 'undefined') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'hung11pp', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (user.exp && user.exp < currentTimestamp) {
            return res.status(401).json({ error: 'Token expired' });
        }
        req.user = user;
        next();
    });
}
app.post('/users', (req, res) => {
    const newUser = req.body;
    userController.createUser(newUser)
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to create user' });
        });
});

app.get('/users', authenticateToken, (req, res) => {
    userController.getUsers()
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to get users' });
        });
});
app.get('/users/me', authenticateToken, async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'hung11pp');
    const username = decodedToken.username;
    const user = await User.findOne({
        where: { username: username }
    });
    if (!user) {
        return res.status(401).json({ message: 'wrong user' })
    }
    return res.json(user);
});
app.get('/users/:userId', authenticateToken, (req, res) => {
    const userId = req.params.userId;
    userController.getUserById(userId)
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to get user' });
        });
});
app.put('/users/:userId', authenticateToken, (req, res) => {
    const userId = req.params.userId;
    const updatedUser = req.body;
    userController.updateUser(userId, updatedUser)
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update user' });
        });
});

app.get('/', (req, res) => {
    res.send('hello')
})
app.listen(3000, () => {
    console.log('Server started on port 3000');
});