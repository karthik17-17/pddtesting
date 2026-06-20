"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPage = void 0;
const BasePage_1 = require("./BasePage");
class RegisterPage extends BasePage_1.BasePage {
    // Web CSS Selectors
    get nameInput() { return '#register-name'; }
    get emailInput() { return '#register-email'; }
    get passwordInput() { return '#register-password'; }
    get registerBtn() { return '#register-submit'; }
    get loginLink() { return 'a[href="/login"]'; }
    async register(name, email, pass) {
        await this.type(this.nameInput, name, 'Full Name Input');
        await this.type(this.emailInput, email, 'Email Input');
        await this.type(this.passwordInput, pass, 'Password Input');
        await this.click(this.registerBtn, 'Register Button');
        await this.pause(2000); // Wait for API and routing
    }
    async navigateToLogin() {
        await this.click(this.loginLink, 'Login Link');
    }
}
exports.RegisterPage = RegisterPage;
