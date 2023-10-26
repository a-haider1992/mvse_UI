import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    // Handle the error here, e.g., log, navigate to an error page, or display a user-friendly message.
    console.error('Global Error Handler:', error);

    // Access other services if needed (e.g., Router)
    const router = this.injector.get(Router);
    router.navigate(['/']);
    
    // You can navigate to an error page or do other actions
    // Example: router.navigate(['/error']);
  }
}
