// API utility for connecting to backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Health check
export async function checkHealth() {
  const response = await fetch(API_BASE_URL.replace('/api/v1', '/health'));
  return await response.json();
}

// Stores API
export async function getStores() {
  return fetchApi('/stores');
}

export async function getStore(id: number) {
  return fetchApi(`/stores/${id}`);
}

// Staff API
export async function getStaff() {
  return fetchApi('/staff');
}

export async function getStaffById(id: number) {
  return fetchApi(`/staff/${id}`);
}

// Tasks API (placeholder - adjust based on actual backend endpoints)
export async function getTasks() {
  return fetchApi('/tasks');
}

export async function createTask(task: any) {
  return fetchApi('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export async function updateTask(id: number, task: any) {
  return fetchApi(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  });
}

export async function deleteTask(id: number) {
  return fetchApi(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
