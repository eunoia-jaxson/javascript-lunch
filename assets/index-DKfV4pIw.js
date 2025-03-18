var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _$target, _isOpen, _Modal_instances, mount_fn, template_fn, _addRestaurant, _AddRestaurantModal_instances, addEventListeners_fn, _handleSubmit, validateData_fn, _$target2, _selectedCategory, _selectedSorting, _onCategoryChange, _onSortingChange, _FilterBar_instances, options_fn, template_fn2, bindEvents_fn, _handleCategoryChange, _handleSortingChange, _selectedCategory2, _selectedSorting2, _restaurantManager, _renderMainArea, _activeTab, _TabManager_instances, setupTabListeners_fn, switchTab_fn, _restaurant, _onToggleFavorite, _onDeleteRestaurant, _RestaurantDetailModal_instances, addEventListeners_fn2, removeEventListeners_fn, _handleDelete, _handleFavoriteToggle, _restaurants, _onToggleFavorite2, _onDeleteRestaurant2, _updateList, _RestaurantList_instances, createTemplateElement_fn, addEventListeners_fn3, _$main, _filterManager, _restaurants2, _RestaurantManager_instances, renderList_fn, _restaurants3, _$target3, _filterBarManager, _tabManager, _restaurantManager2, _App_instances, template_fn3, init_fn, mount_fn2, renderMainArea_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const Header = () => {
  return (
    /*html*/
    `
    <header class="gnb">
      <h1 class="gnb__title text-title">점심 뭐 먹지</h1>
      <button type="button" class="gnb__button" aria-label="음식점 추가" data-testid="open-add-restaurant-modal-button">
        <img src="./icons/add-button.png" alt="음식점 추가">
      </button>
    </header>
  `
  );
};
const TabBar = () => {
  const template = document.createElement("template");
  template.innerHTML = /* html */
  `
    <section class="tab-bar">
      <button class="tab-bar__button active" id="list-tab" data-testid="list-tab">모든 음식점</button>
      <button class="tab-bar__button" id="favorite-tab" data-testid="favorite-tab">자주 가는 음식점</button>
    </section>
  `.trim();
  return template.content;
};
class Modal {
  constructor($target) {
    __privateAdd(this, _Modal_instances);
    __privateAdd(this, _$target);
    __privateAdd(this, _isOpen, false);
    __privateSet(this, _$target, $target);
    this.handleClose = this.close.bind(this);
  }
  contents() {
    return "";
  }
  open() {
    if (!__privateGet(this, _isOpen)) {
      __privateSet(this, _isOpen, true);
      __privateGet(this, _$target).insertAdjacentHTML("beforeend", __privateMethod(this, _Modal_instances, template_fn).call(this));
      __privateMethod(this, _Modal_instances, mount_fn).call(this);
    }
  }
  close() {
    if (__privateGet(this, _isOpen)) {
      __privateSet(this, _isOpen, false);
      __privateGet(this, _$target).replaceChildren();
    }
  }
  getIsOpen() {
    return __privateGet(this, _isOpen);
  }
  getTarget() {
    return __privateGet(this, _$target);
  }
}
_$target = new WeakMap();
_isOpen = new WeakMap();
_Modal_instances = new WeakSet();
mount_fn = function() {
  const $backdrop = __privateGet(this, _$target).querySelector(".modal-backdrop");
  if ($backdrop) {
    $backdrop.removeEventListener("click", this.handleClose);
    $backdrop.addEventListener("click", this.handleClose);
  }
};
template_fn = function() {
  if (!__privateGet(this, _isOpen)) return "";
  return (
    /* html */
    `
      <div class="modal" data-testid="modal">
        <div class="modal-backdrop" data-testid="modal-backdrop"></div>
        <div id="modal-container" class="modal-container">
          ${this.contents()}
        </div>
      </div>
    `
  );
};
const FormFieldContainer = ({ contents, required, label, name }) => {
  return (
    /* html */
    `
    <div class="form-item ${required ? "form-item--required" : ""}">
      <label for="${name}" class="text-caption">${label}</label>
      ${contents}
    </div>
  `
  );
};
const RESTAURANT_CONSTRAINTS = Object.freeze({
  MAX_RESTAURANT_NAME: 15,
  MIN_RESTAURANT_NAME: 1,
  MAX_DESCRIPTION_TEXT_LENGTH: 300
});
const FILTER_OPTIONS = Object.freeze({
  DISTANCES: Object.freeze([5, 10, 15, 20, 30]),
  CATEGORIES: Object.freeze(["한식", "중식", "일식", "양식", "아시안", "기타"]),
  ALL_CATEGORY: "전체",
  SORTING: Object.freeze(["name", "distance"])
});
const MESSAGES = Object.freeze({
  DELETE_MESSAGE: "정말 삭제하시겠습니까?"
});
const Category = () => {
  const label = "카테고리";
  const name = "category";
  const required = true;
  const contents = (
    /*html*/
    `
    <select name="category" id="category" required data-testid="category">
      <option value="">선택해 주세요</option>
      ${FILTER_OPTIONS.CATEGORIES.map(
      (option) => `<option value="${option}">${option}</option>`
    ).join("")}
    </select>
  `
  );
  return FormFieldContainer({ contents, required, label, name });
};
const RestaurantName = () => {
  const label = "이름";
  const name = "name";
  const required = true;
  const contents = (
    /*html*/
    `
    <input type="text" name="name" id="name" required minlength="${RESTAURANT_CONSTRAINTS.MIN_RESTAURANT_NAME}" maxlength="${RESTAURANT_CONSTRAINTS.MAX_RESTAURANT_NAME}" data-testid="restaurant-name" autocomplete="off" />
  `
  );
  return FormFieldContainer({ contents, required, label, name });
};
const Distance = () => {
  const label = "거리(도보 이동 시간)";
  const name = "distance";
  const required = true;
  const contents = (
    /* html */
    `
    <select name="distance" id="distance" required data-testid="distance">
      <option value="">선택해 주세요</option>
      ${FILTER_OPTIONS.DISTANCES.map(
      (option) => `<option value="${option}">${option}분 내</option>`
    ).join("")};
    </select>
  `
  );
  return FormFieldContainer({ contents, required, label, name });
};
const Description = () => {
  const label = "설명";
  const name = "description";
  const required = false;
  const contents = (
    /*html*/
    `
    <textarea name="description" id="description" cols="30" rows="5" maxlength="${RESTAURANT_CONSTRAINTS.MAX_DESCRIPTION_TEXT_LENGTH}" data-testid="description"></textarea>
    <span class="help-text text-caption">메뉴 등 추가 정보를 입력해 주세요.</span>
  `
  );
  return FormFieldContainer({ contents, required, label, name });
};
const Link = () => {
  const label = "참고 링크";
  const name = "link";
  const required = false;
  const contents = (
    /* html */
    `
    <input type="text" name="link" id="link" data-testid="link" />
    <span class="help-text text-caption">매장 정보를 확인할 수 있는 링크를 입력해 주세요.</span>
  `
  );
  return FormFieldContainer({ label, name, required, contents });
};
const toThrowNewError = ({ condition, message }) => {
  if (condition) {
    throw new Error(message);
  }
};
const validateCategory = (category) => {
  toThrowNewError({
    condition: !category.trim(),
    message: "카테고리를 선택해주세요."
  });
  toThrowNewError({
    condition: !FILTER_OPTIONS.CATEGORIES.includes(category),
    message: "카테고리는 한식, 중식, 일식, 양식, 아시안, 기타 중 하나여야 합니다."
  });
};
const validateRestaurantName = (name) => {
  toThrowNewError({
    condition: name.trim().length < RESTAURANT_CONSTRAINTS.MIN_RESTAURANT_NAME || name.trim().length > RESTAURANT_CONSTRAINTS.MAX_RESTAURANT_NAME,
    message: `음식점 이름을 최소 ${RESTAURANT_CONSTRAINTS.MIN_RESTAURANT_NAME}글자 ~ 최대 ${RESTAURANT_CONSTRAINTS.MAX_RESTAURANT_NAME}글자 입력해주세요.`
  });
};
const validateDistance = (distance) => {
  toThrowNewError({
    condition: !distance,
    message: "거리(도보 이동 시간)를 선택해주세요."
  });
  toThrowNewError({
    condition: !FILTER_OPTIONS.DISTANCES.includes(parseInt(distance, 10)),
    message: "거리(도보 이동 시간)는 5분, 10분, 15분, 20분, 30분 중 하나여야 합니다."
  });
};
const validateDescription = (description) => {
  toThrowNewError({
    condition: description.length > RESTAURANT_CONSTRAINTS.MAX_DESCRIPTION_TEXT_LENGTH,
    message: `설명은 ${RESTAURANT_CONSTRAINTS.MIN_DESCRIPTION_TEXT_LENGTH}자 이상 ${RESTAURANT_CONSTRAINTS.MAX_DESCRIPTION_TEXT_LENGTH}자 이하여야 합니다.`
  });
};
const regularUrl = /^(https?:\/\/)?([\w\d.-]+)\.([a-z.]{2,6})(\/[\w\d.-]*)*\/?$/i;
const validateLink = (link) => {
  toThrowNewError({
    condition: link !== "" && !regularUrl.test(link),
    message: `잘못된 링크 형식입니다.`
  });
};
class AddRestaurantModal extends Modal {
  constructor($target, addRestaurant2) {
    super($target);
    __privateAdd(this, _AddRestaurantModal_instances);
    __privateAdd(this, _addRestaurant);
    __privateAdd(this, _handleSubmit, (event) => {
      event.preventDefault();
      try {
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data["isFavorite"] = false;
        __privateMethod(this, _AddRestaurantModal_instances, validateData_fn).call(this, data);
        __privateGet(this, _addRestaurant).call(this, data);
        this.close();
      } catch (error) {
        alert(error.message);
      }
    });
    __privateSet(this, _addRestaurant, addRestaurant2);
  }
  contents() {
    return (
      /*html */
      `
      <h2 class="modal-title text-title">새로운 음식점</h2>
      <form id='add-restaurant-form' data-testid='add-restaurant-form'>
        ${Category()}
        ${RestaurantName()}
        ${Distance()}
        ${Description()}
        ${Link()}

        <div class="button-container">
          <button type="button" id="cancel-add-restaurant-form" class="button button--secondary text-caption" data-testid="cancel-add-restaurant-form">취소하기</button>
          <button class="button button--primary text-caption">추가하기</button>
        </div>
      </form>
    `
    );
  }
  open() {
    super.open();
    if (this.getIsOpen()) {
      __privateMethod(this, _AddRestaurantModal_instances, addEventListeners_fn).call(this);
    }
  }
}
_addRestaurant = new WeakMap();
_AddRestaurantModal_instances = new WeakSet();
addEventListeners_fn = function() {
  const $cancelButton = document.querySelector("#cancel-add-restaurant-form");
  const $addForm = document.querySelector("#add-restaurant-form");
  $cancelButton.removeEventListener("click", this.handleClose);
  $addForm.removeEventListener("submit", __privateGet(this, _handleSubmit));
  $cancelButton.addEventListener("click", this.handleClose);
  $addForm.addEventListener("submit", __privateGet(this, _handleSubmit));
};
_handleSubmit = new WeakMap();
validateData_fn = function(data) {
  const { category, name, distance, description, link } = data;
  validateCategory(category);
  validateRestaurantName(name);
  validateDistance(distance);
  validateDescription(description);
  validateLink(link);
};
class FilterBar {
  constructor($target, { selectedCategory, selectedSorting, onCategoryChange, onSortingChange }) {
    __privateAdd(this, _FilterBar_instances);
    __privateAdd(this, _$target2);
    __privateAdd(this, _selectedCategory);
    __privateAdd(this, _selectedSorting);
    __privateAdd(this, _onCategoryChange);
    __privateAdd(this, _onSortingChange);
    __privateAdd(this, _handleCategoryChange, (event) => {
      const selectedCategory = event.target.value;
      if (__privateGet(this, _onCategoryChange)) {
        __privateGet(this, _onCategoryChange).call(this, selectedCategory);
      }
    });
    __privateAdd(this, _handleSortingChange, (event) => {
      const selectedSorting = event.target.value;
      if (__privateGet(this, _onSortingChange)) {
        __privateGet(this, _onSortingChange).call(this, selectedSorting);
      }
    });
    __privateSet(this, _$target2, $target);
    __privateSet(this, _selectedCategory, selectedCategory);
    __privateSet(this, _selectedSorting, selectedSorting);
    __privateSet(this, _onCategoryChange, onCategoryChange);
    __privateSet(this, _onSortingChange, onSortingChange);
    const template = document.createElement("template");
    template.innerHTML = __privateMethod(this, _FilterBar_instances, template_fn2).call(this).trim();
    __privateGet(this, _$target2).appendChild(template.content.firstElementChild);
    __privateGet(this, _$target2).querySelector("#category-filter").value = __privateGet(this, _selectedCategory);
    __privateGet(this, _$target2).querySelector("#sorting-filter").value = __privateGet(this, _selectedSorting);
    __privateMethod(this, _FilterBar_instances, bindEvents_fn).call(this);
  }
}
_$target2 = new WeakMap();
_selectedCategory = new WeakMap();
_selectedSorting = new WeakMap();
_onCategoryChange = new WeakMap();
_onSortingChange = new WeakMap();
_FilterBar_instances = new WeakSet();
options_fn = function() {
  return FILTER_OPTIONS.CATEGORIES.map((category) => {
    return (
      /*html*/
      `
        <option value="${category}">${category}</option>
      `
    );
  }).join("");
};
template_fn2 = function() {
  return (
    /*html*/
    `
    <section class="restaurant-filter-container">
      <select name="category" id="category-filter" class="restaurant-filter" data-testid="category-filter">
        <option value="${FILTER_OPTIONS.ALL_CATEGORY}">전체</option>
        ${__privateMethod(this, _FilterBar_instances, options_fn).call(this)}
      </select>

      <select name="sorting" id="sorting-filter" class="restaurant-filter" data-testid="sorting">
        <option value="${FILTER_OPTIONS.SORTING[0]}">이름순</option>
        <option value="${FILTER_OPTIONS.SORTING[1]}">거리순</option>
      </select>
    </section>
  `
  );
};
bindEvents_fn = function() {
  const $categoryFilter = __privateGet(this, _$target2).querySelector("#category-filter");
  const $sortingFilter = __privateGet(this, _$target2).querySelector("#sorting-filter");
  $categoryFilter.removeEventListener("change", __privateGet(this, _handleCategoryChange));
  $sortingFilter.removeEventListener("change", __privateGet(this, _handleSortingChange));
  $categoryFilter.addEventListener("change", __privateGet(this, _handleCategoryChange));
  $sortingFilter.addEventListener("change", __privateGet(this, _handleSortingChange));
};
_handleCategoryChange = new WeakMap();
_handleSortingChange = new WeakMap();
class FilterManager {
  constructor() {
    __privateAdd(this, _selectedCategory2, FILTER_OPTIONS.ALL_CATEGORY);
    __privateAdd(this, _selectedSorting2, FILTER_OPTIONS.SORTING[0]);
  }
  render($main, onFilterChange) {
    new FilterBar($main, {
      selectedCategory: __privateGet(this, _selectedCategory2),
      selectedSorting: __privateGet(this, _selectedSorting2),
      onCategoryChange: (selected) => {
        __privateSet(this, _selectedCategory2, selected);
        onFilterChange();
      },
      onSortingChange: (selected) => {
        __privateSet(this, _selectedSorting2, selected);
        onFilterChange();
      }
    });
  }
  getSelectedCategory() {
    return __privateGet(this, _selectedCategory2);
  }
  getSelectedSorting() {
    return __privateGet(this, _selectedSorting2);
  }
}
_selectedCategory2 = new WeakMap();
_selectedSorting2 = new WeakMap();
class TabManager {
  constructor(restaurantManager, renderMainArea) {
    __privateAdd(this, _TabManager_instances);
    __privateAdd(this, _restaurantManager);
    __privateAdd(this, _renderMainArea);
    __privateAdd(this, _activeTab);
    __privateSet(this, _restaurantManager, restaurantManager);
    __privateSet(this, _renderMainArea, renderMainArea);
    __privateSet(this, _activeTab, "list");
    __privateMethod(this, _TabManager_instances, setupTabListeners_fn).call(this);
  }
  getIsFavoriteTabActive() {
    return __privateGet(this, _activeTab) === "favorite";
  }
}
_restaurantManager = new WeakMap();
_renderMainArea = new WeakMap();
_activeTab = new WeakMap();
_TabManager_instances = new WeakSet();
setupTabListeners_fn = function() {
  const $listTab = document.querySelector("#list-tab");
  const $favoriteTab = document.querySelector("#favorite-tab");
  $listTab.addEventListener("click", () => __privateMethod(this, _TabManager_instances, switchTab_fn).call(this, "list"));
  $favoriteTab.addEventListener("click", () => __privateMethod(this, _TabManager_instances, switchTab_fn).call(this, "favorite"));
};
switchTab_fn = function(type) {
  if (__privateGet(this, _activeTab) === type) return;
  __privateSet(this, _activeTab, type);
  const $listTab = document.querySelector("#list-tab");
  const $favoriteTab = document.querySelector("#favorite-tab");
  if (type === "list") {
    $listTab.classList.add("active");
    $favoriteTab.classList.remove("active");
    __privateGet(this, _renderMainArea).call(this);
    return;
  }
  $listTab.classList.remove("active");
  $favoriteTab.classList.add("active");
  __privateGet(this, _restaurantManager).renderFavoriteList();
};
const RestaurantContent = ({ restaurant }) => {
  return (
    /*html */
    `
    <div class="mt-16 gap-16 mb-32">
      <h3 class="restaurant__name text-subtitle">${restaurant.name}</h3>
      <span class="restaurant__distance text-body">캠퍼스부터 ${restaurant.distance}분 내</span>
      <p class="text-body">${restaurant.description}</p>
      <a href="${restaurant.link}" class="text-caption link" target="_blank" rel="noopener noreferrer">${restaurant.link}</a>
    </div>
  `
  );
};
class RestaurantDetailModal extends Modal {
  constructor($target, { restaurant, onToggleFavorite, onDeleteRestaurant }) {
    super($target);
    __privateAdd(this, _RestaurantDetailModal_instances);
    __privateAdd(this, _restaurant);
    __privateAdd(this, _onToggleFavorite);
    __privateAdd(this, _onDeleteRestaurant);
    __privateAdd(this, _handleDelete, () => {
      try {
        if (!confirm(MESSAGES.DELETE_MESSAGE)) return;
        if (__privateGet(this, _onDeleteRestaurant)) {
          __privateGet(this, _onDeleteRestaurant).call(this, __privateGet(this, _restaurant).id);
        }
        this.close();
      } catch (error) {
        alert(error.message);
      }
    });
    __privateAdd(this, _handleFavoriteToggle, () => {
      if (__privateGet(this, _onToggleFavorite)) {
        __privateGet(this, _onToggleFavorite).call(this, __privateGet(this, _restaurant).id);
      }
      __privateGet(this, _restaurant).isFavorite = !__privateGet(this, _restaurant).isFavorite;
      const $favoriteIcon = this.getTarget().querySelector(".favorite-icon");
      $favoriteIcon.src = __privateGet(this, _restaurant).isFavorite ? "./icons/favorite-icon-filled.png" : "./icons/favorite-icon-lined.png";
      $favoriteIcon.alt = __privateGet(this, _restaurant).isFavorite ? "favorite" : "not-favorite";
    });
    __privateSet(this, _restaurant, restaurant);
    __privateSet(this, _onToggleFavorite, onToggleFavorite);
    __privateSet(this, _onDeleteRestaurant, onDeleteRestaurant);
  }
  contents() {
    const imageSource = {
      한식: "category-korean.png",
      중식: "category-chinese.png",
      일식: "category-japanese.png",
      양식: "category-western.png",
      아시안: "category-asian.png",
      기타: "category-etc.png"
    };
    return (
      /*html */
      `
      <div class="space-between">
        <div class="restaurant__category">
          <img src="./icons/${imageSource[__privateGet(this, _restaurant).category]}" alt="${__privateGet(this, _restaurant).category}" class="category-icon" />
        </div>
        <img src="${__privateGet(this, _restaurant).isFavorite ? "./icons/favorite-icon-filled.png" : "./icons/favorite-icon-lined.png"}" alt="${__privateGet(this, _restaurant).isFavorite ? "favorite" : "not-favorite"}" class="favorite-icon" data-testid="favorite-button" />
      </div>
      ${RestaurantContent({ restaurant: __privateGet(this, _restaurant) })}
      <div class="button-container">
        <button type="button" id="delete-restaurant" class="button button--secondary text-caption" data-testid="delete-restaurant">삭제하기</button>
        <button id="close-modal" class="button button--primary text-caption" data-testid="close-modal">닫기</button>
      </div>
    `
    );
  }
  open() {
    super.open();
    if (this.getIsOpen()) {
      __privateMethod(this, _RestaurantDetailModal_instances, addEventListeners_fn2).call(this);
    }
  }
  close() {
    __privateMethod(this, _RestaurantDetailModal_instances, removeEventListeners_fn).call(this);
    super.close();
  }
}
_restaurant = new WeakMap();
_onToggleFavorite = new WeakMap();
_onDeleteRestaurant = new WeakMap();
_RestaurantDetailModal_instances = new WeakSet();
addEventListeners_fn2 = function() {
  const $deleteButton = this.getTarget().querySelector("#delete-restaurant");
  const $closeButton = this.getTarget().querySelector("#close-modal");
  const $favoriteIcon = this.getTarget().querySelector(".favorite-icon");
  $deleteButton.addEventListener("click", __privateGet(this, _handleDelete));
  $closeButton.addEventListener("click", this.handleClose);
  $favoriteIcon.addEventListener("click", __privateGet(this, _handleFavoriteToggle));
};
removeEventListeners_fn = function() {
  const $deleteButton = this.getTarget().querySelector("#delete-restaurant");
  const $closeButton = this.getTarget().querySelector("#close-modal");
  const $favoriteIcon = this.getTarget().querySelector(".favorite-icon");
  $deleteButton.removeEventListener("click", __privateGet(this, _handleDelete));
  $closeButton.removeEventListener("click", this.handleClose);
  $favoriteIcon.removeEventListener("click", __privateGet(this, _handleFavoriteToggle));
};
_handleDelete = new WeakMap();
_handleFavoriteToggle = new WeakMap();
const RestaurantItem = ({
  id,
  category,
  name,
  distance,
  description,
  isFavorite
}) => {
  const imageSource = {
    한식: "category-korean.png",
    중식: "category-chinese.png",
    일식: "category-japanese.png",
    양식: "category-western.png",
    아시안: "category-asian.png",
    기타: "category-etc.png"
  };
  return (
    /* html */
    `
    <li class="restaurant" data-id="${id}">
      <div class="restaurant__category">
        <img src="./icons/${imageSource[category]}" alt="${category}" class="category-icon" data-testid="restaurant-category" />
      </div>
      <div class="restaurant__info">
        <div class="restaurant__header">
          <div>
            <h3 class="restaurant__name text-subtitle">${name}</h3>
            <span class="restaurant__distance text-body">캠퍼스부터 ${distance}분 내</span>
          </div>
          <img src="${isFavorite ? "./icons/favorite-icon-filled.png" : "./icons/favorite-icon-lined.png"}" alt="${isFavorite ? "favorite" : "not-favorite"}" class="favorite-icon" data-testid="favorite-icon" />
        </div>
        <p class="restaurant__description text-body">${description}</p>
      </div>
    </li>
  `
  );
};
class RestaurantList {
  constructor(restaurants, { onToggleFavorite, onDeleteRestaurant, updateList }) {
    __privateAdd(this, _RestaurantList_instances);
    __privateAdd(this, _restaurants);
    __privateAdd(this, _onToggleFavorite2);
    __privateAdd(this, _onDeleteRestaurant2);
    __privateAdd(this, _updateList);
    __privateSet(this, _restaurants, restaurants);
    __privateSet(this, _onToggleFavorite2, onToggleFavorite);
    __privateSet(this, _onDeleteRestaurant2, onDeleteRestaurant);
    __privateSet(this, _updateList, updateList);
  }
  render() {
    const $element = __privateMethod(this, _RestaurantList_instances, createTemplateElement_fn).call(this);
    __privateMethod(this, _RestaurantList_instances, addEventListeners_fn3).call(this, $element);
    return $element;
  }
}
_restaurants = new WeakMap();
_onToggleFavorite2 = new WeakMap();
_onDeleteRestaurant2 = new WeakMap();
_updateList = new WeakMap();
_RestaurantList_instances = new WeakSet();
createTemplateElement_fn = function() {
  const htmlString = (
    /* html */
    `
      <section class="restaurant-list-container">
        <ul id="restaurant-list" class="restaurant-list" data-testid="restaurant-list">
          ${__privateGet(this, _restaurants).map(RestaurantItem).join("")}
        </ul>
      </section>
    `
  );
  const $template = document.createElement("template");
  $template.innerHTML = htmlString.trim();
  return $template.content.firstElementChild;
};
addEventListeners_fn3 = function($element) {
  const $lis = $element.querySelectorAll(".restaurant");
  $lis.forEach(($li) => {
    const restaurantId = $li.dataset.id;
    const $favoriteIcon = $li.querySelector(".favorite-icon");
    $favoriteIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      if (__privateGet(this, _onToggleFavorite2)) {
        __privateGet(this, _onToggleFavorite2).call(this, restaurantId);
      }
      if (__privateGet(this, _updateList)) {
        __privateGet(this, _updateList).call(this);
      }
    });
    $li.addEventListener("click", () => {
      const targetRestaurant = __privateGet(this, _restaurants).find(
        (restaurant) => restaurant.id === restaurantId
      );
      const $detailModal = new RestaurantDetailModal(
        document.querySelector("#modal"),
        {
          restaurant: targetRestaurant,
          onToggleFavorite: __privateGet(this, _onToggleFavorite2),
          onDeleteRestaurant: __privateGet(this, _onDeleteRestaurant2)
        }
      );
      $detailModal.open();
    });
  });
};
function filterAndSortRestaurants(restaurants, category, sorting) {
  let filteredRestaurants = [...restaurants];
  if (category !== FILTER_OPTIONS.ALL_CATEGORY) {
    filteredRestaurants = filteredRestaurants.filter(
      (restaurant) => restaurant.category === category
    );
  }
  if (sorting === FILTER_OPTIONS.SORTING[1]) {
    filteredRestaurants.sort((a, b) => {
      const diff = a.distance - b.distance;
      return diff !== 0 ? diff : a.name.localeCompare(b.name, "ko");
    });
    return filteredRestaurants;
  }
  filteredRestaurants.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  return filteredRestaurants;
}
function getFavoriteRestaurants(restaurants) {
  return restaurants.filter((restaurant) => restaurant.isFavorite);
}
const API_URL = "https://67bec437b2320ee050114166.mockapi.io/api";
async function apiRequest(endpoint, options) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }
  return await response.json();
}
async function fetchRestaurants() {
  try {
    const data = await apiRequest("/restaurants", {
      method: "GET"
    });
    return data;
  } catch (error) {
    alert("데이터를 불러오지 못했습니다. 다시 시도해주세요.");
    return [];
  }
}
async function addRestaurant(restaurants, newRestaurant) {
  try {
    const createdRestaurant = await apiRequest("/restaurants", {
      method: "POST",
      body: JSON.stringify(newRestaurant)
    });
    return [...restaurants, createdRestaurant];
  } catch (error) {
    alert("음식점을 추가하지 못했습니다. 다시 시도해주세요.");
    return restaurants;
  }
}
async function deleteRestaurant(restaurants, restaurantId) {
  try {
    await apiRequest(`/restaurants/${restaurantId}`, {
      method: "DELETE"
    });
    return restaurants.filter((restaurant) => restaurant.id !== restaurantId);
  } catch (error) {
    alert("음식점을 삭제하지 못했습니다. 다시 시도해주세요.");
    return restaurants;
  }
}
async function toggleFavorite(restaurants, restaurantId) {
  const target = restaurants.find(
    (restaurant) => restaurant.id === restaurantId
  );
  if (!target) return restaurants;
  const updatedRestaurant = { ...target, isFavorite: !target.isFavorite };
  try {
    await apiRequest(`/restaurants/${restaurantId}`, {
      method: "PUT",
      body: JSON.stringify(updatedRestaurant)
    });
    return restaurants.map(
      (restaurant) => restaurant.id === restaurantId ? updatedRestaurant : restaurant
    );
  } catch (error) {
    alert("즐겨찾기를 업데이트하지 못했습니다. 다시 시도해주세요.");
    return restaurants;
  }
}
class RestaurantManager {
  constructor($main, filterManager, restaurants, getIsFavoriteTabActive) {
    __privateAdd(this, _RestaurantManager_instances);
    __privateAdd(this, _$main);
    __privateAdd(this, _filterManager);
    __privateAdd(this, _restaurants2);
    __privateSet(this, _$main, $main);
    __privateSet(this, _filterManager, filterManager);
    __privateSet(this, _restaurants2, restaurants);
    this.getIsFavoriteTabActive = getIsFavoriteTabActive;
  }
  renderRestaurantList() {
    const filtered = filterAndSortRestaurants(
      __privateGet(this, _restaurants2),
      __privateGet(this, _filterManager).getSelectedCategory(),
      __privateGet(this, _filterManager).getSelectedSorting()
    );
    __privateMethod(this, _RestaurantManager_instances, renderList_fn).call(this, __privateGet(this, _$main), filtered);
  }
  renderFavoriteList() {
    __privateGet(this, _$main).replaceChildren();
    const favorites = getFavoriteRestaurants(__privateGet(this, _restaurants2));
    __privateMethod(this, _RestaurantManager_instances, renderList_fn).call(this, __privateGet(this, _$main), favorites);
  }
  updateList() {
    if (this.getIsFavoriteTabActive()) {
      this.renderFavoriteList();
      return;
    }
    this.renderRestaurantList();
  }
  async handleAddRestaurant(newRestaurant) {
    __privateSet(this, _restaurants2, await addRestaurant(__privateGet(this, _restaurants2), newRestaurant));
    this.updateList();
  }
  async handleDeleteRestaurant(clickedId) {
    __privateSet(this, _restaurants2, await deleteRestaurant(__privateGet(this, _restaurants2), clickedId));
    this.updateList();
  }
  async handleToggleFavorite(clickedId) {
    __privateSet(this, _restaurants2, await toggleFavorite(__privateGet(this, _restaurants2), clickedId));
    this.updateList();
  }
}
_$main = new WeakMap();
_filterManager = new WeakMap();
_restaurants2 = new WeakMap();
_RestaurantManager_instances = new WeakSet();
renderList_fn = function($main, restaurants) {
  const $oldContainer = __privateGet(this, _$main).querySelector(
    ".restaurant-list-container"
  );
  const $newList = new RestaurantList(restaurants, {
    onToggleFavorite: this.handleToggleFavorite.bind(this),
    onDeleteRestaurant: this.handleDeleteRestaurant.bind(this),
    updateList: this.updateList.bind(this)
  }).render();
  if ($oldContainer) {
    $main.replaceChild($newList, $oldContainer);
    return;
  }
  $main.appendChild($newList);
};
class App {
  constructor($target) {
    __privateAdd(this, _App_instances);
    __privateAdd(this, _restaurants3, []);
    __privateAdd(this, _$target3);
    __privateAdd(this, _filterBarManager);
    __privateAdd(this, _tabManager);
    __privateAdd(this, _restaurantManager2);
    __privateSet(this, _$target3, $target);
    __privateGet(this, _$target3).appendChild(__privateMethod(this, _App_instances, template_fn3).call(this));
    this.$main = document.querySelector("main");
    const $tabContainer = __privateGet(this, _$target3).querySelector("#tab-container");
    $tabContainer.appendChild(TabBar());
    __privateSet(this, _filterBarManager, new FilterManager());
    __privateMethod(this, _App_instances, init_fn).call(this);
  }
}
_restaurants3 = new WeakMap();
_$target3 = new WeakMap();
_filterBarManager = new WeakMap();
_tabManager = new WeakMap();
_restaurantManager2 = new WeakMap();
_App_instances = new WeakSet();
template_fn3 = function() {
  const template = document.createElement("template");
  template.innerHTML = /* html */
  `
      ${Header()}
      <div id="tab-container"></div>
      <main></main>
      <div id="modal"></div>
    `.trim();
  return template.content;
};
init_fn = async function() {
  __privateSet(this, _restaurants3, await fetchRestaurants());
  __privateSet(this, _restaurantManager2, new RestaurantManager(
    this.$main,
    __privateGet(this, _filterBarManager),
    __privateGet(this, _restaurants3),
    () => false
  ));
  __privateSet(this, _tabManager, new TabManager(
    __privateGet(this, _restaurantManager2),
    __privateMethod(this, _App_instances, renderMainArea_fn).bind(this)
  ));
  __privateGet(this, _restaurantManager2).getIsFavoriteTabActive = __privateGet(this, _tabManager).getIsFavoriteTabActive.bind(__privateGet(this, _tabManager));
  __privateMethod(this, _App_instances, mount_fn2).call(this);
  __privateMethod(this, _App_instances, renderMainArea_fn).call(this);
};
mount_fn2 = function() {
  const $gnbButton = __privateGet(this, _$target3).querySelector(".gnb__button");
  const $addModal = new AddRestaurantModal(
    document.querySelector("#modal"),
    __privateGet(this, _restaurantManager2).handleAddRestaurant.bind(__privateGet(this, _restaurantManager2))
  );
  $gnbButton.addEventListener("click", () => $addModal.open());
};
renderMainArea_fn = function() {
  this.$main.replaceChildren();
  __privateGet(this, _filterBarManager).render(
    this.$main,
    __privateGet(this, _restaurantManager2).updateList.bind(__privateGet(this, _restaurantManager2))
  );
  __privateGet(this, _restaurantManager2).renderRestaurantList();
};
const $app = document.querySelector("#app");
new App($app);
