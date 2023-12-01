import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { appConfig } from './app/app.config';
/* import { AppComponent } from './app/app.component'; */

platformBrowserDynamic().bootstrapModule(appConfig)
  .catch(err => console.error(err));
