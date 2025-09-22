# Job Details Template

This project is designed to provide a detailed view of job postings, allowing users to view job details, apply for jobs, and contact publishers.

## Project Structure

The project is organized as follows:

```
job-details-template
├── src
│   ├── app
│   │   └── job-details
│   │       └── [id]
│   │           └── page.tsx          # Main component for displaying job details
│   ├── components
│   │   ├── JobDetailsHeader.tsx      # Displays job title, location, supplier, category, and creation date
│   │   ├── JobDetailsImage.tsx       # Displays job image or a "No Image" message
│   │   ├── JobDetailsDescription.tsx  # Displays job description
│   │   ├── JobDetailsActions.tsx      # Contains buttons for email, contact number, and "Apply Now"
│   │   ├── ApplyJobModal.tsx          # Modal form for job applications
│   │   └── ContactModal.tsx           # Modal for displaying publisher's contact information
│   ├── lib
│   │   ├── firebaseConfig.ts           # Firebase configuration and initialization
│   │   └── types.ts                    # TypeScript interfaces and types
│   ├── hooks
│   │   └── useJobDetails.ts            # Custom hook for fetching job details
│   └── utils
│       └── firestore.ts                 # Utility functions for Firestore interactions
├── package.json                         # npm configuration file
├── next.config.js                       # Next.js configuration settings
├── tailwind.config.js                   # Tailwind CSS configuration settings
├── tsconfig.json                        # TypeScript configuration file
└── README.md                            # Project documentation
```

## Features

- **Job Details Display**: View job title, location, supplier, category, and creation date.
- **Image Display**: Show job images or a placeholder message if no image is available.
- **Job Description**: Read detailed job descriptions.
- **Contact Options**: Buttons to reveal the publisher's email and contact number.
- **Job Application**: An "Apply Now" button that opens a modal form to collect applicant information.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd job-details-template
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.