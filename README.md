# Quiz App

**A webapp for creating, saving and playing trivia quizes..**

[![Deploy to Pages](https://github.com/derrealstefabi/quiz-app/actions/workflows/astro.yml/badge.svg)](https://github.com/derrealstefabi/quiz-app/actions/workflows/astro.yml)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fderrealstefabi.github.io%2Fquiz-app%2F&up_message=online&label=gh%20pages%20demo)



## Demo
https://derrealstefabi.github.io/quiz-app/

## Screenshots
<img width="300" alt="quiz list" src="https://github.com/user-attachments/assets/18c95327-3edb-4a8f-b8cc-adefd50b26c7" />
<img width="300" alt="create quiz" src="https://github.com/user-attachments/assets/96cf4a9a-92fa-445f-ad0f-4869374a434b" />
<img width="300" alt="quiz board" src="https://github.com/user-attachments/assets/fcd4b62b-27eb-469f-bbec-a00aa011da7a" />
<img width="300" alt="question display" src="https://github.com/user-attachments/assets/6ca57e8d-5669-4464-8dd8-60e0be3f4c00" />
<img width="300" alt="answer question" src="https://github.com/user-attachments/assets/2e1c3d9c-6409-4474-aa62-de80db5a46cd" />



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
