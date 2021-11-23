import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import ENV from 'mon-pix/config/environment';

const FOCUSEDOUT_EVENT_NAME = 'focusedout';

export default class Item extends Component {
  @service currentUser;

  constructor() {
    super(...arguments);
    if (this.isFocusedChallenge && !this.args.answer) {
      this._setFocusOutEventListener();
    }
  }

  @action
  hideOutOfFocusBorder() {
    if (this.isFocusedChallenge) {
      this.args.onFocusIntoChallenge();
    }
  }

  @action
  showOutOfFocusBorder(event) {
    if (this.isFocusedChallenge && !this.args.answer) {
      // linked to a Firefox issue where the mouseleave is triggered
      // when hovering the select options on mouse navigation
      // see: https://stackoverflow.com/questions/46831247/select-triggers-mouseleave-event-on-parent-element-in-mozilla-firefox
      if (this.shouldPreventFirefoxSelectMouseLeaveBehavior(event)) {
        return;
      }
      this.args.onFocusOutOfChallenge();
    }
  }

  shouldPreventFirefoxSelectMouseLeaveBehavior(event) {
    return event.relatedTarget === null;
  }

  _setFocusOutEventListener() {
    document.addEventListener(FOCUSEDOUT_EVENT_NAME, this._focusedoutListener);

    this._previousFocus = document.hasFocus();
    this._pollHasFocusInterval = setInterval(this._pollHasFocus, 1000);
  }

  _pollHasFocus = () => {
    const hasFocus = document.hasFocus();
    if (!hasFocus && this._previousFocus) {
      const hasFocusOutEvent = new CustomEvent(FOCUSEDOUT_EVENT_NAME);
      document.dispatchEvent(hasFocusOutEvent);
    }
    this._previousFocus = hasFocus;
  };

  _focusedoutListener = () => {
    this.args.onFocusOutOfWindow();
    this.clearFocusOutEventListener();
  };

  clearFocusOutEventListener = () => {
    clearInterval(this._pollHasFocusInterval);
    document.removeEventListener(FOCUSEDOUT_EVENT_NAME, this._focusedoutListener);
  };

  get isFocusedChallenge() {
    return ENV.APP.FT_FOCUS_CHALLENGE_ENABLED && this.args.challenge.focused;
  }
}
