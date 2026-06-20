import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Selectors
  private get emailInput() { return '~email-input'; }
  private get passwordInput() { return '~password-input'; }
  private get loginBtn() { return '~login-button'; }
  private get errorBanner() { return '~error-banner'; }
  private get forgotPasswordLink() { return '~forgot-password-link'; }
  private get registerLink() { return '~register-link'; }

  public async login(email: string, password: string): Promise<void> {
    await this.type(this.emailInput, email, 'Email Input');
    await this.type(this.passwordInput, password, 'Password Input');
    await this.click(this.loginBtn, 'Login Button');
    await this.pause(1000); // Wait for transit
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
