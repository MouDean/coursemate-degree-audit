// Fictional demo records only. Never commit real student data.
export const studentDatabase = [
  {
    "id": "DEMO001",
    "name": "Demo Student 1",
    "password": "demo-student",
    "cgpa": 3.5,
    "credits": 3,
    "program": "Educational Leadership \u2014 illustrative plan",
    "studyPlan": "EDLDB",
    "courseStatus": {
      "EDU 501": "A",
      "EDU 506": "IP"
    },
    "grades": {
      "EDU 501": "B+"
    },
    "isActive": true
  },
  {
    "id": "DEMO002",
    "name": "Demo Student 2",
    "password": "demo-student",
    "cgpa": 3.5,
    "credits": 3,
    "program": "Educational Leadership \u2014 illustrative plan",
    "studyPlan": "EDLDC",
    "courseStatus": {
      "EDUL 520": "A",
      "EDUL 525": "IP"
    },
    "grades": {
      "EDUL 520": "B+"
    },
    "isActive": true
  },
  {
    "id": "admin",
    "name": "Demo Admin",
    "password": "demo-admin",
    "cgpa": 0,
    "credits": 0,
    "program": "Demo Administration",
    "studyPlan": "EDLDB",
    "courseStatus": {},
    "grades": {},
    "isActive": true
  }
];

// Study Plan Definitions - Updated with correct course structure
export const studyPlans = {
  EDLDB: {
    name: "Master of Education in Leadership MED (EDLDB)",
    totalCredits: 33,
    preCoreCourses: [], // No pre-core courses in this plan
    coreCourses: [
      { code: "EDU 501", title: "Leadership in Education: Theory and Practice", credits: 3, prerequisites: [] },
      { code: "EDU 502", title: "Institutional Enhancement and Quality Assurance", credits: 3, prerequisites: ["EDU 501"] },
      { code: "EDU 503", title: "Curriculum Development and Program Assessment", credits: 3, prerequisites: ["EDU 501"] },
      { code: "EDU 504", title: "Big Data and Information Systems in Education", credits: 3, prerequisites: ["EDU 501", "EDU 503"] },
      { code: "EDU 505", title: "Professional Development and Instructional Supervision", credits: 3, prerequisites: ["EDU 501", "EDU 503"] },
      { code: "EDU 506", title: "Research Methodology in Education", credits: 3, prerequisites: [] },
      { code: "EDU 507", title: "Innovation and Entrepreneurship in Education", credits: 3, prerequisites: [] },
      { code: "EDU 580", title: "Thesis", credits: 6, prerequisites: ["EDU 506", "completion of 18 Core credits"] }
    ],
    electives: [
      { code: "EDU 520", title: "Pedagogies for Diversity", credits: 3, prerequisites: [] },
      { code: "EDU 521", title: "Ethical Leadership and Decision Making in Educational Contexts", credits: 3, prerequisites: [] },
      { code: "EDU 522", title: "Comparative Education", credits: 3, prerequisites: [] },
      { code: "EDU 523", title: "Contemporary Trends and Issues in Educational Leadership", credits: 3, prerequisites: [] }
    ]
  },
  EDLDC: {
    name: "Master of Education in Educational Leadership (EDLDC)",
    totalCredits: 30,
    preCoreCourses: [
      { code: "EDUC 510-PC", title: "Educational Foundations & Classroom Management", credits: 3, prerequisites: [] },
      { code: "EDUC 515-PC", title: "School Curriculum", credits: 3, prerequisites: [] }
    ],
    coreCourses: [
      { code: "EDUL 520", title: "Foundations for Inclusive Education", credits: 3, prerequisites: [] },
      { code: "EDUL 525", title: "Educational Psychology and Learning", credits: 3, prerequisites: [] },
      { code: "EDUL 620", title: "Leadership in Education: Theory in Practice", credits: 3, prerequisites: [] },
      { code: "EDUL 625", title: "Leadership for Diversity, Equity, and Inclusion", credits: 3, prerequisites: [] },
      { code: "EDUL 630", title: "Curriculum Development & Program Assessment", credits: 3, prerequisites: [] },
      { code: "EDUL 635", title: "Analytics for Making Data Driven Decisions", credits: 3, prerequisites: [] },
      { code: "EDUL 640", title: "Continuous Improvement for Organizational Excellence and Quality Assurance", credits: 3, prerequisites: ["EDUL 635"] },
      { code: "EDUL 645", title: "Strategies for Effective Educational Resource Management", credits: 3, prerequisites: [] },
      { code: "EDUL 680", title: "Research (Thesis)", credits: 6, prerequisites: ["Completion of 18 credit hours"] }
    ],
    electives: []
  }
};

// Available courses from both study plans - Updated with correct course structure
export const availableCourses = [
  // EDLDB Core Courses (30 credits total)
  { code: "EDU 501", title: "Leadership in Education: Theory and Practice", credits: 3, prerequisites: [], studyPlan: "EDLDB" },
  { code: "EDU 502", title: "Institutional Enhancement and Quality Assurance", credits: 3, prerequisites: ["EDU 501"], studyPlan: "EDLDB" },
  { code: "EDU 503", title: "Curriculum Development and Program Assessment", credits: 3, prerequisites: ["EDU 501"], studyPlan: "EDLDB" },
  { code: "EDU 504", title: "Big Data and Information Systems in Education", credits: 3, prerequisites: ["EDU 501", "EDU 503"], studyPlan: "EDLDB" },
  { code: "EDU 505", title: "Professional Development and Instructional Supervision", credits: 3, prerequisites: ["EDU 501", "EDU 503"], studyPlan: "EDLDB" },
  { code: "EDU 506", title: "Research Methodology in Education", credits: 3, prerequisites: [], studyPlan: "EDLDB" },
  { code: "EDU 507", title: "Innovation and Entrepreneurship in Education", credits: 3, prerequisites: [], studyPlan: "EDLDB" },
  { code: "EDU 580", title: "Thesis", credits: 6, prerequisites: ["EDU 506", "completion of 18 Core credits"], studyPlan: "EDLDB" },
  
  // EDLDB Electives (Core Electives - 6 credits)
  { code: "EDU 520", title: "Pedagogies for Diversity", credits: 3, prerequisites: [], studyPlan: "EDLDB" },
  { code: "EDU 521", title: "Ethical Leadership and Decision Making in Educational Contexts", credits: 3, prerequisites: [], studyPlan: "EDLDB" },
  { code: "EDU 522", title: "Comparative Education", credits: 3, prerequisites: [], studyPlan: "EDLDB" },
  { code: "EDU 523", title: "Contemporary Trends and Issues in Educational Leadership", credits: 3, prerequisites: [], studyPlan: "EDLDB" },
  
  // EDLDC Core Courses
  { code: "EDUL 520", title: "Foundations for Inclusive Education", credits: 3, prerequisites: [], studyPlan: "EDLDC" },
  { code: "EDUL 525", title: "Educational Psychology and Learning", credits: 3, prerequisites: [], studyPlan: "EDLDC" },
  { code: "EDUL 620", title: "Leadership in Education: Theory in Practice", credits: 3, prerequisites: [], studyPlan: "EDLDC" },
  { code: "EDUL 625", title: "Leadership for Diversity, Equity, and Inclusion", credits: 3, prerequisites: [], studyPlan: "EDLDC" },
  { code: "EDUL 630", title: "Curriculum Development & Program Assessment", credits: 3, prerequisites: [], studyPlan: "EDLDC" },
  { code: "EDUL 635", title: "Analytics for Making Data Driven Decisions", credits: 3, prerequisites: [], studyPlan: "EDLDC" },
  { code: "EDUL 640", title: "Continuous Improvement for Organizational Excellence and Quality Assurance", credits: 3, prerequisites: ["EDUL 635"], studyPlan: "EDLDC" },
  { code: "EDUL 645", title: "Strategies for Effective Educational Resource Management", credits: 3, prerequisites: [], studyPlan: "EDLDC" },
  { code: "EDUL 680", title: "Research (Thesis)", credits: 6, prerequisites: ["Completion of 18 credit hours"], studyPlan: "EDLDC" }
];
