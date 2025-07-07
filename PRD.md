Product Requirements Document: Consulting Service Cost Estimator

## 1. Introduction/Overview

This document outlines the requirements for the Consulting Service Cost Estimator, a web-based application designed for independent consultants and small consulting firms in South Africa. The tool streamlines the creation of accurate, professional project quotations for business consulting services, including Business Proposal Writing, Business Plan Development, and Business Documentation (e.g., operating manuals, policies). It integrates predefined workflows, supports partial groundwork adjustments, and ensures compliance with South African regulations (e.g., VAT, POPIA, B-BBEE). The application aims to save time, enhance cost accuracy, and deliver branded, client-ready quotations.

## 2. Goals

*   **Efficiency**: Reduce quotation creation time by 50% by leveraging predefined workflows and task templates.
*   **Accuracy**: Calculate costs based on standardized task hours, adjustable for complexity and partial groundwork, aligned with South African market rates (R900-R1800/hour).
*   **Professionalism**: Generate branded, compliant quotations tailored to South African clients (e.g., SMEs, startups, corporates).
*   **Flexibility**: Support customization for project scope, document count, and client-specific needs.
*   **Compliance**: Incorporate South African tax (VAT) and data protection (POPIA) requirements.
*   **Client Retention**: Enable storage and reuse of client data for repeat engagements.

## 3. Audience

*   **Primary Users**:
    *   Independent consultants in South Africa offering business proposal writing, business plan development, or business documentation.
    *   Small consulting firms (1-10 employees) serving South African SMEs, startups, or government entities.

*   **Secondary Users**:
    *   Freelancers in related fields (e.g., compliance, financial advisory) needing ZAR-based quotes.
    *   International consultants targeting South African clients requiring local compliance.

## 4. Features

### 4.1. Consultant Profile Management

*   **Profile Creation**: Input business name, consultant name, title, contact details (email, phone), logo, VAT number, and B-BBEE status for quotation branding.
*   **Compliance Fields**: Include fields for South African-specific details (e.g., CIPC registration number, SARS VAT number).
*   **Multi-Language Support**: Display profile in English (default), Afrikaans, or isiZulu for client-facing outputs.
*   **Data Persistence**: Store profile in browser local storage with POPIA-compliant encryption.

### 4.2. Client Management

*   **Add New Client**: Input client details (name, email, company name, phone, physical address for compliance).
*   **View/Edit Clients**: Display a searchable, sorted table of clients with edit functionality.
*   **Delete Client**: Remove clients from the list with confirmation prompt.
*   **Select Existing Client**: Auto-populate client details in the estimator from saved records.
*   **Data Persistence**: Store client data in local storage, encrypted to comply with POPIA.
*   **Import/Export**: Support CSV import/export of client data for integration with tools like Pastel or Excel.

### 4.3. Service Estimation

*   **Service Selection**: Choose from predefined services with embedded workflows:
    *   **Business Proposal Writing (11-21 hours)**:
        *   Initial Client Assessment (1-2h)
        *   Research and Analysis (2-4h)
        *   Proposal Structuring (1-2h)
        *   Content Development (4-8h)
        *   Review and Refinement (2-3h)
        *   Submission Support (1-2h)

    *   **Business Plan Development (19-35 hours)**:
        *   Client Needs Assessment (2-3h)
        *   Market and Industry Research (3-6h)
        *   Financial Projections (4-8h)
        *   Plan Structuring and Writing (6-10h)
        *   Review and Finalization (2-4h)
        *   Pitch Support (2-4h, optional)

    *   **Business Documentation (12-27 hours per document)**:
        *   Client Requirements Gathering (2-3h)
        *   Research and Benchmarking (2-4h)
        *   Document Structuring (2-3h)
        *   Content Development (5-10h)
        *   Review and Refinement (2-4h)
        *   Implementation Support (1-3h, optional)

*   **Custom Services**: Allow users to define custom services with tasks and estimated hours.
*   **Task Display**: Show tasks with descriptions, base hours, and adjustable fields for each service.
*   **Hourly Rate Input**: Set rate (default: R900-R1800/hour, adjustable in ZAR).
*   **Currency Selection**: Default to ZAR, with optional USD, EUR via ExchangeRate-API.
*   **VAT Calculation**: Automatically apply 15% VAT, with toggle for VAT-exempt clients.
*   **Complexity Multiplier**: Adjust hours (Standard: 1x, Complex: 1.5x, Very Complex: 2x).
*   **Number of Documents**: Scale hours for documentation services based on document count.
*   **Partial Groundwork Option**:
    *   Checkbox to indicate client-provided groundwork.
    *   Select completed tasks to exclude or reduce hours.
    *   Polishing percentage slider (0-50%, default 20%) for review work on completed tasks (e.g., 2-5h reduction for proposals, 3-8h for plans, 3-6h per document).

*   **Template Library**: Preload task templates for South African-specific outputs (e.g., SEFA-compliant business plans, POPIA-compliant policies).

### 4.4. Quote Generation

*   **Generate Quote Button**: Calculate and display the quotation in a professional format.
*   **Detailed Breakdown**:
    *   Consultant details (name, business, contact, VAT number, logo).
    *   Client details (name, company, contact, address).
    *   Project title (editable).
    *   Service and tasks (description, hours, status: Completed/Pending).
    *   Hourly rate, currency, VAT breakdown.
    *   Complexity multiplier and document count.
    *   Total hours and cost (including VAT).

*   **Recalculation**: Adjust task hours, complexity, or document count in real-time.
*   **Branding**: Apply consultant’s logo, colors, and font (e.g., Noto Serif for professional look).
*   **Preview**: Live preview of the quote during editing.
*   **Compliance**: Include VAT invoice details and B-BBEE status where relevant.

### 4.5. User Interface / User Experience (UI/UX)

*   **Modern Design**: Clean, professional aesthetic with South African business styling (e.g., neutral colors, formal fonts like Noto Serif).
*   **Responsiveness**: Optimize for desktop, tablet, and mobile (tested on devices common in South Africa, e.g., Samsung Galaxy, Huawei).
*   **Step-by-Step Wizard**: Guide users through service selection, task adjustment, and quote generation to reduce errors.
*   **Accessibility**: Support screen readers, keyboard navigation, and high-contrast mode for inclusivity.
*   **Compact Layout**: Use collapsible sections and tabs to minimize scrolling.
*   **Styling**: Use Tailwind CSS for lightweight, customizable design, replacing Bootstrap for faster performance.

## 5. Technical Considerations

*   **Frontend Framework**: React.js with JSX for dynamic, component-based UI.
*   **Styling**: Tailwind CSS for responsive, modern styling; CDN-hosted for simplicity.
*   **Routing**: `react-router-dom` for navigation (Profile, Clients, Estimator, Quotes).
*   **State Management**: React `useState`, `useEffect`, `useContext` for efficient state handling.
*   **Data Persistence**: Local storage for profiles, clients, and settings, encrypted for POPIA compliance.
*   **External API**: ExchangeRate-API for real-time currency conversion (ZAR default).
*   **Offline Support**: Cache assets and data for offline use in low-connectivity areas.
*   **Performance**: Optimize for low-bandwidth environments (e.g., minified JS/CSS, lazy loading).
*   **Security**: Sanitize inputs to prevent XSS; ensure POPIA-compliant data encryption.
*   **Browser Compatibility**: Support Chrome, Firefox, Edge, and Safari (latest versions).

## 6. Future Enhancements

*   **Quote Export**: Export quotes as PDF or Word with South African-compliant formatting (e.g., VAT invoice layout).
*   **Quote History**: Save and retrieve past quotes in local storage or optional cloud storage.
*   **User Authentication**: Add login for multi-user support or cloud syncing.
*   **Custom Templates**: Allow users to save custom service/task templates.
*   **Analytics**: Track quote frequency, average costs, and popular services.
*   **South African Integrations**: Connect with Pastel, Xero, or SARS eFiling for accounting and tax reporting.
*   **Regulatory Templates**: Expand template library for B-BBEE proposals, SETA-compliant manuals, or OHSA policies.
*   **Mobile App**: Develop a companion app for on-the-go quote creation.