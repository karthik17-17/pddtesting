import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  // Selectors
  private get profileNameText() { return '~profile-name-text'; }
  private get editProfileBtn() { return '~edit-profile-btn'; }
  private get nameInput() { return '~name-input'; }
  private get saveChangesBtn() { return '~save-changes-btn'; }
  private get logoutBtn() { return '~logout-button'; }
  private get confirmLogoutBtn() { return '~confirm-logout-ok'; }
  private get emailError() { return '~email-error'; }

  public async getProfileName(): Promise<string> {
    return await this.getText(this.profileNameText, 'Profile Name Text');
  }

  public async editProfileName(newName: string): Promise<void> {
    await this.click(this.editProfileBtn, 'Edit Profile Button');
    await this.type(this.nameInput, newName, 'Name Input');
    await this.click(this.saveChangesBtn, 'Save Changes Button');
    await this.pause(1000);
  }

  public async logout(): Promise<void> {
    await this.click(this.logoutBtn, 'Logout Button');
    await this.click(this.confirmLogoutBtn, 'Confirm Logout OK Button');
    await this.pause(1000);
  }

  public async checkEmailValidationError(): Promise<boolean> {
    return await this.isDisplayed(this.emailError, 'Email Validation Error Label');
  }
}
