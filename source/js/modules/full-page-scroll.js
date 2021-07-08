import throttle from 'lodash/throttle';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;
    this.ACTIVE_TIMEOUT = 100;
    this.SCREENBG_TIMEOUT = 500;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    const previousScreen = [...this.screenElements].find((el) => !el.classList.contains(`screen--hidden`));
    const currentScreen = this.screenElements[this.activeScreen];
    const backgroundScreen = document.querySelector(`.screen__background`);

    // если кликаем по текущему пункту меню, то выход
    if (previousScreen === currentScreen) {
      return;
    }

    // если переходим с экрана "История" на экран "Призы", то активируем фоновый экран
    if (previousScreen &&
        previousScreen.classList.contains(`screen--story`) &&
        currentScreen.classList.contains(`screen--prizes`)) {
      backgroundScreen.classList.add(`active`);

      window.setTimeout(() => {
        previousScreen.classList.remove(`active`);
        previousScreen.classList.add(`screen--hidden`);

        currentScreen.classList.remove(`screen--hidden`);
        currentScreen.classList.add(`active`);

        backgroundScreen.classList.remove(`active`);
      }, this.SCREENBG_TIMEOUT);
    } else {
      this.screenElements.forEach((screen) => {
        screen.classList.remove(`active`);
        screen.classList.add(`screen--hidden`);
      });

      currentScreen.classList.remove(`screen--hidden`);
      window.setTimeout(() => {
        currentScreen.classList.add(`active`);
      }, this.ACTIVE_TIMEOUT);
    }
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
