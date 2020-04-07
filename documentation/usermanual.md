# User Manual

*This document contains instructions for using the application. If you are looking for installation instructions, refer to the [installation manual](./installation.md).*

# Index
- [Regular User](#regular-user)
    - [Using the lottery](#using-the-lottery)
        - [Approving or Re-rolling the Result](#approving-or-re-rolling-the-result)
    - [Applying Filters to the Lottery](#applying-filters-to-the-lottery)
    - [Suggesting a New Restaurant](#suggesting-a-new-restaurant)
    - [Suggesting Changes to Existing Restaurants](#suggesting-changes-to-existing-restaurants)
        - [Suggesting Deleting Restaurants](#suggesting-deleting-restaurants)
        - [Suggesting Editing Restaurants](#suggesting-editing-restaurants)
- [Administrator-specific Functionality](#administrator-specific-functionality)
    - [Logging In](#logging-in)
    - [The Suggestion Dashboard](#the-suggestion-dashboard)
    - [Managing Categories](#managing-categories)
    - [Managing Users](#managing-users)

# Regular User

## Using the Lottery

The main view is the one that is displayed by default when you first open the application. You should see a 3d model of a bowl of ramen and a big button that reads `I'm feeling lucky!`. To navigate to the front page, click the title of the application at the left end of the navigation bar.

To run the lottery, click the `I'm feeling lucky!` button. An animation will play accompanied by appropriate sound effects. Once the lottery finishes, you will be shown information regarding the resulting restaurant, including its name, possible website address and both pictures and comments fetched from Google. If you are unfamiliar with the resulting restaurant, you can get walking directions (from HSL) by clicking the `Get Directions` -link at the top.

### Approving or Re-rolling the Result

Two buttons are displayed below the lottery results. If you are satisfied with the given restaurant, click the `Ok, I'm picking this one!` button. Otherwise, you can re-run the lottery by clicking the `Nope, gimme another one!` button. 

*Please note that both of these buttons affect the statistics for the resulting restaurant. While statistics do not affect the randomness of the lottery results, a percentage representing how often users picked a restaurant is shown every time a it is drawn in the lottery.*

## Applying Filters to the Lottery 

If you would like to narrow down your lottery - maybe you and your coworkers are feeling like having salad for lunch today - you can open the filter by clicking the `Set Filter` button below the main lottery button.

There are a few different settings for the filter. The first dropdown concerns how restaurants are filtered based on the categories you select later.

- `some` - All restaurants that have at least one of the selected categories will be included in the lottery.
- `all` - Only restaurants which have been assigned to all of the selected categories will be included in the lottery.
- `none` - Only restaurants that do not serve any of the selected categories are included in the lottery.

The second dropdown contains a list of all the categories that exist within the application. You may select as many as you would like. The categories you have selected are displayed as a list below, where you may remove them from the filter by clicking the small `x` next to their names.

Finally, you may also filter restaurants based on their distance (in metres) to the starting location - which, by default, is hard-coded to be the Unity Technologies offices in Helsinki. If the field is left empty, the distance is unlimited.

## Suggesting a New Restaurant

If there is a restaurant that you would like to be added to the lottery pool, you may suggest its addition by navigating to the `Suggest a Restaurant` page via the navigation bar. Enter the name, possible website address and physical of the restaurant. To assist you, suggestions are given based on your input to the `Restaurant Name` field. Clicking on an autocomplete suggestion automatically fills the name, website and address fields.

Clicking on an autocomplete suggestion also connects the restaurant to the Google API, which allows for showing photos and reviews of the restaurant when it gets selected in the lottery. Restaurants added without clicking on an autocomplete suggestion are not linked to the Google API and pictures/reviews will not be shown when they are chosen. Changing the restaurant's name after clicking on an autocomplete suggestion will also remove the connection to the API.

You can select appropriate categories to add the restaurant to. You may leave a restaurant without any categories, but it will not be included in any category-based filtered lotteries (except with the `none` setting).

To be able to submit the form, you must first check the validity of the restaurant's address by clicking the `Check` button next to the address field. This ensures that invalid addresses are not accidentally added to the application. If the address is valid, you will be shown a map of the suggested walking route to the restaurant. 

*Note that as the addresses are checked using HSL's services, you may sometimes enter colloquial names for locations and get valid results - for example, entering "steissi" as the address should set the address to be the Central Railway Station of Helsinki.*

To submit the form, click the `Add` button. As a regular user, a suggestion will be sent to the administrator dashboard, where an administrator must approve the suggestion for it to be added.

## Suggesting Changes to Existing Restaurants

To suggest changes to existing restaurants within the application - for example, if you noticed that a restaurant's address was not quite right - navigate to the `Suggest Editing Restaurants` page within the navigation bar. On this page, you will be shown a list of restaurants within the application.

### Suggesting Deleting Restaurants

If you would like a restaurant to be removed from the application altogether, click the `Suggest removal` button below the name of the restaurant. You will be asked to confirm your suggestion, after which it will be sent to the administrator dashboard to be approved or rejected.

### Suggesting Editing Restaurants

Click the `Edit` button below the name of the restaurant that you wish to suggest changes to. You will be shown a pre-filled form similar to the new restaurant suggestion form. Once you have made your edits, click the `Suggest` button to send the suggestion to be approved by an administrator.

# Administrator-specific Functionality

Naturally, administrators are able to perform the same tasks as regular users, with the exception that any actions requiring an administrator's approval (additions, deletions and edits) are performed directly and not sent to the suggestion dashboard.

## Logging In

To log in, navigate to the login page by clicking the `Admin Login` button at the right end of the navigation bar. Enter your credentials and click `Log In`. If this is your first time logging in, you may be asked to change your password. Once logged in, you will be redirected to the suggestion dashboard. 

*Note that your login credentials will be temporarily stored in the browser's memory for the duration of the session - they will be wiped once you close the browser, but not if you close the tab.*

## The Suggestion Dashboard

The suggestion dashboard is the default view of the administrator panel. To navigate to this page at any time, use the `Manage Pending Suggestions` link in the navigation bar.

Suggestions regular users have made regarding the addition of new restaurants and deletion or edits to existing ones are listed in this view. The suggestions are colour-coded so that additions, editions and deletions have green, yellow and red title bars respectively.

For each suggestion, information regarding the restaurant concerned is shown as a table. For editions, both the old and the new data are shown side-by side.

To approve or reject a suggestion, click the `Approve` or `Reject` button below it.

*Note that approving an edit or a removal suggestion deletes all other suggestions concerning that specific restaurant. Direct edits to restaurants as an administrator also remove all suggestions concerning the restaurant in question.*

## Managing Categories

To navigate to this page, click the `Edit Categories` page in the navigation bar.

Only administrators have access to adding, removing and editing categories. In essence, a category is a tag that is assigned to a restaurant. The application features a filter functionality that is based on these tags.

To create a new category, click the `Add a new category` button at the top of the list. You will be shown a simple form where you can type in the desired name of the category to be added. Once done, click the `Add` button and the category is added to the application. Restaurants can now be freely assigned to the category.

To change the name of a category, click the `Edit` button below its name in the listing view. You may now change the name of the category.

To delete a category, click the `Remove` button below its name in the listing view. After confirming the removal, the category will be deleted from the application and all restaurants tagged with it.

## Managing Users

To navigate to the user management page, click the `Manage Users` link in the navigation bar.

In this view, you will be shown a list of all users in the application. Below your username there is a button to change the password associated with your username.

To add a new user, click the `Add a new user` button at the top of the listing. You will be shown a simple for with fields for username and password. The username entered here cannot be changed later. The password, however, is temporary and will be required to be changed on the first time the credentials are used to log in. Once you have typed in the desired username and temporary password, click the `Register` button. The credentials can now be used to log in as an administrator.

***Note that all users with credentials are administrators.***
