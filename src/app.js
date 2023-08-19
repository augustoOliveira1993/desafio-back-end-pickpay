const express = require('express');
require('express-async-errors');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const routes = require('./views/routes');
require('dotenv').config();

module.exports = class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    middlewares() {
        this.server.use(helmet());
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: true }));
    }

    routes() {
        this.server.use('/api/v1', routes);
    }

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        });
    }
}
