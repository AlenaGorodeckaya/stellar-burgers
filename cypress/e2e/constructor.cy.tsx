import { Ingredients } from '../../src/test-utils';
import { completedOrder } from '../../src/test-utils';
describe('Конструктор космических бургеров', () => {
  const { craterBun } = Ingredients.bun;
  const { biocotelette } = Ingredients.main;
  const { spicySauce } = Ingredients.sauce;

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });

 describe('Тестирование добавления ингредиентов из списка в конструктор', () => {
    it('Булка добавляется в конструктор при клике на "+Добавить"', () => {
      cy.get(`[data-testid="ingredient-id-${craterBun._id}"]`)
        .find('button:contains("Добавить")')
        .click();

      cy.get('[data-testid="constructor-element-top"]')
        .should('contain', `${craterBun.name} (верх)`);
      cy.get('[data-testid="constructor-element-bottom"]')
        .should('contain', `${craterBun.name} (низ)`);
    });

    it('Начинка добавляется в конструктор при клике на "+Добавить"', () => {
      cy.get(`[data-testid="ingredient-id-${biocotelette._id}"]`)
        .find('button:contains("Добавить")')
        .click();

      cy.get('[data-testid="constructor-elements-list"]')
        .should('contain', biocotelette.name);
    });

    it('Соус добавляется в конструктор при клике на "+Добавить"', () => {
      cy.get(`[data-testid="ingredient-id-${spicySauce._id}"]`)
        .find('button:contains("Добавить")')
        .click();

      cy.get('[data-testid="constructor-elements-list"]')
        .should('contain', spicySauce.name);
    });
  });

  describe('Тестирование работы модальных окон', () => {
    it('Открытие модального окна', () => {
      cy.get(`[data-testid="ingredient-id-${craterBun._id}"]`).click();
      cy.get('#modals').should('contain', 'Детали ингредиента');
      cy.get('#modals').should('contain', craterBun.name);
    });

    it('Закрытие модального окна по клику на крестик', () => {
      cy.get(`[data-testid="ingredient-id-${craterBun._id}"]`).click();
      cy.get('[data-testid="modal-close-button"]').click();
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('Закрытие модального окна по клику на оверле', () => {
      cy.get(`[data-testid="ingredient-id-${craterBun._id}"]`).click();
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

    describe('Тестирование создание заказа', () => {
    const orderNumber = completedOrder.number;

    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
        // Моковые данные ответа на запрос данных пользователя
        cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
        //Подставляются моковые токены авторизации
        window.localStorage.setItem('refreshToken', JSON.stringify('test-refresh-token'));
        cy.setCookie('accessToken', 'test-access-token');
        // Моковые данные ответа на запрос создания заказа
        cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
        cy.visit('http://localhost:4000');
    });

    afterEach(() => {
        cy.clearAllLocalStorage();
        cy.clearCookies();
    });

    it('Сборка бургера', () => {
        const bun = cy.get(`[data-testid="ingredient-id-${craterBun._id}"]`);
        const addBunButton = bun.contains('button', 'Добавить');
        addBunButton.click();
        
        cy.get('[data-testid="constructor-element-top"]')
        .contains(`${craterBun.name} (верх)`)
        .should('exist');
        cy.get('[data-testid="constructor-element-bottom"]')
        .contains(`${craterBun.name} (низ)`)
        .should('exist');

        const cutlet = cy.get(`[data-testid="ingredient-id-${biocotelette._id}"]`);
        const sauce = cy.get(`[data-testid="ingredient-id-${spicySauce._id}"]`);
        
        cutlet.contains('button', 'Добавить').click();
        sauce.contains('button', 'Добавить').click();

        cy.get('[data-testid="constructor-elements-list"]')
        .contains(spicySauce.name)
        .should('exist');
        cy.get('[data-testid="constructor-elements-list"]')
        .contains(biocotelette.name)
        .should('exist');

        cy.get('[data-testid="order-number"]').should('not.exist');
        cy.get('[data-testid="constructor-order-panel"]')
        .contains('Оформить заказ')
        .click();
        
        cy.get('[data-testid="order-number"]')
        .contains(orderNumber)
        .should('exist');
        
        cy.get('[data-testid="modal-close-button"]').click();
        cy.get('[data-testid="order-number"]').should('not.exist');

        cy.get('[data-testid="constructor-element-top"]').should('not.exist');
        cy.get('[data-testid="constructor-element-bottom"]').should('not.exist');
        cy.get('[data-testid="constructor-elements-list"]')
        .contains(spicySauce.name)
        .should('not.exist');
        cy.get('[data-testid="constructor-elements-list"]')
        .contains(biocotelette.name)
        .should('not.exist');
    });
    });
});
