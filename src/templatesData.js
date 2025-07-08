// src/templatesData.js

export const templates = {
  "Business Proposal Writing": [
    {
      id: "sefa-proposal",
      name: "SEFA-Compliant Business Proposal",
      description: "Template for proposals compliant with Small Enterprise Finance Agency requirements",
      sections: [
        "Executive Summary",
        "Business Overview", 
        "Market Analysis",
        "Financial Projections",
        "SEFA Funding Requirements",
        "Implementation Timeline",
        "Risk Assessment"
      ],
      compliance: ["SEFA", "B-BBEE", "POPIA"],
      estimatedHours: { min: 11, max: 18 }
    },
    {
      id: "idc-proposal", 
      name: "IDC Funding Proposal",
      description: "Industrial Development Corporation funding proposal template",
      sections: [
        "Project Description",
        "Economic Impact Assessment",
        "Technical Feasibility",
        "Financial Viability", 
        "Environmental Impact",
        "Social Impact"
      ],
      compliance: ["IDC", "Environmental", "Labour Relations Act"],
      estimatedHours: { min: 15, max: 21 }
    }
  ],
  "Business Plan Development": [
    {
      id: "sefa-business-plan",
      name: "SEFA-Compliant Business Plan",
      description: "Comprehensive business plan meeting SEFA funding criteria",
      sections: [
        "Executive Summary",
        "Business Description",
        "Market Analysis",
        "Organization & Management",
        "Financial Projections",
        "Funding Request",
        "Exit Strategy"
      ],
      compliance: ["SEFA", "B-BBEE", "POPIA", "Companies Act"],
      estimatedHours: { min: 25, max: 35 }
    },
    {
      id: "startup-business-plan",
      name: "Startup Business Plan", 
      description: "Business plan template for new ventures and startups",
      sections: [
        "Executive Summary",
        "Company Overview",
        "Market Research",
        "Competitive Analysis",
        "Marketing Strategy",
        "Operations Plan",
        "Financial Plan"
      ],
      compliance: ["Companies Act", "POPIA", "B-BBEE"],
      estimatedHours: { min: 19, max: 28 }
    }
  ],
  "Business Documentation": [
    {
      id: "popia-policy",
      name: "POPIA Compliance Policy",
      description: "Protection of Personal Information Act compliance documentation",
      sections: [
        "Privacy Policy",
        "Data Processing Procedures",
        "Consent Management",
        "Data Subject Rights",
        "Breach Response Plan",
        "Training Materials"
      ],
      compliance: ["POPIA", "Information Regulator"],
      estimatedHours: { min: 12, max: 20 }
    },
    {
      id: "ohsa-manual",
      name: "OHSA Safety Manual",
      description: "Occupational Health and Safety Act compliance manual",
      sections: [
        "Safety Policy Statement",
        "Risk Assessment Procedures",
        "Emergency Procedures",
        "Training Requirements",
        "Incident Reporting",
        "Compliance Checklists"
      ],
      compliance: ["OHSA", "Department of Labour"],
      estimatedHours: { min: 15, max: 25 }
    },
    {
      id: "bbbee-documentation",
      name: "B-BBEE Compliance Documentation",
      description: "Broad-Based Black Economic Empowerment compliance documents",
      sections: [
        "B-BBEE Policy",
        "Ownership Verification",
        "Skills Development Plan",
        "Enterprise & Supplier Development",
        "Socio-Economic Development",
        "Transformation Charter"
      ],
      compliance: ["B-BBEE", "dtic", "SANAS"],
      estimatedHours: { min: 18, max: 27 }
    }
  ],
  "Administrative Workflow Development": [
    {
      id: "hr-workflow",
      name: "HR Administrative Workflow",
      description: "Human Resources administrative processes and procedures",
      sections: [
        "Recruitment Process",
        "Onboarding Workflow",
        "Performance Management",
        "Leave Management",
        "Disciplinary Procedures",
        "CCMA Compliance"
      ],
      compliance: ["Labour Relations Act", "Basic Conditions of Employment Act", "Employment Equity Act"],
      estimatedHours: { min: 15, max: 25 }
    },
    {
      id: "finance-workflow",
      name: "Finance Administrative Workflow",
      description: "Financial administration and compliance workflows",
      sections: [
        "Accounts Payable Process",
        "Accounts Receivable Process",
        "Expense Management",
        "Budget Planning",
        "VAT Compliance",
        "SARS Reporting"
      ],
      compliance: ["VAT Act", "Income Tax Act", "SARS", "Companies Act"],
      estimatedHours: { min: 12, max: 22 }
    },
    {
      id: "compliance-workflow",
      name: "Compliance Administrative Workflow", 
      description: "Regulatory compliance management workflows",
      sections: [
        "POPIA Compliance Process",
        "OHSA Compliance Process",
        "B-BBEE Reporting",
        "CIPC Annual Returns",
        "Industry-Specific Compliance",
        "Audit Preparation"
      ],
      compliance: ["POPIA", "OHSA", "B-BBEE", "CIPC", "Companies Act"],
      estimatedHours: { min: 18, max: 30 }
    }
  ]
};

export const getTemplatesByService = (serviceName) => {
  return templates[serviceName] || [];
};

export const getTemplateById = (serviceCategory, templateId) => {
  const serviceTemplates = templates[serviceCategory] || [];
  return serviceTemplates.find(template => template.id === templateId);
};

export const getAllCompliances = () => {
  const compliances = new Set();
  Object.values(templates).forEach(serviceTemplates => {
    serviceTemplates.forEach(template => {
      template.compliance.forEach(comp => compliances.add(comp));
    });
  });
  return Array.from(compliances).sort();
};