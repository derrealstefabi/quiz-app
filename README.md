# Quiz App

**A webapp for creating, saving and playing trivia quizes..**

[![Deploy to Pages](https://github.com/derrealstefabi/quiz-app/actions/workflows/astro.yml/badge.svg)](https://github.com/derrealstefabi/quiz-app/actions/workflows/astro.yml)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fderrealstefabi.github.io%2Fquiz-app%2F&up_message=online&label=gh%20pages%20demo)



## Demo
https://derrealstefabi.github.io/quiz-app/

## Screenshots


## Features
* **Quiz creation:** Create your own quiz directly in the app.
* **AWS integration:** Save your quiz to the cloud and play anytime.
* **Play mode:** Put the app up on a TV and play with your friends.
* **User Authentication:** Secure login and registration using Amazon Cognito.

## Tech Stack
* **Languages:** typescript, python
* **Frontend:** Astro, React, Tailwind
* **Backend:** AWS SAM: ApiGateway, Lambda, s3, DynamoDB, Cognito

## Getting Started
   
Follow these instructions to get a local copy up and running on your machine.

### Prerequisites
Make sure you have the following installed:  
* [Node.js](https://nodejs.org/) (v18 or v20.3.0, v22.0.0 or higher)
* npm

### Installation
   
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/RecipeRoost.git
   cd quiz-app
   ```

2. **Install dependencies**
   ```bash
    npm install
   ```


### Set up AWS integration 
This is optional, but without this the app works only with downloaded quizzes

1. **Deploy AWS backend**
   * Clone the [quiz-app-backend](https://github.com/derrealstefabi/quiz-app-backend) repository.
   * Follow the instructions in the README to set up the backend.


2. **Set up environment variables**
   * Copy the `.env.example` file to `.env` and fill it with the values from your AWS CloudFormation stack, outputted by the quiz-app-backend.

### Run the app   
This will start a local instance running on localhost:4321.
```bash
 npm run dev
```