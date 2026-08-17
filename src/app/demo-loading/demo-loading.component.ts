// ============================================================================
// DEMO LOADING COMPONENT
// ============================================================================
// Demonstrates usage of LoadingService with both RxJS and async/await patterns
// ============================================================================

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-demo-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h2>Loading Service Demo</h2>

      <div class="demo-section">
        <h3>RxJS Observable Pattern (using finalize)</h3>
        <button (click)="loadWithRxJS()" [disabled]="loadingService.isLoading()">
          {{ loadingService.isLoading() ? 'Loading...' : 'Load with RxJS' }}
        </button>
        <pre *ngIf="rxjsResult" class="result">{{ rxjsResult | json }}</pre>
      </div>

      <div class="demo-section">
        <h3>Async/Await Pattern (using finally)</h3>
        <button (click)="loadWithAsyncAwait()" [disabled]="loadingService.isLoading()">
          {{ loadingService.isLoading() ? 'Loading...' : 'Load with Async/Await' }}
        </button>
        <pre *ngIf="asyncResult" class="result">{{ asyncResult | json }}</pre>
      </div>

      <div class="demo-section">
        <h3>Overlapping Operations (Counter-based)</h3>
        <button (click)="loadMultipleOperations()" [disabled]="loadingService.isLoading()">
          {{ loadingService.isLoading() ? 'Loading...' : 'Start Multiple Operations' }}
        </button>
        <p class="hint">
          The spinner stays visible until ALL operations complete, thanks to the
          request counter in LoadingService.
        </p>
        <pre *ngIf="multiResult" class="result">{{ multiResult | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-container { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
    .demo-section {
      margin-bottom: 1.5rem; padding: 1rem;
      border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;
    }
    button {
      padding: 0.5rem 1rem; background: #007bff; color: #fff;
      border: none; border-radius: 4px; cursor: pointer; font-size: 1rem;
    }
    button:disabled { background: #6c757d; cursor: not-allowed; }
    .result {
      margin-top: 1rem; padding: 0.75rem; background: #fff;
      border: 1px solid #ddd; border-radius: 4px; overflow-x: auto;
    }
    .hint { color: #666; font-size: 0.875rem; margin-top: 0.5rem; }
  `]
})
export class DemoLoadingComponent {
  protected readonly loadingService = inject(LoadingService);
  private readonly http = inject(HttpClient);

  rxjsResult: unknown = null;
  asyncResult: unknown = null;
  multiResult: unknown = null;

  /**
   * Pattern 1: Traditional RxJS observable chain using finalize.
   * finalize guarantees hide() runs on both success and error.
   */
  loadWithRxJS(): void {
    this.loadingService.show();

    this.http.get('https://jsonplaceholder.typicode.com/todos/1')
      .pipe(
        finalize(() => this.loadingService.hide())
      )
      .subscribe({
        next: (data) => { this.rxjsResult = data; },
        error: (err) => { this.rxjsResult = { error: String(err) }; }
      });
  }

  /**
   * Pattern 2: Modern async/await with try/catch/finally.
   * finally guarantees hide() runs on both success and error.
   */
  async loadWithAsyncAwait(): Promise<void> {
    this.loadingService.show();

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/2');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.asyncResult = await response.json();
    } catch (error) {Please create or modify these files in my current workspace directory automatically. Do not use placeholders or omit blocks of code.
      this.asyncResult = { error: String(error) };
    } finally {
      this.loadingService.hide();
    }
  }

  /**
   * Pattern 3: Overlapping operations demonstrating the counter-based approach.
   * Each operation independently increments/decrements the counter; the spinner
   * only hides once every operation has finished.
   */
  async loadMultipleOperations(): Promise<void> {
    const results = await Promise.all([
      this.simulateAsyncOperation('Operation 1', 2000),
      this.simulateAsyncOperation('Operation 2', 3000),
      this.simulateAsyncOperation('Operation 3', 1500)
    ]);
    this.multiResult = results;
  }

  private async simulateAsyncOperation(name: string, delay: number): Promise<string> {
    this.loadingService.show();
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, delay));
      return `${name} completed after ${delay}ms`;
    } finally {
      this.loadingService.hide();
    }
  }
}