export default () => {
  let socialBlock = document.querySelector(`.js-social-block`);
  socialBlock.addEventListener(`mouseover`, function () {
    socialBlock.classList.add(`social-block--active`);
  });
  socialBlock.addEventListener(`mouseleave`, function () {
    socialBlock.classList.remove(`social-block--active`);
  });

  socialBlock.addEventListener(`focusin`, function () {
    socialBlock.classList.add(`social-block--active`);
  });
  socialBlock.addEventListener(`focusout`, function () {
    socialBlock.classList.remove(`social-block--active`);
  });
};
