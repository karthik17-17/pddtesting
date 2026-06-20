"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const BasePage_1 = require("./BasePage");
class LoginPage extends BasePage_1.BasePage {
    // Selectors
    get emailInput() { return '~email-input'; }
    get passwordInput() { return '~password-input'; }
    get loginBtn() { return '~login-button'; }
    get errorBanner() { return '~error-banner'; }
    get forgotPasswordLink() { return '~forgot-password-link'; }
    get registerLink() { return '~register-link'; }
    async login(email, password) {
        await this.type(this.emailInput, email, 'Email Input');
        await this.type(this.passwordInput, password, 'Password Input');
        await this.click(this.loginBtn, 'Login Button');
        await this.pause(1000); // Wait for transit
    }
    async getErrorMessage() {
        return await this.getText(this.errorBanner, 'Error Banner');
    }
    async navigateToRegister() {
        await this.click(this.registerLink, 'Register Link');
    }
    async navigateToForgotPassword() {
        await this.click(this.forgotPasswordLink, 'Forgot Password Link');
    }
}
exports.LoginPage = LoginPage;
