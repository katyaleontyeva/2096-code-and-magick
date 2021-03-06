'use strict';

(function () {
  var setupDialog = document.querySelector('.setup');
  var setupOpen = document.querySelector('.setup-open');
  var setupOpenIcon = setupOpen.querySelector('.setup-open-icon');
  var setupClose = setupDialog.querySelector('.setup-close');
  var userNameInput = setupDialog.querySelector('.setup-user-name');


  // Нажатие на escape
  var onPopupEscPress = function (evt) {
    window.utils.isEscEvent(evt, closePopup);
  };

  // Открытие окна настроек
  var openPopup = function () {
    setupDialog.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  // Закрытие окна настроек
  var closePopup = function () {
    setupDialog.classList.add('hidden');
    setupDialog.style.top = '';
    setupDialog.style.left = '';
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // Окно настроек открывается по нажатию на блок с иконкой пользователя
  setupOpen.addEventListener('click', openPopup);

  // Окно настроек открывается по нажатию на enter, если фокус на иконке пользователя
  setupOpenIcon.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, openPopup);
  });

  // Окно настроек закрывается по нажатию на крестик
  setupClose.addEventListener('click', closePopup);

  // Окно настроек закрывается по нажатию на enter, если фокус на крестике
  setupClose.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, closePopup);
  });

  // Если фокус находится на поле ввода имени, то окно не закрывается по нажатию на esc
  userNameInput.addEventListener('keydown', function (evt) {
    window.utils.isEscEvent(evt, function () {
      evt.stopPropagation();
    });
  });

  // Если фокус находится на поле ввода имени, то форма не отправляется по нажатию на enter
  userNameInput.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, function () {
      evt.preventDefault();
    });
  });

  // Перетаскивание окна
  var dialogHandle = setupDialog.querySelector('.upload');

  dialogHandle.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var limitCoords = {
      minX: setupDialog.offsetWidth / 2,
      maxX: window.innerWidth - setupDialog.offsetWidth / 2,
      minY: 0,
      maxY: window.innerHeight
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var dialogX = Math.min(Math.max((setupDialog.offsetLeft - shift.x), limitCoords.minX), limitCoords.maxX);
      var dialogY = Math.min(Math.max((setupDialog.offsetTop - shift.y), limitCoords.minY), limitCoords.maxY);

      setupDialog.style.left = dialogX + 'px';
      setupDialog.style.top = dialogY + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      // Если перетащили, то клик произойдет, но действие по умолчанию отменится
      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          dialogHandle.removeEventListener('click', onClickPreventDefault);
        };
        dialogHandle.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.closeDialog = closePopup;
})();
