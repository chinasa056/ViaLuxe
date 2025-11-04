import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
} from '@prisma/client/runtime/library';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { GraphQLError } from 'graphql';

export interface FormattedError {
  statusCode: number;
  message: string;
  errors?: any;
}

export function formatError(error: any): FormattedError {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let errors: any;

  // Prisma "known" errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 400;
        const fields = Array.isArray(error.meta?.target)
          ? error.meta.target.join(', ')
          : String(error.meta?.target);
        message = `A record with that ${fields} already exists.`;
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference to related record.';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found.';
        break;
      case 'P2022':
        statusCode = 500;
        const column = error.meta?.column;
        message = `Database schema error: The column ${column} does not exist.`;
        break;
      default:
        message = error.message;
        break;
    }
  }

  // Prisma initialization failure
  else if (error instanceof PrismaClientInitializationError) {
    statusCode = 500;
    message = 'Database connection error';
  }

  // Prisma "invalid invocation" (missing required where input)
  else if (
    typeof error?.message === 'string' &&
    error.message.includes('Invalid `this.prisma')
  ) {
    statusCode = 400;
    message = 'Invalid database query';
    errors = error.message;
  }

  // Prisma "Invalid invocation"
  else if (
    typeof error?.message === 'string' &&
    (error.message.includes('Invalid `prisma.') ||
      error.message.includes('Invalid `this.prisma'))
  ) {
    statusCode = 400;
    message = 'Invalid database query input';

    const lines = error.message.split('\n').map((line) => line.trim());
    const argLine = lines.find((l) => l.startsWith('Argument `'));
    const needsLine = lines.find((l) => l.includes('needs at least'));

    const prismaCallMatch = error.message.match(/Invalid `(.*?)` invocation/);
    const prismaPath = prismaCallMatch ? prismaCallMatch[1] : 'prisma.unknown';

    const argMatch = argLine?.match(/Argument `(.*?)`/);
    const argName = argMatch ? argMatch[1] : 'unknown';

    let nestedPath: string | undefined;
    const nestedMatch = error.message.match(
      /(\w+)\s*:\s*\{\s*\n\s*upsert:\s*\[\s*\{\s*\n\s*where:\s*\{\s*id:\s*undefined/
    );
    if (nestedMatch) nestedPath = nestedMatch[1];

    const fullFieldPath = nestedPath
      ? `${nestedPath}.${argName}`
      : argName;

    const cleanedMessage =
      needsLine ||
      argLine ||
      'Invalid Prisma query — possibly due to missing required field or undefined value.';

    errors = [
      {
        field: fullFieldPath,
        message: cleanedMessage.replace(/\s+/g, ' ').trim(),
      },
    ];
  }

  // Nest exceptions
  else if (error instanceof HttpException) {
    statusCode = error.getStatus();
    const resp = error.getResponse();

    if (typeof resp === 'string') {
      message = resp;
    } else {
      const obj = resp as Record<string, any>;

      if (Array.isArray(obj.message) && typeof obj.message[0] === 'string') {
        message = obj.message.join(', ');
      } else if (Array.isArray(obj.message) && typeof obj.message[0] === 'object') {
        message = 'Validation failed';
        errors = obj.message;
      } else {
        message = obj.message || obj.error || message;
        errors = obj.errors || obj.message;
      }
    }
  }

  // ✅ GraphQL variable validation / BAD_USER_INPUT
  else if (
    error instanceof GraphQLError ||
    error?.code === 'BAD_USER_INPUT' ||
    (Array.isArray(error?.errors) &&
      error.errors.some((e: any) => e.code === 'BAD_USER_INPUT'))
  ) {
    statusCode = 400;
    const messageStr = error.message || error.errors?.[0]?.message || '';
    const missingFieldMatches = [...messageStr.matchAll(/Field "(.*?)" of required type "(.*?)" was not provided/g)];
    const variableMatch = messageStr.match(/Variable "(.*?)"/);

    if (missingFieldMatches.length > 0) {
      const variable = variableMatch ? variableMatch[1] : '$input';
      errors = missingFieldMatches.map((match) => ({
        variable,
        field: match[1],
        expectedType: match[2],
        message: `The field "${match[1]}" is required but was not provided.`,
      }));

      if (errors.length === 1) {
        const { field, expectedType } = errors[0];
        message = `Missing required field "${field}" of type ${expectedType} in variable ${variable}`;
      } else {
        message = `Missing multiple required fields in variable ${variable}`;
      }
    } else {
      message = 'Bad user input';
      errors = [
        {
          message: messageStr,
          code: error.extensions?.code || error.code || 'BAD_USER_INPUT',
        },
      ];
    }
  }

  // class-validator errors (DTO validation)
  else if (Array.isArray(error) && error[0] instanceof ValidationError) {
    statusCode = 422;
    errors = error.map((e) => ({
      field: e.property,
      constraints: e.constraints,
    }));
    message = 'Validation failed';
  }

  // JWT Token expired
  else if (error?.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Fallback
  else {
    message = error?.message || message;
  }

  return { statusCode, message, errors };
}
