// RE Task Export/Import utilities

import { RETask } from '@/types/reTask';

// CSV Export
export const exportToCSV = (tasks: RETask[], filename: string = 're-task-list') => {
  const headers = [
    'ID',
    'Group',
    'Type Task',
    'Task Name',
    'Frequency Type',
    'Frequency Number',
    'RE Unit (min)',
    'Manual Number',
    'Manual Link',
    'Note',
  ];

  const csvContent = [
    headers.join(','),
    ...tasks.map((task) =>
      [
        task.id,
        `"${task.group}"`,
        `"${task.typeTask}"`,
        `"${task.taskName}"`,
        `"${task.frequencyType}"`,
        task.frequencyNumber,
        task.reUnit,
        `"${task.manualNumber}"`,
        `"${task.manualLink || ''}"`,
        `"${task.note || ''}"`,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  downloadBlob(blob, `${filename}.csv`);
};

// Excel Export (using simple XML format)
export const exportToExcel = (tasks: RETask[], filename: string = 're-task-list') => {
  const headers = [
    'ID',
    'Group',
    'Type Task',
    'Task Name',
    'Frequency Type',
    'Frequency Number',
    'RE Unit (min)',
    'Manual Number',
    'Manual Link',
    'Note',
  ];

  // Create Excel XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#1E3A5F" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="Default">
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="Number">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <NumberFormat ss:Format="0"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="RE Task List">
    <Table>
      <Column ss:Width="40"/>
      <Column ss:Width="80"/>
      <Column ss:Width="80"/>
      <Column ss:Width="200"/>
      <Column ss:Width="100"/>
      <Column ss:Width="100"/>
      <Column ss:Width="100"/>
      <Column ss:Width="100"/>
      <Column ss:Width="150"/>
      <Column ss:Width="200"/>
      <Row ss:Height="25">
        ${headers.map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('')}
      </Row>`;

  tasks.forEach((task) => {
    xml += `
      <Row ss:Height="20">
        <Cell ss:StyleID="Number"><Data ss:Type="Number">${task.id}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(task.group)}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(task.typeTask)}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(task.taskName)}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(task.frequencyType)}</Data></Cell>
        <Cell ss:StyleID="Number"><Data ss:Type="Number">${task.frequencyNumber}</Data></Cell>
        <Cell ss:StyleID="Number"><Data ss:Type="Number">${task.reUnit}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(task.manualNumber)}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(task.manualLink || '')}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(task.note || '')}</Data></Cell>
      </Row>`;
  });

  xml += `
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  downloadBlob(blob, `${filename}.xls`);
};

// JSON Export
export const exportToJSON = (tasks: RETask[], filename: string = 're-task-list') => {
  const jsonContent = JSON.stringify(tasks, null, 2);
  const blob = new Blob([jsonContent], {
    type: 'application/json;charset=utf-8;',
  });
  downloadBlob(blob, `${filename}.json`);
};

// Helper function to download blob
const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Helper function to escape XML special characters
const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// CSV Import Parser
export const parseCSV = (content: string): Partial<RETask>[] => {
  const lines = content.split('\n').filter((line) => line.trim());
  if (lines.length < 2) return [];

  // Parse header to get column indices
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase().trim());

  const columnMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    if (header.includes('group')) columnMap.group = index;
    else if (header.includes('type')) columnMap.typeTask = index;
    else if (header.includes('task name') || header === 'taskname')
      columnMap.taskName = index;
    else if (header.includes('frequency type') || header === 'frequencytype')
      columnMap.frequencyType = index;
    else if (header.includes('frequency number') || header === 'frequencynumber')
      columnMap.frequencyNumber = index;
    else if (header.includes('re unit') || header === 'reunit')
      columnMap.reUnit = index;
    else if (header.includes('manual number') || header === 'manualnumber')
      columnMap.manualNumber = index;
    else if (header.includes('manual link') || header === 'manuallink')
      columnMap.manualLink = index;
    else if (header.includes('note')) columnMap.note = index;
  });

  const tasks: Partial<RETask>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const task: Partial<RETask> = {
      group: values[columnMap.group] || '',
      typeTask: values[columnMap.typeTask] || '',
      taskName: values[columnMap.taskName] || '',
      frequencyType: values[columnMap.frequencyType] || 'Daily',
      frequencyNumber: parseInt(values[columnMap.frequencyNumber]) || 1,
      reUnit: parseFloat(values[columnMap.reUnit]) || 0,
      manualNumber: values[columnMap.manualNumber] || '',
      manualLink: values[columnMap.manualLink] || undefined,
      note: values[columnMap.note] || undefined,
    };

    if (task.taskName && task.group) {
      tasks.push(task);
    }
  }

  return tasks;
};

// Parse a single CSV line (handling quoted values)
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

// JSON Import Parser
export const parseJSON = (content: string): Partial<RETask>[] => {
  try {
    const data = JSON.parse(content);
    if (!Array.isArray(data)) {
      throw new Error('Invalid JSON format: expected an array');
    }

    return data.map((item) => ({
      group: item.group || '',
      typeTask: item.typeTask || '',
      taskName: item.taskName || '',
      frequencyType: item.frequencyType || 'Daily',
      frequencyNumber: parseInt(item.frequencyNumber) || 1,
      reUnit: parseFloat(item.reUnit) || 0,
      manualNumber: item.manualNumber || '',
      manualLink: item.manualLink || undefined,
      note: item.note || undefined,
    }));
  } catch {
    throw new Error('Invalid JSON format');
  }
};

// Validate imported tasks
export const validateImportedTasks = (
  tasks: Partial<RETask>[]
): { valid: RETask[]; errors: string[] } => {
  const valid: RETask[] = [];
  const errors: string[] = [];
  let nextId = Date.now();

  tasks.forEach((task, index) => {
    const rowNum = index + 2; // +2 because index starts at 0 and we skip header

    if (!task.group) {
      errors.push(`Row ${rowNum}: Missing group`);
      return;
    }
    if (!task.taskName) {
      errors.push(`Row ${rowNum}: Missing task name`);
      return;
    }
    if (!task.manualNumber) {
      errors.push(`Row ${rowNum}: Missing manual number`);
      return;
    }

    valid.push({
      id: nextId++,
      group: task.group,
      typeTask: task.typeTask || 'Product',
      taskName: task.taskName,
      frequencyType: task.frequencyType || 'Daily',
      frequencyNumber: task.frequencyNumber || 1,
      reUnit: task.reUnit || 0,
      manualNumber: task.manualNumber,
      manualLink: task.manualLink,
      note: task.note,
    });
  });

  return { valid, errors };
};

// Generate sample CSV template
export const generateCSVTemplate = (): void => {
  const headers = [
    'Group',
    'Type Task',
    'Task Name',
    'Frequency Type',
    'Frequency Number',
    'RE Unit (min)',
    'Manual Number',
    'Manual Link',
    'Note',
  ];

  const sampleData = [
    'DELICA,CTM,Sample Task,Daily,1,15,DEL-001,https://example.com,Sample note',
    'D&D,Product,Another Task,Weekly,2,30,DND-001,,',
  ];

  const csvContent = [headers.join(','), ...sampleData].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  downloadBlob(blob, 're-task-template.csv');
};
