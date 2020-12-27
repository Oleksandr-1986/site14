// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
   let originalPositions = [];
   let daElements = document.querySelectorAll('[data-da]');
   let daElementsArray = [];
   let daMatchMedia = [];
   //Заполняем массивы
   if (daElements.length > 0) {
      let number = 0;
      for (let index = 0; index < daElements.length; index++) {
         const daElement = daElements[index];
         const daMove = daElement.getAttribute('data-da');
         if (daMove != '') {
            const daArray = daMove.split(',');
            const daPlace = daArray[1] ? daArray[1].trim() : 'last';
            const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
            const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
            const daDestination = document.querySelector('.' + daArray[0].trim())
            if (daArray.length > 0 && daDestination) {
               daElement.setAttribute('data-da-index', number);
               //Заполняем массив первоначальных позиций
               originalPositions[number] = {
                  "parent": daElement.parentNode,
                  "index": indexInParent(daElement)
               };
               //Заполняем массив элементов 
               daElementsArray[number] = {
                  "element": daElement,
                  "destination": document.querySelector('.' + daArray[0].trim()),
                  "place": daPlace,
                  "breakpoint": daBreakpoint,
                  "type": daType
               }
               number++;
            }
         }
      }
      dynamicAdaptSort(daElementsArray);

      //Создаем события в точке брейкпоинта
      for (let index = 0; index < daElementsArray.length; index++) {
         const el = daElementsArray[index];
         const daBreakpoint = el.breakpoint;
         const daType = el.type;

         daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
         daMatchMedia[index].addListener(dynamicAdapt);
      }
   }
   //Основная функция
   function dynamicAdapt(e) {
      for (let index = 0; index < daElementsArray.length; index++) {
         const el = daElementsArray[index];
         const daElement = el.element;
         const daDestination = el.destination;
         const daPlace = el.place;
         const daBreakpoint = el.breakpoint;
         const daClassname = "_dynamic_adapt_" + daBreakpoint;

         if (daMatchMedia[index].matches) {
            //Перебрасываем элементы
            if (!daElement.classList.contains(daClassname)) {
               let actualIndex = indexOfElements(daDestination)[daPlace];
               if (daPlace === 'first') {
                  actualIndex = indexOfElements(daDestination)[0];
               } else if (daPlace === 'last') {
                  actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
               }
               daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
               daElement.classList.add(daClassname);
            }
         } else {
            //Возвращаем на место
            if (daElement.classList.contains(daClassname)) {
               dynamicAdaptBack(daElement);
               daElement.classList.remove(daClassname);
            }
         }
      }
      customAdapt();
   }

   //Вызов основной функции
   dynamicAdapt();

   //Функция возврата на место
   function dynamicAdaptBack(el) {
      const daIndex = el.getAttribute('data-da-index');
      const originalPlace = originalPositions[daIndex];
      const parentPlace = originalPlace['parent'];
      const indexPlace = originalPlace['index'];
      const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
      parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
   }
   //Функция получения индекса внутри родителя
   function indexInParent(el) {
      var children = Array.prototype.slice.call(el.parentNode.children);
      return children.indexOf(el);
   }
   //Функция получения массива индексов элементов внутри родителя 
   function indexOfElements(parent, back) {
      const children = parent.children;
      const childrenArray = [];
      for (let i = 0; i < children.length; i++) {
         const childrenElement = children[i];
         if (back) {
            childrenArray.push(i);
         } else {
            //Исключая перенесенный элемент
            if (childrenElement.getAttribute('data-da') == null) {
               childrenArray.push(i);
            }
         }
      }
      return childrenArray;
   }
   //Сортировка объекта
   function dynamicAdaptSort(arr) {
      arr.sort(function (a, b) {
         if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
      });
      arr.sort(function (a, b) {
         if (a.place > b.place) { return 1 } else { return -1 }
      });
   }
   //Дополнительные сценарии адаптации
   function customAdapt() {
      //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
   }
}());

//burger
$(document).ready(function () {
   $('.header__burger').click(function (event) {
      $('.header__burger,.header__menu-right').toggleClass('active');
      $('body').toggleClass('lock');
   });

   $('.menu a').click(function (event) {
      $('.header__burger,.header__menu-right').toggleClass('active');
      $('body').toggleClass('lock');
   });

});
//slider
new Swiper('.specialties-slider', {

   pagination: {
      el: '.swiper-pagination',
      clickable: true,
   },

   hashNavigation: {
      watchState: true,
   },

   keyboard: {
      enable: true,
      onlyInViewport: true,
      pageUpDown: true,
   },

   slidesPerView: 1,
   slidesPerGroup: 1,
   loop: true,
   loopedSlides: 3,
   centeredSlides: true,

   /*
      autoplay: {
         delay: 1000,
         stopOnLastSlide: true,
         disableOnInteraction: false
      },
   */
   speed: 800,
});
//таби

$(function () {
   let tab = $('#tabs .delicious__tabs-body > .delicious__tabs-block');
   tab.hide().filter(':first').show();
   // кліки по вкладкам
   $('#tabs .delicious__tabs-nav .delicious__tabs-link').click(function () {
      tab.hide();
      tab.filter(this.hash).show();
      $('#tabs .delicious__tabs-nav .delicious__tabs-link').removeClass('active');
      $(this).addClass('active');
      return false;
   }).filter(':first').click();
   // кліки по якорним ссилкам
   $('.tabs-target').click(function () {
      $('#tabs .delicious__tabs-nav .delicious__tabs-link[href=' + $(this).data('id') + ']').click();
   });
});
//scrollTo
$(document).ready(function () {
   $(".menu").on("click", "a", function (event) {
      // виключаємо тандартну ракцію браузера
      event.preventDefault();
      // отримуємо ідентифікатор блока з атрибута href
      var id = $(this).attr('href'),
         // знаходимо висоту на якій розташований блок віднімаємо висоту меню, щоб не перекрива
         top = $(id).offset().top
      // анімація переходу блоку в мс
      $('body,html').animate({ scrollTop: top }, 1000);
   });
});

//hideLogo

function logo() {
   let logo = $('.logo');
   $(window).on('scroll', () => {
      if ($(window).scrollTop() >= 100 && $(window).width() <= 1310) {
         logo.fadeOut();
      }
      else {
         logo.fadeIn();
      }
   });
}
logo();

//topBtn

function backToTop() {
   let button = $('.top-btn');
   $(window).on('scroll', () => {
      if ($(window).scrollTop() >= 50 && $(window).width() >= 1310) {
         button.fadeIn();
      }
      else {
         button.fadeOut();
      }
   });
   button.on('click', (e) => {
      e.preventDefault();
      $('html').animate({ scrollTop: 0 }, 1000);
   })
}
backToTop();