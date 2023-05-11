# Drip Sales

## Introduction

The idea of DripSales is to provide a platform for sellers and buyers similar to Den Blå Avis, Facebook Marketplace and TrendSales where people can discover items and get in contact with the seller to arrange a purchase. Our app focuses on buying and selling clothes, footwear, accessories etc. 

The concept is pretty straight forward: A user simply signs up using the sign up page. The user now has the possibility to start browsing the items that others are selling or create a new post of their own. The user can see the recently created posts on the home page and through the  search page the user can look for a specific item or a product category. If they want to save an item for later they can use the bookmark button. The user can view details about a post by clicking on the card. 

On the profile page it is possible for the user to update their email, password and name if they wish to do so. The app uses geolocation which allows users to see whether they are close to the seller/buyer if they want to see the item and complete the transaction in person. If the user changes location it is possible to update the location on the profile page. The profile page also displays the created and bookmarked items. 

On the add page it is possible to create a new post by entering a title, price, size, category, description and uploading an image. 
Lastly is the chats page where it is possible to chat with the seller/buyer to gather more information about the item and discuss the transaction. 

## Design choices

We constructed wireframes and mockups using Figma to visualize how we wanted the app to look like. We also created a logo, splash screen and an icon for the app. The combination of the font (Racing Sans One) and the blue (Hex: #5268B4) details give a modern look. The app icon is the three first characters of Drip Sales and is stylised to invoke emotions of curiosity and playfulness. We took inspiration from other clothes brands including TrendSales. Take a look at our designs using Figma: 

https://www.figma.com/file/hDziCtrcNkH48LOmjah55t/Ionic-App?node-id=0%3A1

The app prioritizes a minimalistic design with good usability. It should be pleasant and easy for the user to navigate the app. We kept the navigation simple using a tab bar at the bottom of the screen which navigates to the most commonly used pages. 

Usability expert Jakob Nielsen says, “Users spend most of their time on other apps. People prefer your app to work the same way as all the other apps they already know.” That is why we have tried to create an app that feels familiar to a new user. It should require minimal learning and should be intuitive. One way to achieve this is to use universally known icons such as a house to indicate home, magnifying glass to indicate search, speech bubbles to indicate chatting/conversation, a plus icon to indicate creating/adding something and lastly a user icon to indicate a profile page. With these icons in the tab bar we are trying to make the app easy and intuitive for the user.

We also tried to follow [Jakob Nielsen's 10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) to create a design and UI with the user in mind. For instance in “#1 Visibility of System Status” we try to clearly communicate the system status to the user. In several places we use form validation and error messages to guide the user. Loading icons are displayed when the system is busy and messages (toast) are displayed frequently on success or failures. 


## Project structure

Organization of components in React is important, so that's why our project has been structured in different folders to separate functionality into more manageable pieces. Our /src directory contains several folders, including components which contain all of our components that we use on several pages, for example the ProductListItem (a card with product info) and a PostForm.

The pages directory contains the main interface of our application, like the home page, profile page, chat page and so on. 
The util folder has javascript files which handle communication with Firebase using the Firebase SDK.
We have also used the capacitor.config.ts file to create the splash screen for our application.

## How to run the app

### PC/browser: 
Clone or download the .zip file from the GitHub repository and open it in Visual Studio Code. Open the Terminal and run ```npm install``` - the project will soon be installed. Once the installation is complete, you can type ```ionic serve``` in the Terminal. The app will be opened in development mode in your browser. In order to use the app, you must either create a user or use the following login information: 

Email: admin@mail.com


Password: p4ssw0rd

You now have access to the app!

### Android: 

Using the VS Code Ionic extension it is possible to run the app on Android. Simply click the Run -> Android button and select a device. After a couple of minutes the app is now running on an android emulator. 

### iOS: 

[Don’t try it!](https://www.youtube.com/watch?v=11pj3dHz-Ao) 
