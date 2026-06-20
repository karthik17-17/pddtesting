"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const BasePage_1 = require("./BasePage");
class HomePage extends BasePage_1.BasePage {
    // Web CSS Selectors using attribute ends-with ($=) matching
    get dashboardHeader() { return 'h1=NeuroStay AI'; } // Finds h1 containing NeuroStay AI
    get homeTab() { return 'a[href$="/"]'; }
    get mapTab() { return 'a[href$="/map"]'; }
    get savedTab() { return 'a[href$="/saved"]'; }
    get compareTab() { return 'a[href$="/compare"]'; }
    get profileTab() { return 'a[href$="/profile"]'; }
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
