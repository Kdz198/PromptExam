# AI-Powered Exam Generator

## **Homepage Screenshot**
<img src="https://res.cloudinary.com/dlujsdqkm/image/upload/v1760890715/Homepage_x5z6bc.jpg" width="auto" height="auto"/><br>

## Overview

AI-Powered Exam Generator is a web application designed to assist teachers in creating exams, questions, lessons, and matrices efficiently. This student pet project aims to save time for educators by providing tools for generating questions using AI, managing question banks, and ensuring exams align with predefined matrices. It supports subjects from grade 1 to 12, with features tailored for Vietnamese education systems, including LaTeX rendering for mathematical expressions.

The core goal is to streamline the process of exam preparation, allowing teachers to focus more on teaching rather than manual content creation.

## Features

- **Question Bank Management**: Store and organize questions linked to specific lessons. Each subject has multiple grades (1-12), each grade has multiple lessons, and each lesson contains questions categorized by difficulty levels (Recognition, Comprehension, Application, High Application). Supports two question types: Multiple Choice and Essay.
  - Multiple Choice: Teachers input options (A, B, C, D), correct answer, and distractors.
  - Essay: Open-ended questions with point allocation.
  - LaTeX Support: Render mathematical formulas and expressions seamlessly.

- **AI Question Generation**: Powered by Google's Gemini LLM via Spring AI.
  - Teachers select subject, grade, lesson (with lesson details), question type, and difficulty.
  - AI generates questions in a structured format (defined by system prompt for easy frontend parsing).
  - Teachers can review, edit, or regenerate questions before saving to the question bank.

- **Matrix Creation and Management**: Create and store exam matrices specifying question counts, difficulties, and distributions for specific subjects and grades (e.g., Math Grade 12, specialized vs. standard classes). Matrices can be customized and saved.

- **Exam Generation and Validation**: Select questions from the bank, choose a matrix, and generate an exam. The system validates if the selected questions match the matrix requirements (e.g., number of questions per difficulty). Generated exams are stored in an exam bank for review and filtering.

- **User-Friendly UI**: Intuitive interface for creating, editing, and managing content, with real-time LaTeX previews.



## Screenshots


<table>
  <tr>
    <td align="center">
      <img src="https://res.cloudinary.com/dlujsdqkm/image/upload/w_300,h_300,c_fill/GenQuestion_lodemn.png" width="auto" height="auto"/><br>
      <strong>AI Question Generation </strong><br>
    </td>
    <td align="center">
      <img src="https://res.cloudinary.com/dlujsdqkm/image/upload/w_300,h_300,c_fill/v1760888359/LatexRender_lfkkii.png"  width="auto" height="auto"/><br>
      <strong>LaTeX Rendering Support </strong><br>
    </td>
    <td align="center">
      <img src="https://res.cloudinary.com/dlujsdqkm/image/upload/w_300,h_300,c_fill/v1760888359/examPage_kjyfnl.jpg" width="auto" height="auto"/><br>
      <strong>Exam Management </strong><br>
    </td>
  </tr>
</table>


## Technology Stack

<p align="center">
<img src="https://skillicons.dev/icons?i=java,spring,postgresql,react,typescript,docker" />
  <img src="https://img.icons8.com/color/48/000000/google-logo.png" height="42" />
</p>
<div align="center">
<sub>Java • SpringBoot • SpringAI • PostgreSQL • Docker • TypeScript • React • Gemini</sub>
</div>


## Contributing

This is a student pet project, but contributions are welcome! Feel free to fork the repository, create issues, or submit pull requests.

## License

MIT License. See [LICENSE](LICENSE) for details.
