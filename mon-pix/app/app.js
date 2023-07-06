import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import { InitSentryForEmber } from '@sentry/ember';

import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/fr';
import '@formatjs/intl-getcanonicallocales/polyfill';

import { defineCustomElements as defineCustomElements1 } from '@1024pix/pix-webcomponents/loader';
defineCustomElements1();

import { defineCustomElements as defineCustomElements2 } from '@1024pix/pix-ui-webcomponents/loader';
defineCustomElements2();

if (config.sentry.enabled) {
  InitSentryForEmber();
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
