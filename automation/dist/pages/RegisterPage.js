"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPage = void 0;
const BasePage_1 = require("./BasePage");
class RegisterPage extends BasePage_1.BasePage {
    // Selectors
    get nameInput() { return '~name-input'; }
    get emailInput() { return '~email-input'; }
    get passwordInput() { return '~password-input'; }
    get confirmPasswordInput() { return '~confirm-password-input'; }
    get registerBtn() { return '~register-button'; }
    get loginLink() { return '~login-link'; }
    async register(name, email, pass) {
        await this.type(this.nameInput, name, 'Full Name Input');
        await this.type(this.emailInput, email, 'Email Input');
        await this.type(this.passwordInput, pass, 'Password Input');
        await this.type(this.confirmPasswordInput, pass, 'Confirm Password Input');
        await this.click(this.registerBtn, 'Register Button');
        await this.pause(1000); // Wait for API and routing
    }
    async navigateToLogin() {
        await this.click(this.loginLink, 'Login Link');
    }
}
exports.RegisterPage = RegisterPage;
