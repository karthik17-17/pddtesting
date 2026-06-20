import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Selectors
  private get dashboardHeader() { return '~dashboard-header'; }
  private get homeTab() { return '~tab-home'; }
  private get mapTab() { return '~tab-map'; }
  private get savedTab() { return '~tab-saved'; }
  private get compareTab() { return '~tab-compare'; }
  private get profileTab() { return '~tab-profile'; }

  public async isDashboardLoaded(): Promise<boolean> {
    return await this.isDisplayed(this.dashboardHeader, 'Dashboard Header');
  }

  public async navigateToHome(): Promise<void> {
    await this.click(this.homeTab, 'Home Tab');
  }

  public async navigateToMap(): Promise<void> {
    await this.click(this.mapTab, 'Map Tab');
  }

  public async navigateToSaved(): Promise<void> {
    await this.click(this.savedTab, 'Saved Wishlist Tab');
  }

  public async navigateToCompare(): Promise<void> {
    await this.click(this.compareTab, 'Comparison Matrix Tab');
  }

  public async navigateToProfile(): Promise<void> {
    await this.click(this.profileTab, 'Profile Tab');
  }
}
