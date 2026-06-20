import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  // Web CSS Selectors
  private get profileNameText() { return 'h2'; } // Top h2 is profile name
  private get editProfileBtn() { return '#edit-profile-btn'; }
  private get nameInput() { return 'input[type="text"]'; } // Modal input
  private get saveChangesBtn() { return 'button=Save Changes'; }
  private get logoutBtn() { return '#logout-btn'; }
  private get emailError() { return 'div.bg-red-500\\/10'; } // Toast or error box

  public async getProfileName(): Promise<string> {
    return await this.getText(this.profileNameText, 'Profile Name Text');
  }

  public async editProfileName(newName: string): Promise<void> {
    await this.click(this.editProfileBtn, 'Edit Profile Button');
    await this.type(this.nameInput, newName, 'Name Input');
    await this.click(this.saveChangesBtn, 'Save Changes Button');
    await this.pause(1500); // wait for update
  }

  public async logout(): Promise<void> {
    await this.click(this.logoutBtn, 'Logout Button');
    await this.pause(1500);
  }

  public async checkEmailValidationError(): Promise<boolean> {
    return await this.isDisplayed(this.emailError, 'Email Validation Error');
  }
}
