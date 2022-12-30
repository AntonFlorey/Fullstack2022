describe('Blog app', function() {
  beforeEach(function() {
    cy.clearLocalStorage()
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains("minttu")
    cy.contains("Login")
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get("#username").type("root")
      cy.get("#password").type("geheim")
      cy.get("#loginbutton").click()
      cy.contains("anton")
    })

    it('fails with wrong credentials', function() {
      cy.get("#username").type("root")
      cy.get("#password").type("falsch")
      cy.get("#loginbutton").click()
      cy.contains("Wrong credentials")
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
      username: 'root', password: 'geheim'
      }).then(response => {
        localStorage.setItem('loggedBlogAppUser', JSON.stringify(response.body))
        console.log(JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains("write blog").click()
      cy.get("input[placeholder=\"new blogs title\"]").type("test title")
      cy.get("input[placeholder=\"new blogs author\"]").type("test author")
      cy.get("input[placeholder=\"new blogs url\"]").type("test url")
      cy.get(".formButton").click()
      cy.contains("test title by test author")
    })

    it('Blogs are shown in correct order', function() {
      // expand all blog infos
      cy.get(".detailButton").each(($b, i, $blogs) => {
        cy.wrap($b).click()
      })
      cy.get(".blog").eq(0).should("contain", "Hello World - An introduction to giving birth by Neumann")
      cy.get(".blog").eq(2).should("contain", "Go To Statement Considered Harmful")
    })

    describe('When created a blog', function() {
      beforeEach(function() {
        cy.contains("write blog").click()
        cy.get("input[placeholder=\"new blogs title\"]").type("test title")
        cy.get("input[placeholder=\"new blogs author\"]").type("test author")
        cy.get("input[placeholder=\"new blogs url\"]").type("test url")
        cy.get(".formButton").click()
        cy.visit('http://localhost:3000')
      })
      it('A blog can be liked', function() {
        cy.contains("test title")
          .contains("details").click()
        cy.get(".likeButton").click()
        cy.contains("likes: 1")
      })
      it('The blog can be deleted', function() {
        cy.contains("test title")
          .contains("details").click()
        cy.get(".deleteButton").click()
        cy.contains("blog successfully deleted")
      })
    })
  })
})