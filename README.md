# DevBlog

## A Medium-like web app built with Reactjs

### Description

This is the front-end of Medium-like web app created with **Reactjs**, **Typescript**, **Redux Toolkit** and **Tailwind CSS**, where users can read or publish their own blog posts. You can find the back-end source code of the app [here](https://github.com/loc-cv/devblog-server).

### Overview

- Persist logged-in user with refresh token and RTK Query.
- Protected routes based on user role with React Router.
- Infinite scroll with react-infinite-scroll-component.
- Client-side form validation with React Hook Form and Zod.
- Pagination tables with React Table.
- Rich text editor using React Quill.
- Responsive design (kind of) with Tailwind CSS.

### Screen Shots

![Home page](./screenshots/homepage.png "Home page")
*Home Page*
</br>
</br>

![Post page](./screenshots/single-post-page.png "Single post page")
*Single post page*
</br>
</br>

![Create post page](./screenshots/create-post.png "User can create post")
*User can create post*
</br>
</br>

![Edit post page](./screenshots/edit-post.png "Of course user can edit their post")
*Of course user can edit their post*
</br>
</br>

![Reading list](./screenshots/reading-list.png "User can save posts for later reading")
*User can save posts for later reading*
</br>
</br>

![User profile](./screenshots/user-profile.png "User profile page")
*User profile page*
</br>
</br>

![Update profile](./screenshots/update-profile.png "Of course user can update profile info and password")
*User can update profile info and password*
</br>
</br>

![Dashboard](./screenshots/dashboard-tags.png "Admin can manage the app with Dashboard pages")
*Admin can manage the app with Dashboard pages*

### Installation and Setup Instructions

In case you want to run this project locally, clone the repository to your local machine:

- Make sure you have correctly set up the [server](https://github.com/loc-cv/devblog-server).
- Make sure you have docker and docker-compose installed on your machine.
- Navigate to your cloned directory.
- run <code>docker-compose up</code>.

### Todo

- [ ] Add search posts by tags. The Backend already has API for this feature.
- [ ] User can report a post. The Backend also already has API for this.
- [ ] Users can follow each other.
- [ ] Implement notifications.
- [ ] Update user profile photo. This is not a hard task, but I'm too lazy right now ._.
