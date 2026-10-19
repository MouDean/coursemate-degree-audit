// MEDEL Study Plan Data Structure
export const studyPlan = {
  program: "Master of Education in Educational Leadership",
  code: "MEDEL",
  totalCredits: 33,
  
  preCoreCourses: [
    {
      code: "EDC 471(E)",
      title: "Classroom Management in Inclusive Setting",
      credits: 3,
      prerequisites: []
    },
    {
      code: "EDC 472(E)",
      title: "Special and Inclusive Education",
      credits: 3,
      prerequisites: []
    },
    {
      code: "EDC 473(E)",
      title: "Educational Psychology and Learning",
      credits: 3,
      prerequisites: []
    },
    {
      code: "EDC 474(E)",
      title: "School Curriculum",
      credits: 3,
      prerequisites: []
    },
    {
      code: "EDC 475(E)",
      title: "Educational Technology",
      credits: 3,
      prerequisites: []
    }
  ],
  
  coreCourses: [
    {
      code: "EDU 501",
      title: "Leadership in Education: Theory and Practice",
      credits: 3,
      prerequisites: []
    },
    {
      code: "EDU 502",
      title: "Institutional Enhancement and Quality Assurance",
      credits: 3,
      prerequisites: ["EDU 501"]
    },
    {
      code: "EDU 503",
      title: "Curriculum Development and Program Assessment",
      credits: 3,
      prerequisites: ["EDU 501"]
    },
    {
      code: "EDU 504",
      title: "Big Data and Information Systems in Education",
      credits: 3,
      prerequisites: ["EDU 501", "EDU 503"]
    },
    {
      code: "EDU 505",
      title: "Professional Development and Instructional Supervision",
      credits: 3,
      prerequisites: ["EDU 501", "EDU 503"]
    },
    {
      code: "EDU 506",
      title: "Research Methodology in Education",
      credits: 3,
      prerequisites: []
    },
    {
      code: "EDU 507",
      title: "Innovation and Entrepreneurship in Education",
      credits: 3,
      prerequisites: ["EDU 501"]
    },
    {
      code: "EDU 580",
      title: "Thesis",
      credits: 6,
      prerequisites: ["EDU 506", "completion of 18 Core credits"]
    }
  ],
  
  coreElectives: [
    {
      code: "CE1",
      title: "Core Elective I",
      credits: 3,
      prerequisites: []
    },
    {
      code: "CE2",
      title: "Core Elective II",
      credits: 3,
      prerequisites: []
    }
  ],
  
  electives: [
    {
      code: "EDU 520",
      title: "Pedagogies for Diversity",
      credits: 3,
      prerequisites: []
    },
    {
      code: "EDU 521",
      title: "Ethical Leadership and Decision Making in Educational Contexts",
      credits: 3,
      prerequisites: []
    },
    {
      code: "EDU 522",
      title: "Comparative Education",
      credits: 3,
      prerequisites: []
    },
    {
      code: "EDU 523",
      title: "Contemporary Trends and Issues in Educational Leadership",
      credits: 3,
      prerequisites: []
    }
  ]
};

// Sample semester structure
export const semesterStructure = {
  year1: {
    fall: {
      termA: ["EDU501", "EDU502"],
      termB: ["EDU503", "EDU504"]
    },
    spring: {
      termA: ["EDU505", "EDU506"],
      termB: ["EDU507", "CE1"]
    }
  },
  year2: {
    fall: {
      termA: ["CE2"],
      termB: []
    },
    spring: {
      termA: [],
      termB: ["EDU580"]
    }
  }
};

// Status types
export const statusTypes = {
  COMPLETED: 'A',
  FAILED: 'X',
  IN_PROGRESS: 'IP',
  PLANNED: 'P',
  NOT_TAKEN: ''
};

// Grade mapping
export const gradeMapping = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0
};

