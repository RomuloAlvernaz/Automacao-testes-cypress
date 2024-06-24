/// <reference types="cypress" />

describe('GUI - Testes relacionados ao login', () => {

    it('TC001 - não deve ser possível efetuar login sem informar e-mail e senha', () => {
        
        cy.visit('http://127.0.0.1:5500/login.html'); 
        cy.get('#btn-entrar').click(); 
        cy.get('.alert').should('contain', 'Informe usuário e senha, os campos não podem ser brancos.'); 

    });
    it('TC002 - não deve ser possível efetuar login com email e senha inválidos', () => {
        
        cy.visit('http://127.0.0.1:5500/login.html'); 
        cy.get('#email').type('teste@teste.com');
        cy.get('#senha').type('admin@456');
        cy.get('#btn-entrar').click(); 
        cy.get('.alert').should('contain', 'E-mail ou senha inválidos'); 

    });
    it('TC003 - não deve ser possível efetuar login com email válido e senha inválida', () => {
        
        cy.visit('http://127.0.0.1:5500/login.html'); 
        cy.get('#email').type('admin@admin.com');
        cy.get('#senha').type('admin@456');
        cy.get('#btn-entrar').click(); 
        cy.get('.alert').should('contain', 'E-mail ou senha inválidos'); 

    });
    it('TC004 - não deve ser possível efetuar login com email inválido e senha válida', () => {
        
        cy.visit('http://127.0.0.1:5500/login.html'); 
        cy.get('#email').type('teste@teste.com');
        cy.get('#senha').type('admin@123');
        cy.get('#btn-entrar').click(); 
        cy.get('.alert').should('contain', 'E-mail ou senha inválidos'); 

    });
    it.only('TC005 - Deve rejeitar senhas que excedem o limite máximo de caracteres', () => {
        const longPassword = 'a'.repeat(51); // Supondo que o limite máximo seja 50 caracteres
        cy.visit('http://127.0.0.1:5500/login.html'); 
        cy.get('#email').type('admin@admin.com');
        cy.get('#senha').type(longPassword).should('have.value', longPassword.slice(0, 50)); // Espera que o campo aceite apenas os primeiros 50 caracteres
        cy.get('#btn-entrar').click();
        cy.get('.alert').should('contain', 'Senha não pode exceder 50 caracteres');
    });
    it('TC006 - Deve ser possível efetuar login com email e senha válidos', () => {
        
        cy.visit('http://127.0.0.1:5500/login.html'); 
        cy.get('#email').type('admin@admin.com');
        cy.get('#senha').type('admin@123');
        cy.get('#btn-entrar').click(); 
        
    });
});