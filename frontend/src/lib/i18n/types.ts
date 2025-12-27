// Supported locales
export type Locale = 'en' | 'ja' | 'vi';

// Translation keys structure
export interface Translations {
  common: {
    appName: string;
    appDescription: string;
    loading: string;
    error: string;
    success: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    update: string;
    search: string;
    filter: string;
    clear: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    yes: string;
    no: string;
    all: string;
    none: string;
    select: string;
    noData: string;
    actions: string;
    status: string;
    details: string;
    view: string;
    submit: string;
    reset: string;
  };

  auth: {
    login: string;
    logout: string;
    email: string;
    password: string;
    currentPassword: string;
    newPassword: string;
    changePassword: string;
    forgotPassword: string;
    loginSuccess: string;
    loginFailed: string;
    logoutSuccess: string;
    passwordChanged: string;
    invalidCredentials: string;
  };

  nav: {
    home: string;
    dashboard: string;
    tasks: string;
    schedule: string;
    staff: string;
    stores: string;
    departments: string;
    notifications: string;
    settings: string;
    reports: string;
    profile: string;
  };

  backend: {
    connected: string;
    connecting: string;
    disconnected: string;
    checkingConnection: string;
  };

  dws: {
    title: string;
    description: string;
    dailySchedule: string;
    dailyScheduleDesc: string;
    workforceDispatch: string;
    workforceDispatchDesc: string;
    shiftCodes: string;
    shiftCodesDesc: string;
    weeklySchedule: string;
    manHourReport: string;
  };

  ws: {
    title: string;
    description: string;
    taskManagement: string;
    taskManagementDesc: string;
    notifications: string;
    notificationsDesc: string;
    reports: string;
    reportsDesc: string;
    inDevelopment: string;
  };

  task: {
    task: string;
    tasks: string;
    taskName: string;
    taskDescription: string;
    priority: string;
    assignedTo: string;
    assignedStore: string;
    department: string;
    startDate: string;
    endDate: string;
    dueDate: string;
    completedDate: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    checklist: string;
    checklistItem: string;
    comment: string;
    comments: string;
    attachments: string;
    manual: string;
    taskType: string;
    responseType: string;
    repeatTask: string;
    status: {
      notYet: string;
      onProgress: string;
      done: string;
      overdue: string;
      reject: string;
    };
    priorityLevel: {
      low: string;
      normal: string;
      high: string;
      urgent: string;
    };
    updateStatus: string;
    taskDetails: string;
    taskInfo: string;
    noTasks: string;
    createTask: string;
    deleteTask: string;
    viewManual: string;
  };

  shift: {
    shift: string;
    shifts: string;
    shiftCode: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    duration: string;
    durationHours: string;
    color: string;
    colorCode: string;
    isActive: string;
    active: string;
    inactive: string;
    createShiftCode: string;
    editShiftCode: string;
    deleteShiftCode: string;
    generateDefault: string;
    generateDefaultDesc: string;
    defaultShiftCodes: string;
    morning: string;
    afternoon: string;
    night: string;
    off: string;
    fullDay: string;
    assignment: string;
    assignments: string;
    assignShift: string;
    bulkAssign: string;
    assignmentStatus: {
      assigned: string;
      confirmed: string;
      completed: string;
      cancelled: string;
    };
    notes: string;
    noShiftCodes: string;
    confirmDelete: string;
    shiftCodeExists: string;
  };

  schedule: {
    today: string;
    thisWeek: string;
    thisMonth: string;
    date: string;
    time: string;
    week: string;
    month: string;
    year: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    mondayShort: string;
    tuesdayShort: string;
    wednesdayShort: string;
    thursdayShort: string;
    fridayShort: string;
    saturdayShort: string;
    sundayShort: string;
    previousWeek: string;
    nextWeek: string;
    previousMonth: string;
    nextMonth: string;
    selectDate: string;
    viewByDay: string;
    viewByWeek: string;
    viewByMonth: string;
    noSchedule: string;
    currentHour: string;
  };

  staff: {
    staff: string;
    staffList: string;
    staffName: string;
    staffCode: string;
    email: string;
    phone: string;
    role: string;
    store: string;
    department: string;
    isActive: string;
    createStaff: string;
    editStaff: string;
    deleteStaff: string;
    roles: {
      manager: string;
      supervisor: string;
      staff: string;
    };
    noStaff: string;
  };

  store: {
    store: string;
    stores: string;
    storeName: string;
    storeCode: string;
    address: string;
    phone: string;
    region: string;
    status: string;
    allStores: string;
    selectStore: string;
    noStores: string;
  };

  department: {
    department: string;
    departments: string;
    departmentName: string;
    departmentCode: string;
    description: string;
    selectDepartment: string;
    noDepartments: string;
  };

  notification: {
    notification: string;
    notifications: string;
    unread: string;
    markAsRead: string;
    markAllAsRead: string;
    clearAll: string;
    noNotifications: string;
    newNotification: string;
    types: {
      taskAssigned: string;
      taskStatusChanged: string;
      taskCompleted: string;
      shiftAssigned: string;
      shiftChanged: string;
    };
  };

  report: {
    report: string;
    reports: string;
    manHourReport: string;
    totalHours: string;
    targetHours: string;
    difference: string;
    staffCount: string;
    status: {
      shortage: string;
      onTarget: string;
      surplus: string;
    };
    exportReport: string;
    generateReport: string;
    noReportData: string;
  };

  settings: {
    settings: string;
    language: string;
    theme: string;
    darkMode: string;
    lightMode: string;
    systemDefault: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    notifications: string;
    emailNotifications: string;
    pushNotifications: string;
    saveSettings: string;
    settingsSaved: string;
  };

  validation: {
    required: string;
    invalidEmail: string;
    minLength: string;
    maxLength: string;
    passwordMismatch: string;
    invalidDate: string;
    invalidTime: string;
    invalidNumber: string;
    selectOption: string;
    startBeforeEnd: string;
    duplicateValue: string;
  };

  error: {
    genericError: string;
    networkError: string;
    serverError: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
    conflict: string;
    validationError: string;
    tryAgain: string;
    goBack: string;
    goHome: string;
  };
}

// Locale information
export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dateFormat: string;
  timeFormat: string;
}

export const LOCALES: Record<Locale, LocaleInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
  },
  vi: {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
  },
};

export const DEFAULT_LOCALE: Locale = 'vi';
