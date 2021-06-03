import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    
    this.render();
    this.addEventListeners();
    this.value = '';
  }

  render() { //метод отрисовки элемента
    // создание кнопок и контейнера-навигации
    this.elem = createElement(`
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon" />
        </button>
        <nav class="ribbon__inner"></nav>
        <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon" />
        </button>
      </div>
    `);
    // создание пунктов навигации
    for (let category of this.categories) {
      let categoryElem = createElement(`<a href="#" class="ribbon__item"></a>`);
      categoryElem.textContent = category.name; // insert as text, not as HTML!
      categoryElem.dataset.id = category.id;
      this.elem.querySelector('.ribbon__inner').append(categoryElem);
    }
    //добавляем к .ribbon__ 'item' класс .ribbon__item_active (текущий пункт меню)
    this.sub('item').classList.add('ribbon__item_active');
  }

  addEventListeners() {
    //добавляем к .ribbon__ 'arrow_left'. Обработчик события onArrowLeftClick по клику
    this.sub('arrow_left').onclick = (event) => this.onArrowLeftClick(event);
    //добавляем к .ribbon__ 'arrow_right'. Обработчик события onArrowRightClick по клику
    this.sub('arrow_right').onclick = (event) => this.onArrowRightClick(event);

    // Обработчик по клику по пункту в навигации  
    this.elem.onclick = (event) => {
      //"ловим" клик на пункте навигации
      let itemElem = event.target.closest('.ribbon__item');
      if (itemElem) {

        this.onItemClick(itemElem); //запускает метод onItemClick
        event.preventDefault(); //останавливает действия браузера по умолчанию
      }
    };
    //добавляем к .ribbon__ inner обработчик при скролле запускать ивент onScroll
    this.sub('inner').onscroll = (event) => this.onScroll(event);
  }

  //событие по клику стрелки "вправо"
  onArrowRightClick(event) {
    let offset = 350;
    // ribbon__inner скролить на offset = 350
    this.sub('inner').scrollBy(offset, 0);
    //обновление стрелок (делать ли невидимой какую-то из кнопок?)
    this.updateArrows();
  }

  //событие по клику стрелки "влево"
  onArrowLeftClick(event) {
    let offset = 350;
    // ribbon__inner скролить на -offset = 350
    this.sub('inner').scrollBy(-offset, 0);
    //обновление стрелок (делать ли невидимой какую-то из кнопок?)
    this.updateArrows();
  }

  // метод отображения активного пункта навигации
  onItemClick(itemElem) {
    let oldActive = this.sub('item_active'); // ribbon__item_active
    if (oldActive) {
      oldActive.classList.remove('ribbon__item_active');
    }
    // itemElem = event.target.closest('.ribbon__item')
    itemElem.classList.add('ribbon__item_active');

    this.value = itemElem.dataset.id;

    this.elem.dispatchEvent(
      new CustomEvent('ribbon-select', {
        detail: this.value,
        bubbles: true,
      })
    );
  }
  // событие обновляет стрелки
  onScroll(event) {
    this.updateArrows();
  }

  sub(ref) { //добавление к имени класса .ribbon__ дополнительной части 
    return this.elem.querySelector(`.ribbon__${ref}`);
  }

  scrollRight() {
    // вернуть (число) ribbon__inner общую ширину прокрутки - свойство c текущим состоянием прокрутки - видимую ширину элемента
    return this.sub('inner').scrollWidth - (this.sub('inner').scrollLeft + this.sub('inner').clientWidth);
  }

  scrollLeft() {
    // вернуть (число) ribbon__inner scrollLeft(свойство c текущим состоянием прокрутки)
    return this.sub('inner').scrollLeft;
  }

  //обновление стрелок (делать ли невидимой?)
  updateArrows() {
    if (this.scrollLeft() > 0) {
      // если свойство scrollLeft больше 0 добавить к ribbon__ arrow_left класс ribbon__arrow_visible
      this.sub('arrow_left').classList.add('ribbon__arrow_visible');
    } else {
      this.sub('arrow_left').classList.remove('ribbon__arrow_visible');
    }

    let scrollRight = this.scrollRight();
    scrollRight = scrollRight < 1 ? 0 : scrollRight; // Это нужно для ситуации, когда скролл произошел с погрешностью
    if (scrollRight > 0) {
      this.sub('arrow_right').classList.add('ribbon__arrow_visible');
    } else {
      this.sub('arrow_right').classList.remove('ribbon__arrow_visible');
    }
  }


}
