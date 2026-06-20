"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const BasePage_1 = require("./BasePage");
class HomePage extends BasePage_1.BasePage {
    // Selectors
    get dashboardHeader() { return '~dashboard-header'; }
    get homeTab() { return '~tab-home'; }
    get mapTab() { return '~tab-map'; }
    get savedTab() { return '~tab-saved'; }
    get compareTab() { return '~tab-compare'; }
    get profileTab() { return '~tab-profile'; }
    async isDashboardLoaded() {
        return await this.isDisplayed(this.dashboardHeader, 'Dashboard Header');
    }
    async navigateToHome() {
        await this.click(this.homeTab, 'Home Tab');
    }
    async navigateToMap() {
        await this.click(this.mapTab, 'Map Tab');
    }
    async navigateToSaved() {
        await this.click(this.savedTab, 'Saved Wishlist Tab');
    }
    async navigateToCompare() {
        await this.click(this.compareTab, 'Comparison Matrix Tab');
    }
    async navigateToProfile() {
        await this.click(this.profileTab, 'Profile Tab');
    }
}
exports.HomePage = HomePage;
