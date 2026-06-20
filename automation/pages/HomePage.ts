import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Web CSS Selectors using attribute ends-with ($=) matching
  private get dashboardHeader() { return 'h1=NeuroStay AI'; } // Finds h1 containing NeuroStay AI
  private get homeTab() { return 'a[href$="/"]'; }
  private get mapTab() { return 'a[href$="/map"]'; }
  private get savedTab() { return 'a[href$="/saved"]'; }
  private get compareTab() { return 'a[href$="/compare"]'; }
  private get profileTab() { return 'a[href$="/profile"]'; }

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
