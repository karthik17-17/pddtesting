"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilePage = void 0;
const BasePage_1 = require("./BasePage");
class ProfilePage extends BasePage_1.BasePage {
    // Selectors
    get profileNameText() { return '~profile-name-text'; }
    get editProfileBtn() { return '~edit-profile-btn'; }
    get nameInput() { return '~name-input'; }
    get saveChangesBtn() { return '~save-changes-btn'; }
    get logoutBtn() { return '~logout-button'; }
    get confirmLogoutBtn() { return '~confirm-logout-ok'; }
    get emailError() { return '~email-error'; }
    async getProfileName() {
        return await this.getText(this.profileNameText, 'Profile Name Text');
    }
    async editProfileName(newName) {
        await this.click(this.editProfileBtn, 'Edit Profile Button');
        await this.type(this.nameInput, newName, 'Name Input');
        await this.click(this.saveChangesBtn, 'Save Changes Button');
        await this.pause(1000);
    }
    async logout() {
        await this.click(this.logoutBtn, 'Logout Button');
        await this.click(this.confirmLogoutBtn, 'Confirm Logout OK Button');
        await this.pause(1000);
    }
    async checkEmailValidationError() {
        return await this.isDisplayed(this.emailError, 'Email Validation Error Label');
    }
}
exports.ProfilePage = ProfilePage;
