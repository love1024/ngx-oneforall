import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

import {
  mapError,
  configureErrorMapper,
  resetErrorMapperConfig,
  extractValidationErrors,
  ErrorSeverity,
  ErrorCategory,
  MappedError,
} from 'ngx-oneforall/utils/global-error-mapper';

interface DemoScenario {
  title: string;
  description: string;
  error: unknown;
}

@Component({
  selector: 'lib-global-error-mapper-demo',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="demo">
      <h3>Error Mapping Scenarios</h3>

      <div class="scenarios">
        @for (scenario of scenarios; track scenario.title; let i = $index) {
          <div class="scenario-card">
            <div class="scenario-header">
              <h4>{{ scenario.title }}</h4>
              <span class="description">{{ scenario.description }}</span>
            </div>
            <div class="scenario-body">
              <button class="map-btn" (click)="mapScenario(i)">
                Map Error
              </button>

              @if (results()[i]) {
                <div class="result">
                  <div class="result-row">
                    <span class="label">Code:</span>
                    <code>{{ results()[i].code }}</code>
                  </div>
                  <div class="result-row">
                    <span class="label">User Message:</span>
                    <span class="user-message">{{
                      results()[i].userMessage
                    }}</span>
                  </div>
                  <div class="result-row">
                    <span class="label">Severity:</span>
                    <span
                      class="badge"
                      [class]="'severity-' + results()[i].severity">
                      {{ results()[i].severity }}
                    </span>
                  </div>
                  <div class="result-row">
                    <span class="label">Category:</span>
                    <span class="badge category">{{
                      results()[i].category
                    }}</span>
                  </div>
                  <div class="result-row">
                    <span class="label">Recoverable:</span>
                    <span
                      class="badge"
                      [class]="
                        results()[i].recoverable ? 'recoverable' : 'fatal'
                      ">
                      {{ results()[i].recoverable ? 'Yes' : 'No' }}
                    </span>
                  </div>
                  @if (results()[i].suggestedAction) {
                    <div class="result-row">
                      <span class="label">Suggested Action:</span>
                      <span class="action">{{
                        results()[i].suggestedAction
                      }}</span>
                    </div>
                  }
                  @if (results()[i].statusCode) {
                    <div class="result-row">
                      <span class="label">Status Code:</span>
                      <code>{{ results()[i].statusCode }}</code>
                    </div>
                  }
                  <details class="dev-details">
                    <summary>Developer Message</summary>
                    <pre class="dev-message">{{ results()[i].devMessage }}</pre>
                  </details>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <h3>Validation Error Extraction</h3>
      <div class="validation-demo">
        <button class="map-btn" (click)="extractValidation()">
          Extract Validation Errors
        </button>
        @if (validationResult()) {
          <div class="validation-result">
            <pre>{{ validationResult() | json }}</pre>
          </div>
        }
      </div>

      <h3>Custom Configuration</h3>
      <div class="config-demo">
        <button class="map-btn" (click)="applyCustomConfig()">
          Apply Custom Config
        </button>
        <button class="reset-btn" (click)="resetConfig()">Reset Config</button>
        @if (configMessage()) {
          <div class="config-message">{{ configMessage() }}</div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./global-error-mapper-demo.component.scss'],
})
export class GlobalErrorMapperDemoComponent {
  scenarios: DemoScenario[] = [
    {
      title: 'HTTP 401 Unauthorized',
      description: 'Authentication required',
      error: new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        url: 'https://api.example.com/users',
      }),
    },
    {
      title: 'HTTP 404 Not Found',
      description: 'Resource not found',
      error: new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        url: 'https://api.example.com/users/999',
      }),
    },
    {
      title: 'HTTP 500 Server Error',
      description: 'Internal server error',
      error: new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: { message: 'Database connection failed' },
      }),
    },
    {
      title: 'Network Error',
      description: 'Connection failed (status 0)',
      error: new HttpErrorResponse({
        status: 0,
        statusText: 'Unknown Error',
        error: new ProgressEvent('error'),
      }),
    },
    {
      title: 'TypeError',
      description: 'Runtime type error',
      error: new TypeError(
        "Cannot read properties of undefined (reading 'name')"
      ),
    },
    {
      title: 'Custom Error',
      description: 'Application-specific error',
      error: new Error('Payment processing failed'),
    },
    {
      title: 'String Error',
      description: 'Simple string thrown as error',
      error: 'Something went wrong!',
    },
  ];

  results = signal<Record<number, MappedError>>({});
  validationResult = signal<Record<string, string | string[]> | null>(null);
  configMessage = signal<string>('');

  mapScenario(index: number): void {
    const scenario = this.scenarios[index];
    const mapped = mapError(scenario.error);
    this.results.update(r => ({ ...r, [index]: mapped }));
  }

  extractValidation(): void {
    const validationError = new HttpErrorResponse({
      status: 422,
      statusText: 'Unprocessable Entity',
      error: {
        errors: {
          email: 'Invalid email format',
          password: [
            'Password must be at least 8 characters',
            'Password must contain a number',
          ],
          username: 'Username already taken',
        },
      },
    });

    const errors = extractValidationErrors(validationError);
    this.validationResult.set(errors);
  }

  applyCustomConfig(): void {
    configureErrorMapper({
      defaultUserMessage: 'Oops! Something unexpected happened.',
      httpMappings: {
        418: {
          userMessage: "I'm a teapot!",
          severity: ErrorSeverity.Info,
          category: ErrorCategory.Business,
          recoverable: false,
        },
      },
      customMappers: [
        error => {
          if (error instanceof Error && error.message.includes('Payment')) {
            return {
              code: 'PAYMENT_ERROR',
              userMessage: 'Payment could not be processed.',
              category: ErrorCategory.Business,
              severity: ErrorSeverity.Warning,
              recoverable: true,
              suggestedAction: 'Please try another payment method.',
            };
          }
          return null;
        },
      ],
    });
    this.configMessage.set(
      'Custom configuration applied! Try mapping errors again.'
    );
    this.results.set({});
  }

  resetConfig(): void {
    resetErrorMapperConfig();
    this.configMessage.set('Configuration reset to defaults.');
    this.results.set({});
  }
}
