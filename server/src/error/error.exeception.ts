import { StatusCodes } from 'http-status-codes';
import { errorMessage } from './error.message';
export class NOT_FOUND extends Error {
  constructor(
    public message: string,
    public statusCode = StatusCodes.NOT_FOUND,
  ) {
    super(message);
  }
}
export class BAD_REQUEST extends Error {
  constructor(
    public message: string,
    public statusCode = StatusCodes.BAD_REQUEST,
  ) {
    super(message);
  }
}
