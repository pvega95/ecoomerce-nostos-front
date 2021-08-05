import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';

@Component({
    selector       : 'languages',
    templateUrl    : './languages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'languages'
})
export class LanguagesComponent implements OnInit, OnDestroy
{
    availableLangs: AvailableLangs;
    activeLang: string;
    flagCodes: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _translocoService: TranslocoService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the available languages from transloco
        this.availableLangs = this._translocoService.getAvailableLangs();

        // Subscribe to language changes
        this._translocoService.langChanges$.subscribe((activeLang) => {

            // Get the active lang
            this.activeLang = activeLang;

            // Update the navigation
            this._updateNavigation(activeLang);
        });

        // Set the country iso codes for languages for flags
        this.flagCodes = {
            'es':'pe',
            'en': 'us'
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void
    {
        // Set the active lang
        this._translocoService.setActiveLang(lang);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the navigation
     *
     * @param lang
     * @private
     */
    private _updateNavigation(lang: string): void
    {
        // For the demonstration purposes, we will only update the Dashboard names
        // from the navigation but you can do a full swap and change the entire
        // navigation data.
        //
        // You can import the data from a file or request it from your backend,
        // it's up to you.

        // Get the component -> navigation data -> item
        const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');

        // Return if the navigation component does not exist
        if ( !navComponent )
        {
            return null;
        }

        // Get the flat navigation data
        const navigation = navComponent.navigation;

        // Get the Project dashboard item and update its title
        const projectDashboardItem = this._fuseNavigationService.getItem('dashboards.project', navigation);
        if ( projectDashboardItem )
        {
            this._translocoService.selectTranslate('Project').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    projectDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        // Get the Analytics dashboard item and update its title
        const analyticsDashboardItem = this._fuseNavigationService.getItem('dashboards.analytics', navigation);
        if ( analyticsDashboardItem )
        {
            this._translocoService.selectTranslate('Analytics').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    analyticsDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        const idOrderItem = this._fuseNavigationService.getItem('order.id', navigation);
        if ( idOrderItem )
        {
            this._translocoService.selectTranslate('order').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idOrderItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idSettingItem = this._fuseNavigationService.getItem('setting.id.0', navigation);
        if ( idSettingItem )
        {
            this._translocoService.selectTranslate('setting').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idSettingItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idProductsItem = this._fuseNavigationService.getItem('setting.id.0.1', navigation);
        if ( idProductsItem )
        {
            this._translocoService.selectTranslate('products').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idProductsItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idClientsItem = this._fuseNavigationService.getItem('setting.id.0.2', navigation);
        if ( idClientsItem )
        {
            this._translocoService.selectTranslate('clients').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idClientsItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idOptionsItem = this._fuseNavigationService.getItem('setting.id.0.3', navigation);
        if ( idOptionsItem )
        {
            this._translocoService.selectTranslate('options').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idOptionsItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idCategoriesItem = this._fuseNavigationService.getItem('setting.id.0.4', navigation);
        if ( idCategoriesItem )
        {
            this._translocoService.selectTranslate('categories').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idCategoriesItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
    }
}
