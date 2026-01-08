const XLSX = require('xlsx');
const path = require('path');

// Define data for each screen - ALL IN ENGLISH
const screens = {
  'Login': {
    overview: [
      ['Field', 'Value'],
      ['Screen ID', 'AUTH-LOGIN'],
      ['Routes', '/auth/signin, /auth/signup, /auth/forgot-password, /auth/verify-code, /auth/reset-password'],
      ['Purpose', 'Authenticate users before accessing the system'],
      ['Target Users', 'All employees (Staff, Manager, Admin)'],
      ['Entry Points', 'App launch, Logout, Session expired'],
      ['Platforms', 'Web App (Desktop/PC), iPad App (iOS)'],
    ],
    screens: [
      ['Screen', 'Route', 'Purpose'],
      ['Sign In', '/auth/signin', 'Login to the system'],
      ['Sign Up', '/auth/signup', 'Register new account'],
      ['Forgot Password', '/auth/forgot-password', 'Request password reset'],
      ['Code Verification', '/auth/verify-code', 'Verify OTP code'],
      ['Reset Password', '/auth/reset-password', 'Set new password'],
    ],
    userStories: [
      ['ID', 'As a...', 'I want to...', 'So that...'],
      ['US-01', 'Staff', 'Sign in with my credentials', 'I can access the system'],
      ['US-02', 'Staff', 'Reset my password', 'I can recover my account'],
      ['US-03', 'Staff', 'Remember my login', "I don't have to sign in every time"],
      ['US-04', 'New User', 'Sign up for an account', 'I can use the system'],
    ],
    components: [
      ['Component', 'Description'],
      ['Header', 'Logo "AOI SORA", title "Welcome back"'],
      ['Form', 'Email/Phone input, Password input'],
      ['Options', 'Remember 30 days checkbox, Forgot password link'],
      ['Actions', 'Sign in button, Google sign in button'],
      ['Footer', 'Sign up link'],
    ],
    api: [
      ['Method', 'Endpoint', 'Description'],
      ['POST', '/api/v1/auth/login', 'User login'],
      ['POST', '/api/v1/auth/logout', 'User logout'],
      ['GET', '/api/v1/auth/me', 'Get current user info'],
      ['POST', '/api/v1/auth/forgot-password', 'Send OTP via email'],
      ['POST', '/api/v1/auth/verify-code', 'Verify OTP code'],
      ['POST', '/api/v1/auth/reset-password', 'Set new password'],
      ['POST', '/api/v1/auth/resend-code', 'Resend OTP code'],
      ['POST', '/api/v1/auth/check-password-strength', 'Check password strength'],
    ],
    status: [
      ['Feature', 'Backend', 'Frontend', 'Deploy', 'Notes'],
      ['Sign In', 'Done', 'Done', '[DEMO]', 'Full flow'],
      ['Sign Up', 'Pending', 'Pending', '[DEMO]', '-'],
      ['Forgot Password', 'Done', 'Pending', '[PROD-ONLY]', 'Requires SMTP server'],
      ['Code Verification', 'Done', 'Pending', '[PROD-ONLY]', 'Requires SMTP server'],
      ['Reset Password', 'Done', 'Pending', '[PROD-ONLY]', 'Requires SMTP server'],
      ['Google OAuth', 'Pending', 'Pending', '[PROD-ONLY]', 'Requires Google API setup'],
    ],
  },

  'List Task': {
    overview: [
      ['Field', 'Value'],
      ['Screen ID', 'WS-LIST-TASK'],
      ['Route', '/tasks/list'],
      ['Purpose', 'Display task groups list with filtering, sorting and navigation capabilities'],
      ['Target Users', 'Manager, Staff'],
      ['Entry Points', 'Sidebar menu, Dashboard quick link'],
      ['Platforms', 'Web App (Desktop/PC), iPad App (iOS)'],
    ],
    userStories: [
      ['ID', 'As a...', 'I want to...', 'So that...'],
      ['US-01', 'Manager', 'View all task groups', 'I can monitor team progress'],
      ['US-02', 'Manager', 'Filter tasks by date/dept/status', 'I can focus on specific tasks'],
      ['US-03', 'Manager', 'Sort tasks by column', 'I can organize the list'],
      ['US-04', 'Staff', 'View my assigned tasks', 'I know what to work on'],
      ['US-05', 'Manager', 'Create new task', 'I can assign work to team'],
    ],
    components: [
      ['Component', 'Description'],
      ['Header', 'Title "List tasks"'],
      ['DatePicker', 'DAY/WEEK/CUSTOM date selection'],
      ['Search', 'Text search for task name/dept'],
      ['Filter Button', 'Opens filter modal'],
      ['ADD NEW Button', 'Navigate to create task'],
      ['Data Table', 'Task groups with sortable columns'],
      ['Pagination', '10 items per page'],
      ['Live Indicator', 'WebSocket connection status'],
    ],
    navigation: [
      ['Action', 'Destination', 'Description'],
      ['Click row', '/tasks/{id}', 'Navigate to Task Detail'],
      ['Click ADD NEW', '/tasks/new', 'Navigate to Create Task'],
      ['Click Filter', 'Modal', 'Open Filter Modal'],
      ['Click expand', '-', 'Expand row to show sub-tasks'],
    ],
    api: [
      ['Method', 'Endpoint', 'Description'],
      ['GET', '/api/v1/tasks', 'Get task list with filters, sorting, pagination'],
      ['GET', '/api/v1/tasks/{id}', 'Get task detail'],
      ['GET', '/api/v1/departments', 'Get department list for filter'],
    ],
    status: [
      ['Feature', 'Backend', 'Frontend', 'Deploy', 'Notes'],
      ['Task List Table', 'Done', 'Done', '[DEMO]', 'API integrated'],
      ['DatePicker (DAY/WEEK/CUSTOM)', 'Done', 'Done', '[DEMO]', 'Server-side date range filter'],
      ['Search', 'Done', 'Done', '[DEMO]', 'Server-side partial match, debounced 300ms'],
      ['Filter Modal', 'Done', 'Done', '[DEMO]', 'Server-side (dept, status, hqCheck)'],
      ['Sorting', 'Done', 'Done', '[DEMO]', 'Server-side via Spatie QueryBuilder'],
      ['Pagination', 'Done', 'Done', '[DEMO]', 'Server-side, 10 items/page'],
      ['Column Quick Filters', '-', 'Done', '[DEMO]', 'Client-side (dept, status, hqCheck)'],
      ['Row Expansion', '-', 'Done', '[DEMO]', 'Show sub-tasks'],
      ['Real-time Updates', 'Done', 'Done', '[PROD-ONLY]', 'Requires WebSocket server (Reverb)'],
      ['Export Excel/PDF', 'Pending', 'Pending', '[DEMO]', '-'],
    ],
  },

  'Assign Task': {
    overview: [
      ['Field', 'Value'],
      ['Screen ID', 'WS-ASSIGN-TASK'],
      ['Route', '/tasks/new'],
      ['Purpose', 'Create new task groups with multi-level hierarchical structure (up to 5 levels)'],
      ['Target Users', 'HQ (Headquarter) Staff'],
      ['Entry Points', '"+ ADD NEW" button on Task List'],
      ['Platforms', 'Web App (Desktop/PC)'],
    ],
    userStories: [
      ['ID', 'As a...', 'I want to...', 'So that...'],
      ['US-01', 'HQ Staff', 'Create a new task group', 'I can assign work to stores'],
      ['US-02', 'HQ Staff', 'Add multiple task levels (2-5)', 'I can create detailed task breakdowns'],
      ['US-03', 'HQ Staff', 'View task hierarchy in Maps tab', 'I can visualize task structure'],
      ['US-04', 'HQ Staff', 'Save task as draft', 'I can continue editing later'],
      ['US-05', 'HQ Staff', 'Submit task for approval', 'I can start the task workflow'],
    ],
    components: [
      ['Component', 'Description'],
      ['Header', 'Breadcrumb navigation + Detail/Maps tabs'],
      ['Task Level Cards', 'Hierarchical cards for each task level (1-5)'],
      ['Section Accordion', 'Collapsible sections: Task Info, Instructions, Scope, Approval'],
      ['Footer', 'Save as Draft / Submit buttons'],
    ],
    sections: [
      ['Section', 'Content'],
      ['A. Task Information', 'Task Type, Applicable Period, Execution Time'],
      ['B. Instructions', 'Task Type (Image/Document/Checklist), Manual Link, Note, Photo Guidelines'],
      ['C. Scope', 'Region, Zone, Area, Store, Store Leader, Specific Staff'],
      ['D. Approval Process', 'Initiator, Leader, HOD'],
    ],
    navigation: [
      ['Action', 'Destination', 'Description'],
      ['Click "+ ADD NEW" on Task List', '/tasks/new', 'Open create task form'],
      ['Click "List task" breadcrumb', '/tasks/list', 'Return to list'],
      ['Click "Save as draft"', '/tasks/list', 'Save draft and redirect'],
      ['Click "Submit"', '/tasks/list', 'Submit and redirect'],
      ['Click "Maps" tab', '-', 'Show hierarchical flowchart view'],
    ],
    api: [
      ['Method', 'Endpoint', 'Description'],
      ['POST', '/api/v1/tasks', 'Create new task (SUBMITTED)'],
      ['POST', '/api/v1/tasks/draft', 'Save draft (DRAFT)'],
      ['POST', '/api/v1/tasks/images', 'Upload task images'],
      ['GET', '/api/v1/regions', 'Get region list'],
      ['GET', '/api/v1/zones', 'Get zones by region'],
      ['GET', '/api/v1/areas', 'Get areas by zone'],
      ['GET', '/api/v1/stores', 'Get stores by area'],
    ],
    status: [
      ['Feature', 'Backend', 'Frontend', 'Deploy', 'Notes'],
      ['Add Task Page', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Task Level Cards', '-', 'Done', '[DEMO]', 'UI only'],
      ['Section Accordion', '-', 'Done', '[DEMO]', 'Frontend only'],
      ['Detail Tab', '-', 'Done', '[DEMO]', 'Form inputs'],
      ['Maps Tab', '-', 'Done', '[DEMO]', 'Flowchart view'],
      ['Image Upload', 'Pending', 'Done', '[LOCAL-DEV]', 'Storage needed'],
      ['API Integration', 'Pending', 'Pending', '[DEMO]', '-'],
    ],
  },

  'Detail Task': {
    overview: [
      ['Field', 'Value'],
      ['Screen ID', 'WS-DETAIL-TASK'],
      ['Routes', '/tasks/[id], /tasks/detail (auto-redirect)'],
      ['Purpose', 'Display detailed task information from HQ to stores with multiple view modes'],
      ['Target Users', 'Manager, Staff'],
      ['Entry Points', 'Task List row click, Sidebar "Detail" menu'],
      ['Platforms', 'Web App (Desktop/PC), iPad App (iOS)'],
    ],
    userStories: [
      ['ID', 'As a...', 'I want to...', 'So that...'],
      ['US-01', 'Manager', 'View task details with store results', 'I can monitor store completion status'],
      ['US-02', 'Manager', 'Switch between Results/Comment/Staff views', 'I can see different aspects of task progress'],
      ['US-03', 'Manager', 'Filter results by region/area/store', 'I can focus on specific locations'],
      ['US-04', 'Manager', 'View workflow steps', 'I can track task approval process'],
      ['US-05', 'Staff', 'View task instructions and images', 'I know what to do for the task'],
      ['US-06', 'Manager', 'Like and comment on store results', 'I can provide feedback to stores'],
    ],
    components: [
      ['Component', 'Description'],
      ['Task Header', 'Level badge, name, dates, status, statistics cards'],
      ['Filter Bar', 'Region/Area/Store dropdowns, status filter, search, view mode toggle'],
      ['Store Results', 'Cards showing store completion with images and comments'],
      ['Staff Cards', 'Individual staff progress with requirements grid'],
      ['Workflow Panel', 'Slide-in panel showing task approval steps'],
    ],
    viewModes: [
      ['Mode', 'Description', 'Content'],
      ['Results View', 'Task results grouped by store', 'Store cards with images, comments'],
      ['Comment View', 'All comments across stores', 'Store cards with expanded comments, no images'],
      ['Staff View', 'Individual staff progress', 'Staff cards with requirements grid'],
    ],
    navigation: [
      ['Action', 'Destination', 'Description'],
      ['Click row in Task List', '/tasks/{id}', 'Display detail of specific task'],
      ['Click "Detail" menu in Sidebar', '/tasks/detail', 'Auto-redirect to nearest deadline task'],
      ['Click breadcrumb "List task"', '/tasks/list', 'Return to task list'],
      ['Click workflow icon', '-', 'Open Workflow Steps Panel'],
    ],
    api: [
      ['Method', 'Endpoint', 'Description'],
      ['GET', '/api/v1/tasks/{id}', 'Get full task details'],
      ['GET', '/api/v1/tasks/{id}/stores', 'Get results by store'],
      ['GET', '/api/v1/tasks/{id}/staffs', 'Get results by staff'],
      ['GET', '/api/v1/tasks/{id}/comments', 'Get comments'],
      ['POST', '/api/v1/tasks/{id}/comments', 'Add comment'],
      ['POST', '/api/v1/tasks/{id}/like', 'Like a task result'],
      ['POST', '/api/v1/tasks/{id}/reminder', 'Send reminder to staff'],
    ],
    status: [
      ['Feature', 'Backend', 'Frontend', 'Deploy', 'Notes'],
      ['Task Header', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Filter Bar', 'Pending', 'Done', '[DEMO]', 'Client-side filtering'],
      ['Store Results View', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Staff View', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Comments Section', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Image Lightbox', '-', 'Done', '[DEMO]', 'Frontend only'],
      ['Workflow Steps Panel', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Like/Unlike', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Send Reminder', 'Pending', 'Done', '[PROD-ONLY]', 'Requires notification system'],
      ['API Integration', 'Pending', 'Pending', '[DEMO]', '-'],
    ],
  },

  'Task Library': {
    overview: [
      ['Field', 'Value'],
      ['Screen ID', 'WS-TASK-LIBRARY'],
      ['Route', '/tasks/library'],
      ['Purpose', 'Manage and organize common task templates for recurring office and store operations'],
      ['Target Users', 'HQ (Headquarter) Staff'],
      ['Entry Points', 'Sidebar "Task Library" menu'],
      ['Platforms', 'Web App (Desktop/PC)'],
    ],
    userStories: [
      ['ID', 'As a...', 'I want to...', 'So that...'],
      ['US-01', 'HQ Staff', 'View all task templates', 'I can see available templates for task creation'],
      ['US-02', 'HQ Staff', 'Filter tasks by Office/Store tab', 'I can focus on relevant task types'],
      ['US-03', 'HQ Staff', 'Filter tasks by department', 'I can find department-specific templates'],
      ['US-04', 'HQ Staff', 'Search task templates', 'I can quickly find specific tasks'],
      ['US-05', 'HQ Staff', 'Create new task template', 'I can add reusable task templates'],
      ['US-06', 'HQ Staff', 'Edit/Delete/Duplicate templates', 'I can manage existing templates'],
    ],
    components: [
      ['Component', 'Description'],
      ['Header', 'Title "TASK LIBRARY" with "+ Create New" button'],
      ['Tab Navigation', 'OFFICE TASKS / STORE TASKS tabs'],
      ['Department Filter Chips', 'Quick filter by Admin, HR, Legal, etc.'],
      ['Search Bar', 'Text search with filter button'],
      ['Task Group Sections', 'Expandable department groups with task tables'],
    ],
    taskTypes: [
      ['Type', 'Description'],
      ['Daily', 'Daily recurring tasks'],
      ['Weekly', 'Weekly recurring tasks'],
      ['Ad hoc', 'One-time tasks'],
    ],
    navigation: [
      ['Action', 'Destination', 'Description'],
      ['Click Sidebar "Task Library"', '/tasks/library', 'Open Task Library'],
      ['Click "+ Create New"', '-', 'Open create task form'],
      ['Click Task Row', '-', 'Open task detail/edit form'],
      ['Click Edit menu', '-', 'Edit task template'],
      ['Click Duplicate menu', '-', 'Create copy of task'],
    ],
    api: [
      ['Method', 'Endpoint', 'Description'],
      ['GET', '/api/v1/task-library', 'Get task template list'],
      ['GET', '/api/v1/task-library/{id}', 'Get task template detail'],
      ['POST', '/api/v1/task-library', 'Create new task template'],
      ['PUT', '/api/v1/task-library/{id}', 'Update template'],
      ['DELETE', '/api/v1/task-library/{id}', 'Delete template'],
      ['POST', '/api/v1/task-library/{id}/duplicate', 'Duplicate template'],
    ],
    status: [
      ['Feature', 'Backend', 'Frontend', 'Deploy', 'Notes'],
      ['Task Library Page', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Tab Navigation', '-', 'Done', '[DEMO]', 'Frontend only'],
      ['Department Filter Chips', '-', 'Done', '[DEMO]', 'Frontend only'],
      ['Search', 'Pending', 'Done', '[DEMO]', 'Client-side'],
      ['Task Group Table', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['CRUD Operations', 'Pending', 'Pending', '[DEMO]', '-'],
    ],
  },

  'Report': {
    overview: [
      ['Field', 'Value'],
      ['Screen ID', 'WS-REPORT'],
      ['Route', '/tasks/report'],
      ['Purpose', 'Display task completion statistics across stores and departments with weekly tracking'],
      ['Target Users', 'HQ (Headquarter) Staff, Manager'],
      ['Entry Points', 'Sidebar "Report"'],
      ['Platforms', 'Web App (Desktop/PC)'],
    ],
    userStories: [
      ['ID', 'As a...', 'I want to...', 'So that...'],
      ['US-01', 'Manager', 'View weekly completion by store', 'I can track store performance'],
      ['US-02', 'Manager', 'See completion % with color coding', 'I can quickly identify issues'],
      ['US-03', 'Manager', 'View stacked bar chart', 'I can see completion trends'],
      ['US-04', 'Manager', 'Filter by department', 'I can focus on specific areas'],
      ['US-05', 'Manager', 'View detailed store breakdown', 'I can see department-level data'],
      ['US-06', 'Manager', 'Export report', 'I can share with stakeholders'],
    ],
    components: [
      ['Component', 'Description'],
      ['Week Selector Grid', 'Store x Week matrix with completion %'],
      ['Stacked Bar Chart', 'Visual completion trends by week'],
      ['Filter Dropdown', 'Department filter'],
      ['Store Report Table', 'Detailed breakdown by department'],
    ],
    colorCoding: [
      ['Completion %', 'Color'],
      ['100%', 'Green'],
      ['90-99%', 'Light Green'],
      ['80-89%', 'Yellow'],
      ['70-79%', 'Orange'],
      ['< 70%', 'Red'],
    ],
    navigation: [
      ['Action', 'Destination', 'Description'],
      ['Click Sidebar "Report"', '/tasks/report', 'Open Report screen'],
      ['Click week header', '-', 'Filter data by week'],
      ['Click store row', '-', 'Drill down to store detail'],
      ['Click Export', '-', 'Download report'],
    ],
    api: [
      ['Method', 'Endpoint', 'Description'],
      ['GET', '/api/v1/reports/weekly-completion', 'Get weekly completion data'],
      ['GET', '/api/v1/reports/store-weekly', 'Get store weekly grid'],
      ['GET', '/api/v1/reports/store-detail', 'Get detailed store report'],
    ],
    status: [
      ['Feature', 'Backend', 'Frontend', 'Deploy', 'Notes'],
      ['Report Page', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Weekly Completion Grid', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Stacked Bar Chart', '-', 'Done', '[DEMO]', 'Custom chart'],
      ['Store Report Table', 'Pending', 'Done', '[DEMO]', 'Mock data'],
      ['Export Excel/PDF', 'Pending', 'Pending', '[LOCAL-DEV]', '-'],
      ['API Integration', 'Pending', 'Pending', '[DEMO]', '-'],
    ],
  },

  'User Management': {
    overview: [
      ['Field', 'Value'],
      ['Screen ID', 'WS-USER-MANAGEMENT'],
      ['Route', '/tasks/info'],
      ['Purpose', 'Manage and track user lists (Hierarchy), Team members and organization structure'],
      ['Target Users', 'HQ staff with management permissions'],
      ['Entry Points', 'Sidebar "User Management" > "User information"'],
      ['Platforms', 'Web App (Desktop/PC)'],
    ],
    userStories: [
      ['ID', 'As a...', 'I want to...', 'So that...'],
      ['US-01', 'HQ Manager', 'View organization hierarchy', 'I can see team structure'],
      ['US-02', 'HQ Manager', 'Switch between department tabs', 'I can view different departments'],
      ['US-03', 'HQ Manager', 'Expand/collapse departments', 'I can navigate the hierarchy'],
      ['US-04', 'HQ Manager', 'View employee details', 'I can see staff information'],
      ['US-05', 'HQ Manager', 'Add new teams/members', 'I can grow the organization'],
      ['US-06', 'HQ Manager', 'Import users from Excel', 'I can bulk add users'],
      ['US-07', 'HQ Manager', 'Manage permissions', 'I can control access rights'],
    ],
    components: [
      ['Component', 'Description'],
      ['Header', 'Title "USER INFORMATION" with Permissions and Import buttons'],
      ['Tab Navigation', 'Department tabs: SMBU, Admin, OP, GP, etc.'],
      ['Hierarchy Tree', 'Expandable tree showing departments, teams, members'],
      ['Employee Detail Modal', 'Popup showing full employee information'],
      ['Permissions Modal', 'Configure user/role permissions'],
      ['Import Excel Modal', 'Upload and preview Excel data'],
    ],
    jobGrades: [
      ['Code', 'Title'],
      ['G1', 'Officer'],
      ['G3', 'Executive'],
      ['G4', 'Deputy Manager'],
      ['G5', 'Manager'],
      ['G6', 'General Manager'],
      ['G7', 'Senior General Manager'],
      ['G8', 'CCO'],
    ],
    navigation: [
      ['Action', 'Destination', 'Description'],
      ['Click Sidebar "User information"', '/tasks/info', 'Open User Information'],
      ['Click department tab', '-', 'Show department hierarchy'],
      ['Click member card', '-', 'Open Employee Detail Modal'],
      ['Click "+ Add new member"', '-', 'Open Add Team/Member Modal'],
      ['Click "Permissions" button', '-', 'Open Permissions Modal'],
      ['Click "Import Excel" button', '-', 'Open Import Modal'],
    ],
    api: [
      ['Method', 'Endpoint', 'Description'],
      ['GET', '/api/v1/user-info/smbu-hierarchy', 'Get SMBU hierarchy'],
      ['GET', '/api/v1/user-info/departments/{id}/hierarchy', 'Get department hierarchy'],
      ['GET', '/api/v1/user-info/staff/{id}', 'Get staff detail'],
      ['POST', '/api/v1/user-info/teams', 'Create new team'],
      ['POST', '/api/v1/user-info/members', 'Create new member'],
      ['POST', '/api/v1/user-info/permissions', 'Save permissions'],
      ['POST', '/api/v1/user-info/import', 'Import from Excel'],
    ],
    status: [
      ['Feature', 'Backend', 'Frontend', 'Deploy', 'Notes'],
      ['User Info Page', 'Done', 'Done', '[DEMO]', 'API integrated'],
      ['Tab Navigation', 'Done', 'Done', '[DEMO]', '-'],
      ['Hierarchy Tree', 'Done', 'Done', '[DEMO]', '-'],
      ['Employee Detail Modal', 'Done', 'Done', '[DEMO]', '-'],
      ['Add Team/Member Modal', 'Done', 'Done', '[DEMO]', '-'],
      ['Permissions Modal', 'Done', 'Done', '[DEMO]', '-'],
      ['Import Excel Modal', 'Done', 'Done', '[LOCAL-DEV]', 'File processing'],
    ],
  },
};

// Create workbook
const wb = XLSX.utils.book_new();

// Helper function to create sheet with multiple tables
function createSheet(screenName, data) {
  const ws = XLSX.utils.aoa_to_sheet([]);
  let currentRow = 0;

  Object.entries(data).forEach(([sectionName, sectionData]) => {
    // Add section header
    const headerName = sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    XLSX.utils.sheet_add_aoa(ws, [[headerName.toUpperCase()]], { origin: { r: currentRow, c: 0 } });

    // Style header row (bold)
    const headerCell = XLSX.utils.encode_cell({ r: currentRow, c: 0 });
    if (!ws[headerCell]) ws[headerCell] = {};
    ws[headerCell].s = { font: { bold: true, sz: 14 } };

    currentRow++;

    // Add data
    XLSX.utils.sheet_add_aoa(ws, sectionData, { origin: { r: currentRow, c: 0 } });
    currentRow += sectionData.length + 2; // Add 2 empty rows after each section
  });

  // Set column widths
  ws['!cols'] = [
    { wch: 30 }, // Column A
    { wch: 45 }, // Column B
    { wch: 55 }, // Column C
    { wch: 45 }, // Column D
    { wch: 35 }, // Column E
  ];

  return ws;
}

// Add sheets for each screen
Object.entries(screens).forEach(([screenName, data]) => {
  const ws = createSheet(screenName, data);
  XLSX.utils.book_append_sheet(wb, ws, screenName);
});

// Write file
const outputPath = path.join(__dirname, '..', 'docs', 'basic-spec-ws.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`Excel file created: ${outputPath}`);
console.log(`Sheets: ${Object.keys(screens).join(', ')}`);
