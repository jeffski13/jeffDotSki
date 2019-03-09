# jeff.ski

Howdy! I am a developer in the Dallas area. Over the past few months I have developed (subtle pun) a fondness for react/redux.
I decided it would be fun to build an opensource website. It has been a blast sipping coffee in the evenings while creating this
and doing some collaboration with my friends at work.

Feel free to look through this as examples! I'm not going to say I know everything, but I did manage to get the various frameworks working together!

## Deploying

I created a script that will run the build, copying into the local Firebase directory, and deploying to the firebase servers (which are hosting my site! #notasponsor)

The goal is to get my deploys automated with every tag to my codebase. But for now this has been great! It has made me want to update my site more! Check it: [deployski.ps1](./deployski.ps1)

## Auth

there are two important parts to auth

- the higher order component withBlogAuth
- the redux auth state

We use the withBlogAuth to access methods through props to auth the user. State is not kept here as the components and their wrapping HOCs reset after page refreshes, redirects with react-router, etc.
We use redux state to look into the current auth state (which every component can access)