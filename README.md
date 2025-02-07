# Valenzuela Hawaiian Kenpo Website

This is a [Next.js](https://nextjs.org) project designed to serve as the official website for **Valenzuela Hawaiian Kenpo**, a martial arts school. The site provides information about classes, instructors, announcements, and an embedded calendar for scheduling.

## Features

- **Dynamic Class Listings**: Displays available karate classes, fetching schedule data from an AWS Lambda function.
- **Instructor Profiles**: Showcases information about the instructors, including biographies and images.
- **Announcements Carousel**: Displays the latest announcements with an auto-scrolling feature.
- **Google Calendar Integration**: Embeds a Google Calendar for event visibility.
- **Responsive Navigation Bar**: Provides quick access to different sections of the site.

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:
```
npm run dev
# or
yarn dev
# or
pnpm dev
```
Open http://localhost:3000 in your browser to view the website.

## File Structure
 - <mark>pages/index.tsx</mark>: Main landing page, displaying the navigation bar, announcements, instructor summary, and class schedule.
 - components/navbar.tsx: Navigation bar with links to different sections.
 - components/announcement-carousel.tsx: Fetches and displays announcements dynamically in a rotating carousel.
 - components/classeslist.tsx: Fetches and displays available classes.
 - components/instructor-summary.tsx: Lists instructors with their bios and images.
 - utils/calendar-retrieval.js: Manages Google Calendar integration and event processing.

## API Integration
This project fetches data from AWS Lambda functions:

 - **Class Schedules**: https://moik8i7sua.execute-api.us-east-1.amazonaws.com/default/pullSchedule
 - **Announcements**: Retrieved from Google Calendar and filtered for display.
 - **Calendar Processing**: Extracts events and processes descriptions in multiple languages.

## Deployment
This project is deployed on AWS Amplify

For more information on deployment, refer to the Next.js deployment documentation.

This project aims to enhance the digital presence of Valenzuela Hawaiian Kenpo while providing a seamless experience for students and visitors.