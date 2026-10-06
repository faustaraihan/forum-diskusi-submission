/**
 * Skenario E2E login (aplikasi penuh; hanya API eksternal yang di-stub):
 * - Email/password kosong menampilkan validasi tanpa request login.
 * - Kredensial salah menampilkan error dan mempertahankan email.
 * - Login sukses mengirim kredensial, menyimpan token, dan menampilkan profil.
 * - Reload memulihkan sesi melalui token yang tersimpan.
 * - Logout menghapus token dan kembali menampilkan akses masuk.
 * - Login dari halaman terproteksi kembali ke form pembuatan diskusi.
 */
const API = 'https://forum-api.dicoding.dev/v1';
const TOKEN = 'fixture-token-for-e2e-only';

function fillLogin() {
  cy.get('input[id="login-email"]').type('e2e@example.com');
  cy.get('input[id="login-password"]').type('test-password');
  cy.get('button[type="submit"]').click();
}

function expectAuthenticated() {
  cy.get('.account-user').should('contain.text', 'Pengguna E2E');
  cy.window().its('localStorage').invoke('getItem', 'ruang-diskusi-token').should('eq', TOKEN);
}

describe('alur login Ruang Diskusi', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/threads`, { status: 'success', data: { threads: [] } }).as('threads');
    cy.fixture('user').then((user) => {
      cy.intercept('GET', `${API}/users`, { status: 'success', data: { users: [user] } });
      cy.intercept('GET', `${API}/users/me`, (request) => {
        expect(request.headers.authorization).to.equal(`Bearer ${TOKEN}`);
        request.reply({ status: 'success', data: { user } });
      }).as('profile');
    });
    cy.intercept('POST', `${API}/login`, { status: 'success', data: { token: TOKEN } }).as('login');
  });

  it('menolak form kosong tanpa menghubungi login API', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.get('[role="alert"]').should('contain.text', 'Isi email dan password');
    cy.get('@login.all').should('have.length', 0);
    cy.location('pathname').should('eq', '/login');
  });

  it('menampilkan kegagalan kredensial dan memungkinkan percobaan ulang', () => {
    cy.intercept('POST', `${API}/login`, {
      statusCode: 401,
      body: { status: 'fail', message: 'Email atau password salah' },
    }).as('failedLogin');
    cy.visit('/login');
    fillLogin();
    cy.wait('@failedLogin');
    cy.get('[role="alert"]').should('contain.text', 'Email atau password salah');
    cy.get('#login-email').should('have.value', 'e2e@example.com');
    cy.get('button[type="submit"]').should('be.enabled');
    cy.window().its('localStorage').invoke('getItem', 'ruang-diskusi-token').should('be.null');
  });

  it('masuk dengan kredensial valid dan menampilkan profil pada beranda', () => {
    cy.visit('/login');
    fillLogin();
    cy.wait('@login').its('request.body').should('deep.equal', {
      email: 'e2e@example.com',
      password: 'test-password',
    });
    cy.wait('@profile');
    cy.location('pathname').should('eq', '/');
    expectAuthenticated();
  });

  it('memulihkan sesi setelah halaman dimuat ulang', () => {
    cy.visit('/login');
    fillLogin();
    cy.wait('@profile');
    expectAuthenticated();
    cy.reload();
    cy.wait('@profile');
    expectAuthenticated();
  });

  it('keluar dan membersihkan token sesi', () => {
    cy.visit('/login');
    fillLogin();
    cy.wait('@profile');
    cy.get('button[aria-label="Keluar akun"]').click();
    cy.get('.account-nav').should('contain.text', 'Masuk');
    cy.get('.account-user').should('not.exist');
    cy.window().its('localStorage').invoke('getItem', 'ruang-diskusi-token').should('be.null');
  });

  it('kembali ke halaman terproteksi yang diminta setelah login', () => {
    cy.visit('/threads/new');
    cy.location('pathname').should('eq', '/login');
    cy.get('.form-note').should('contain.text', 'Masuk untuk membuat diskusi');
    fillLogin();
    cy.wait('@profile');
    cy.location('pathname').should('eq', '/threads/new');
    cy.get('h1').should('contain.text', 'diskusi');
    cy.get('input[id="thread-title"]').should('be.visible');
    expectAuthenticated();
  });
});
