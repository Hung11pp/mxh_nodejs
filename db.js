const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('node1', 'root', 'hung11pp', {
    host: 'localhost',
    dialect: 'mysql',
});
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
sequelize.sync()
    .then(() => {
        console.log('Bảng đã được tạo thành công.');
    })
    .catch((error) => {
        console.error('Lỗi khi tạo bảng:', error);
    });

module.exports = sequelize;