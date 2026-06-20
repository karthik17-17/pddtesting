"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilePage = void 0;
const BasePage_1 = require("./BasePage");
class ProfilePage extends BasePage_1.BasePage {
    // Web CSS Selectors
    get profileNameText() { return 'h2'; } // Top h2 is profile name
    get editProfileBtn() { return '#edit-profile-btn'; }
    get nameInput() { return 'input[type="text"]'; } // Modal input
    get saveChangesBtn() { return 'button=Save Changes'; }
    get logoutBtn() { return '#logout-btn'; }
    get emailError() { return 'div.bg-red-500\\/10'; } // Toast or error box
    async getProfileName() {
        return await this.getText(this.profileNameText, 'Profile Name Text');
    }
    async editProfileName(newName) {
        await this.click(this.editProfileBtn, 'Edit Profile Button');
        await this.type(this.nameInput, newName, 'Name Input');
        await this.click(this.saveChangesBtn, 'Save Changes Button');
        await this.pause(1500); // wait for update
    }
    async logout() {
        await this.click(this.logoutBtn, 'Logout Button');
        await this.pause(1500);
    }
    async checkEmailValidationError() {
        return await this.isDisplayed(this.emailError, 'Email Validation Error');
    }
}
exports.ProfilePage = ProfilePage;
