import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  // Web CSS Selectors
  private get nameInput() { return '#register-name'; }
  private get emailInput() { return '#register-email'; }
  private get passwordInput() { return '#register-password'; }
  private get registerBtn() { return '#register-submit'; }
  private get loginLink() { return 'a[href="/login"]'; }

  public async register(name: string, email: string, pass: string): Promise<void> {
    await this.type(this.nameInput, name, 'Full Name Input');
    await this.type(this.emailInput, email, 'Email Input');
    await this.type(this.passwordInput, pass, 'Password Input');
    await this.click(this.registerBtn, 'Register Button');
    await this.pause(2000); // Wait for API and routing
  }

  public async navigateToLogin(): Promise<void> {
    await this.click(this.loginLink, 'Login Link');
  }
}
