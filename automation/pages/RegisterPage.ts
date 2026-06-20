import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  // Selectors
  private get nameInput() { return '~name-input'; }
  private get emailInput() { return '~email-input'; }
  private get passwordInput() { return '~password-input'; }
  private get confirmPasswordInput() { return '~confirm-password-input'; }
  private get registerBtn() { return '~register-button'; }
  private get loginLink() { return '~login-link'; }

  public async register(name: string, email: string, pass: string): Promise<void> {
    await this.type(this.nameInput, name, 'Full Name Input');
    await this.type(this.emailInput, email, 'Email Input');
    await this.type(this.passwordInput, pass, 'Password Input');
    await this.type(this.confirmPasswordInput, pass, 'Confirm Password Input');
    await this.click(this.registerBtn, 'Register Button');
    await this.pause(1000); // Wait for API and routing
  }

  public async navigateToLogin(): Promise<void> {
    await this.click(this.loginLink, 'Login Link');
  }
}
