/**
 * WorkSphere Enterprise HRMS - Main Application Server
 * Entry Point: HTTP Service & Enterprise Router
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const appConfig = require('./src/config/app.config');
const logger = require('./src/core/Logger');
const SchemaMigrator = require('./src/database/migrations');
const masterSeeder = require('./src/database/seeders');
const apiRouter = require('./src/routes');
const errorHandlerMiddleware = require('./src/middleware/errorHandlerMiddleware');

const app = express();

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(appConfig.security.cors));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Assets
app.use(express.static(path.join(__dirname, 'src/public')));
app.use('/views', express.static(path.join(__dirname, 'src/views')));

// API Routes
app.use(appConfig.app.apiPrefix, apiRouter);

// Frontend Page Routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/dashboard.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/login.html'));
});

app.get('/employees', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/employees.html'));
});

app.get('/attendance', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/attendance.html'));
});

app.get('/leaves', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/leaves.html'));
});

app.get('/payroll', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/payroll.html'));
});

app.get('/recruitment', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/recruitment.html'));
});

app.get('/performance', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/performance.html'));
});

app.get('/orgchart', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/orgchart.html'));
});

app.get('/analytics', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/analytics.html'));
});

app.get('/helpdesk', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/helpdesk.html'));
});

app.get('/documents', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/documents.html'));
});

app.get('/audit-logs', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/audit-logs.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/settings.html'));
});

// Error handling
app.use(errorHandlerMiddleware);

// Initialize & Boot
async function startServer() {
  try {
    logger.info('Initializing WorkSphere Enterprise HRMS database...');
    await SchemaMigrator.runMigrations();
    await masterSeeder.seedAll();

    const port = appConfig.app.port;
    const server = app.listen(port, () => {
      logger.info(`========================================================`);
      logger.info(` WorkSphere Enterprise HRMS v${appConfig.app.version} running!`);
      logger.info(` Access URL: http://${appConfig.app.host}:${port}`);
      logger.info(` API Health: http://${appConfig.app.host}:${port}${appConfig.app.apiPrefix}/health`);
      logger.info(` Environment: ${appConfig.app.env}`);
      logger.info(`========================================================`);
    });
    return server;
  } catch (err) {
    logger.error('Failed to start enterprise server', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
