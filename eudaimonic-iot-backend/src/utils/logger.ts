// SISTEMA DE LOGGING ESTRUTURADO - METACOGNIÇÃO DO SISTEMA
// Implementa consciência sistémica através de logs detalhados

import winston from 'winston';
import path from 'path';

// Configuração baseada em variáveis de ambiente
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_FILE_PATH = process.env.LOG_FILE_PATH || './logs/iot-backend.log';

// Formato customizado para logs estruturados
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf((info: any) => {
    const { timestamp, level, message, component, metadata, ...rest } = info;
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      component: component || 'Unknown',
      message,
      ...(metadata && { metadata }),
      ...rest
    };
    return JSON.stringify(logEntry);
  })
);

// Criar diretório de logs se não existir
const logsDir = path.dirname(LOG_FILE_PATH);
const fs = require('fs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuração do logger
export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: logFormat,
  transports: [
    // Arquivo de log
    new winston.transports.File({
      filename: LOG_FILE_PATH,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Console em desenvolvimento
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
          winston.format.printf(({ timestamp, level, message, component }) => {
            return `[${timestamp}] ${level} [${component || 'App'}]: ${message}`;
          })
        )
      })
    ] : [])
  ]
});

// Função utilitária para logs estruturados
export const logWithContext = (
  level: 'info' | 'warn' | 'error' | 'debug',
  message: string,
  context: {
    component: string;
    metadata?: Record<string, any>;
    deviceId?: string;
    transactionHash?: string;
  }
) => {
  logger.log(level, message, context);
};

export default logger;