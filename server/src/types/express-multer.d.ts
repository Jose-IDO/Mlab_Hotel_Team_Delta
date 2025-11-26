// Augment Express Request with Multer's file/files when using multer
import 'express';
import type { Multer } from 'multer';

declare global {
  namespace Express {
    // Ensure the Multer namespace is available via @types/multer
    // and expose common properties on Request
    interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}
