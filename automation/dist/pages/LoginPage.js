"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const BasePage_1 = require("./BasePage");
class LoginPage extends BasePage_1.BasePage {
    // Web CSS Selectors
    get emailInput() { return '#login-email'; }
    get passwordInput() { return '#login-password'; }
    get loginBtn() { return '#login-submit'; }
    get errorBanner() { return 'div.bg-red-500\\/10'; }
    get forgotPasswordLink() { return 'a[href="/forgot-password"]'; }
    get registerLink() { return 'a[href="/register"]'; }
    async login(email, password) {
        await this.type(this.emailInput, email, 'Email Input');
        await this.type(this.passwordInput, password, 'Password Input');
        await this.click(this.loginBtn, 'Login Button');
        await this.pause(2000); // Wait for transit
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
