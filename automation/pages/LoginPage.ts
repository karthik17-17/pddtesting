import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Web CSS Selectors
  private get emailInput() { return '#login-email'; }
  private get passwordInput() { return '#login-password'; }
  private get loginBtn() { return '#login-submit'; }
  private get errorBanner() { return 'div.bg-red-500\\/10'; }
  private get forgotPasswordLink() { return 'a[href="/forgot-password"]'; }
  private get registerLink() { return 'a[href="/register"]'; }

  public async login(email: string, password: string): Promise<void> {
    await this.type(this.emailInput, email, 'Email Input');
    await this.type(this.passwordInput, password, 'Password Input');
    await this.click(this.loginBtn, 'Login Button');
    await this.pause(2000); // Wait for transit
  }

  public async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorBanner, 'Error Banner');
  }

  public async navigateToRegister(): Promise<void> {
    await this.click(this.registerLink, 'Register Link');
  }

  public async navigateToForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink, 'Forgot Password Link');
  }
}
