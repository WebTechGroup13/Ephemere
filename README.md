# Introducing the Ephemeral Message Board
an online platform where users can anonymously share messages visible to the public for a limited time. Inspired by platforms like 'This Website Will Self Destruct', our goal is to provide a space for people to express thoughts, ideas, or messages without the permanence and traceability of traditional social media. Messages automatically vanish after a set time, offering a distinct and fleeting interaction experience.

# Features:
- Anonymous Posting: Users can post messages without having to register or
provide any personal information.
- Time-Limited Visibility: Each message will have a countdown timer, and once the
time runs out, the message will automatically be deleted from the platform.
- Randomized Feed: Messages will appear in a randomized order to each visitor,
ensuring that every user experience is unique.
Tech Stack:
- Frontend: ReactJS for building the user interface.
- Backend: Node.js with Express.js for handling server-side logic.
- Database: MongoDB for storing message data and other relevant information.
- Hosting: Vultr

## Starting the front end

In the project directory, you can run:

```
cd src/
npm start
```

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Starting the back end
```
cd backend/
node index.js
```

## Error Message Solutions

## Error: Module not found: Error: Can't resolve 'axios'
Solution: In the project root directory:
npm install axios
## Error: react-scripts is not recognized as an internal or external command, operable or batch file
Solution: In the project root directory:
npm install react-scripts --save
## Error: "cannot find module node-cron' "
Solution: in directory 'Ephemere/backend/'
npm install node-cron
## Error: "cannot find module 'bcryptjs' "
Solution: in root directory
npm install bcryptjs

## Additional Create-React-App Commands

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
