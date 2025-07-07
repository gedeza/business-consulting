
export const services = {
  "Business Proposal Writing": {
    description: "Crafting compelling and persuasive proposals to help you win new business and secure funding.",
    tasks: [
      { name: "Initial Client Assessment", hours: 1, description: "A thorough consultation to understand your business, goals, and specific proposal requirements." },
      { name: "Research and Analysis", hours: 2, description: "In-depth research of your target audience, market, and competitors to inform the proposal strategy." },
      { name: "Proposal Structuring", hours: 1, description: "Creating a logical and professional structure for the proposal to ensure clarity and impact." },
      { name: "Content Development", hours: 4, description: "Writing clear, concise, and persuasive content that highlights your strengths and value proposition." },
      { name: "Review and Refinement", hours: 2, description: "Multiple rounds of review and editing to ensure the proposal is error-free and polished." },
      { name: "Submission Support", hours: 1, description: "Assistance with the final submission process to ensure all requirements are met." },
    ],
    groundworkReduction: true,
  },
  "Business Plan Development": {
    description: "Developing a comprehensive and strategic business plan to guide your decisions and attract investors.",
    tasks: [
      { name: "Client Needs Assessment", hours: 2, description: "A deep dive into your business model, objectives, and financial goals." },
      { name: "Market and Industry Research", hours: 3, description: "Comprehensive analysis of the market landscape, industry trends, and competitive positioning." },
      { name: "Financial Projections", hours: 4, description: "Creating detailed financial forecasts, including income statements, balance sheets, and cash flow statements." },
      { name: "Plan Structuring and Writing", hours: 6, description: "Structuring and writing the complete business plan document, including all key sections." },
      { name: "Review and Finalization", hours: 2, description: "Thorough review of the business plan for accuracy, completeness, and impact." },
      { name: "Pitch Support (Optional)", hours: 2, description: "Assistance in preparing and delivering a compelling pitch to investors or stakeholders." },
    ],
    groundworkReduction: true,
  },
  "Business Documentation": {
    description: "Creating professional and effective business documents, such as reports, manuals, and presentations.",
    tasks: [
      { name: "Client Requirements Gathering", hours: 2, description: "Detailed consultation to understand the purpose, audience, and key requirements of the document." },
      { name: "Research and Benchmarking", hours: 2, description: "Gathering and analyzing information to ensure the document is accurate, relevant, and up-to-date." },
      { name: "Document Structuring", hours: 2, description: "Creating a clear and logical structure for the document to enhance readability and usability." },
      { name: "Content Development (per document)", hours: 5, perDocument: true, description: "Writing and formatting the content for each document to meet the specific requirements." },
      { name: "Review and Refinement (per document)", hours: 2, perDocument: true, description: "Reviewing and editing each document to ensure quality, accuracy, and consistency." },
      { name: "Implementation Support (Optional)", hours: 1, perDocument: false, description: "Providing support and guidance on how to effectively use and implement the documentation." },
    ],
    groundworkReduction: true,
    requiresDocCount: true,
  },
};
