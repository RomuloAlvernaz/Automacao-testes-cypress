/// <reference types="cypress" />

describe('GUI - testes relacionados ao cadastro de produtos', () => {

    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/login.html');
        cy.get('#email').type('admin@admin.com');
        cy.get('#senha').type('admin@123');
        cy.get('#btn-entrar').click();
        cy.url().should('include', '/produtos.html');
    });

    it('TC001 - Deve verificar se os títulos das colunas da tabela estão padronizados', () => {
        const expectedTitles = ['Código', 'Nome', 'Quantidade', 'Value', 'Create date'];

        cy.get('th').each(($th, index) => {
            const text = $th.text().trim();
            cy.log(`Verificando título da coluna: ${text}`);
            expect(text).to.equal(expectedTitles[index], `Esperado: ${expectedTitles[index]}, Encontrado: ${text}`);
        });
    });

    it('TC002 - Deve verificar se os títulos das colunas da tabela estão padronizados para Português', () => {
        const expectedTitles = ['Código', 'nome', 'Quantidade', 'Valor', 'Data cadastro'];

        // Verificar se os títulos em português estão presentes
        cy.get('table thead th').each(($th, index) => {
            const text = $th.text().trim();
            if (expectedTitles[index]) {
                expect(text).to.equal(expectedTitles[index], `Esperado: ${expectedTitles[index]}, Encontrado: ${text}`);
            }
        });
    });

    it('TC003 - Deve ser possível abrir o modal de cadastro ao clicar no botão "Criar"', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#cadastro-produto').should('be.visible');
    });
    it('TC004 - deve ser possível adicionar um produto com dados válidos', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#codigo').type('001');
        cy.get('#nome').type('Produto Teste');
        cy.get('#quantidade').type('10');
        cy.get('#valor').type('100');
        cy.get('#data').type('2024-06-23');
        cy.get('#btn-salvar').click();
        cy.get('#btn-sair').click();
        cy.get('table tbody').should('contain', 'Produto Teste');
    }); 
    it('TC005 - Não deve ser possível cadastrar o produto ao clicar em "Sair"', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#codigo').type('001');
        cy.get('#nome').type('Produto Teste');
        cy.get('#btn-sair').click();
        cy.get('#btn-sair').click();
        cy.get('table tbody').should('not.contain', 'Produto Teste');
    });
    it('TC006 - Não deve ser possível adicionar um produto sem preencher todos os campos', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#btn-salvar').click();
        cy.get('.alert').should('contain', 'Todos os campos são obrigatórios para o cadastro!');
    });
    it('TC007 - Deve aceitar apenas números no campo "quantidade"', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#quantidade').type('abc').should('have.value', '');
        cy.get('#quantidade').type('123').should('have.value', '123');
    });
    it('TC008 - Deve aceitar apenas valores no formato monetário no campo "valor"', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#valor').type('abc').should('have.value', '');
        cy.get('#valor').type('123.45').should('have.value', '123.45');
        cy.get('#valor').type('123,45').should('have.value', '123,45'); // caso aceite vírgulas como separador decimal
    });
    it('TC009 - Deve aceitar apenas valores numéricos no campo "quantidade"', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#quantidade').type('abc').should('have.value', '');
        cy.get('#quantidade').type('123').should('have.value', '123');
    });
    it('TC010 - Deve aceitar somente datas até o dia corrente no campo "data cadastro"', () => {
        const today = new Date().toISOString().split('T')[0];
        const futureDate = '2999-12-31';

        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#data').type(futureDate).should('have.value', '');
        cy.get('#data').type(today).should('have.value', today);
    });
    it('TC011 - Deve aceitar apenas valores numéricos no campo "data cadastro"', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#data').type('abc').should('have.value', '');
        cy.get('#data').type('123').should('have.value', '123');
    });
    it('TC012 - Deve exibir corretamente a data selecionada no calendário', () => {
        const today = new Date().toISOString().split('T')[0];
        
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#data').type(today).should('have.value', today);
    });
    it('TC013 - Deve validar corretamente a data inserida manualmente', () => {
        const validDate = new Date().toISOString().split('T')[0];

        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#data').type(validDate).should('have.value', validDate);
    });
    it('TC014 - Não deve ser possível cadastrar um produto com caracteres especiais ou letras nos campos numéricos', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#quantidade').type('!@#').should('have.value', '');
        cy.get('#quantidade').type('abc').should('have.value', '');
        cy.get('#quantidade').type('123').should('have.value', '123');
        cy.get('#valor').type('!@#').should('have.value', '');
        cy.get('#valor').type('abc').should('have.value', '');
        cy.get('#valor').type('123.45').should('have.value', '123.45');
    });
    it('TC015 - deve ser possível editar um produto já cadastrado', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#codigo').type('001');
        cy.get('#nome').type('Produto Teste');
        cy.get('#quantidade').type('10');
        cy.get('#valor').type('100');
        cy.get('#data').type('2024-06-23');
        cy.get('#btn-salvar').click();
        cy.get('#btn-sair').click();
        cy.get('table tbody').should('contain', 'Produto Teste');
        cy.get('table tbody tr:first-child td:last-child button:contains("Editar")').click();
        cy.get('#cadastro-produto').should('be.visible');
    });
    it('TC016 - deve ser possível excluir um produto já cadastrado', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#codigo').type('001');
        cy.get('#nome').type('Produto Teste');
        cy.get('#quantidade').type('10');
        cy.get('#valor').type('100');
        cy.get('#data').type('2024-06-23');
        cy.get('#btn-salvar').click();
        cy.get('#btn-sair').click();
        cy.get('table tbody').should('contain', 'Produto Teste');
        cy.get('table tbody tr:first-child td:last-child button:contains("Excluir")').click();
        cy.get('#cadastro-produto').should('be.visible');
    });
    it('TC017 - Deve ser possível fechar o modal ao clicar no "X" no canto superior direito', () => {
        cy.get('#btn-adicionar').click();
        cy.get('#btn-adicionar').click();
        cy.get('#cadastro-produto').should('be.visible');
        cy.get('.modal-header .close').click();
        cy.get('#cadastro-produto').should('not.be.visible');
    });
    it('TC018 - Deve existir o botão "logout" ou "sair" no canto superior direito', () => {
        cy.get('nav').find('a.nav-link').contains('Sair').should('exist');
    });
    it.only('TC019 - Deve ser possível sair do sistema e voltar para a página de login', () => {
        cy.get('nav').find('a.nav-link').contains('Sair').click();
        cy.url().should('include', '/login.html');
    });

});