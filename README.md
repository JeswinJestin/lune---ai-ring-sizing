# LUNE: AI Ring Sizing Companion

LUNE is an AI-powered, web-based application designed to eliminate the guesswork from online jewelry purchases. It provides users with a suite of tools to accurately measure their ring size from the comfort of their home, leveraging computer vision and advanced AI models.

## Table of Contents
- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Technical Stack](#technical-stack)
- [Development Journey & Challenges Solved](#development-journey--challenges-solved)
- [Future Roadmap](#future-roadmap)
- [Running the Project](#running-the-project)

## Project Overview

The primary goal of LUNE is to solve the uncertainty and high return rates associated with buying rings online. By providing a reliable, accessible, and user-friendly sizing tool, LUNE aims to instill confidence in consumers and provide value to e-commerce jewelry retailers.

The application guides the user through various measurement methods, processes the input using Google's Gemini AI, and delivers an accurate ring size with a detailed report. The experience is enhanced with features like a virtual AR try-on and personalized ring recommendations.

## Core Features

### 1. Multi-Method Sizing
LUNE offers several ways for users to find their size, catering to different needs and available resources.
*   **AI + Credit Card (Highest Accuracy):** The user takes a photo of their finger next to a standard credit card. The AI uses the card as a precise real-world scale reference to calculate the finger's diameter with up to 99% accuracy.
*   **AI Hand Scan:** A cutting-edge method that requires only the user's camera. The AI analyzes the geometry and proportions of the hand to estimate the ring size without any external reference objects.
*   **Existing Ring Sizer:** An on-screen tool that allows users to measure the inner diameter of a physical ring they already own.
*   **Printable Sizer:** A traditional method where users can download a PDF, print it to scale, and use a cutout to measure their finger.

### 2. AI-Powered Analysis Engine
The core of the application's accuracy lies in its integration with Google's Gemini AI.
*   **Robust Image Analysis:** Instead of relying on fragile client-side computer vision, captured images are sent to the Gemini model for sophisticated analysis.
*   **Context-Aware Prompts:** The application sends tailored prompts to the AI based on the measurement method selected, ensuring the highest quality analysis for each scenario.

### 3. Real-time Camera Guidance
To ensure high-quality image captures, the camera interface provides real-time feedback.
*   **Live Quality Checks:** The system analyzes the camera feed for lighting conditions, image blurriness (camera shake), and object visibility.
*   **Intuitive Overlays:** Clean, minimalist guides show the user exactly where to place their hand and reference object. The guides provide instant visual feedback, changing color upon successful detection.

### 4. Virtual AR Try-On
Powered by MediaPipe, the AR feature brings the shopping experience to life.
*   **Real-time Hand Tracking:** The application accurately tracks the user's finger joints in the camera feed.
*   **Realistic Visualization:** Users can see how different virtual rings look on their actual hand, with options to adjust position, rotation, and scale for the perfect fit.

### 5. Comprehensive Results & Recommendations
*   **Detailed Report:** Users receive their size in multiple international standards (US, UK, EU), along with their precise measurements in millimeters.
*   **Downloadable PDF:** A professional PDF report of the results can be downloaded and saved.
*   **Personalized Ring Styles:** Based on the measured size, the app suggests a curated collection of ring styles, enhancing the user's post-measurement journey.

## Technical Stack
*   **Frontend:** React, TypeScript
*   **Styling:** TailwindCSS
*   **AI / Computer Vision:**
    *   **Google Gemini API:** For core image analysis and measurement.
    *   **MediaPipe:** For real-time hand landmark tracking in the AR Try-On feature.
*   **UI/UX:** Framer Motion (for animations), Custom Hooks, Responsive Design.

## Development Journey & Challenges Solved

The development of LUNE involved several key iterations to arrive at the current robust and user-friendly application.

*   **Challenge: Unreliable Client-Side Analysis**
    *   _Problem:_ The initial MVP relied on client-side JavaScript libraries for computer vision (edge detection, contour finding). This approach was brittle, prone to errors in varied lighting conditions, and frequently resulted in "Analysis Failed" messages for the user.
    *   _Solution:_ The entire analysis pipeline was re-architected to use the **Google Gemini API**. This strategic shift offloaded the complex analysis to a powerful, purpose-built AI model, dramatically increasing accuracy, reliability, and the overall success rate of measurements.

*   **Challenge: Confusing Camera Interface**
    *   _Problem:_ Early versions of the camera UI had cluttered, confusing overlays (abstract drawings, multiple boxes) and non-functional buttons, leading to a poor user experience.
    *   _Solution:_ The interface was completely redesigned with a focus on **minimalism and intuitive feedback**. Ambiguous guides were replaced with clear, anatomically correct silhouettes that change appearance upon successful object detection. All UI controls were made fully functional, including help and settings panels.

*   **Challenge: Buggy Hand Tracking**
    *   _Problem:_ The AI hand tracking for the AR feature was initially prone to errors, sometimes incorrectly identifying landmarks on a user's face or other background objects.
    *   _Solution:_ **Positional validation logic** was implemented. The system now defines a specific region of interest on the screen (the hand silhouette guide) and will only process and display landmarks when a hand is detected within that valid area, eliminating false positives and improving stability.

## Future Roadmap

LUNE is an evolving platform. Based on user feedback and technological advancements, the following features are planned for future releases:

*   **Enhanced AR Try-On:**
    *   Implement 3D models for rings instead of 2D images for a more realistic try-on experience.
    *   Introduce lighting and material simulation to show how rings would reflect light in the user's environment.
*   **Expanded Sizing Methods:**
    *   Fully implement and launch the "Phone Screen Sizer" method, using the device's known screen dimensions for calibration.
    *   Add support for additional common reference objects, such as coins of various currencies.
*   **User Accounts & Personalization:**
    *   Allow users to create accounts to save their measurement results and history.
    *   Enable users to create a "Favorites" list of rings from the recommendation and AR features.
*   **E-commerce Integration:**
    *   Partner with online jewelry retailers to integrate the LUNE sizing tool directly into their product pages.
    *   Provide affiliate links or a direct shopping cart for recommended rings.
*   **AI Model Refinement:**
    *   Continuously refine and A/B test Gemini prompts to further improve accuracy across a wider range of cameras, skin tones, and environments.

## Running the Project

This project is set up to run in a specific web-based development environment.

1.  **API Key:** The application requires a Google Gemini API key. This must be configured in the environment variables as `API_KEY`.
2.  **Dependencies:** All dependencies are managed via an `importmap` in `index.html`.
3.  **Launch:** Serve the `index.html` file using a local web server. The `index.tsx` script will be loaded as a module and the React application will mount to the `#root` element.
