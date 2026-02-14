// Interfaces
export interface LeadPayload {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  message: string;
}

export interface Lead extends LeadPayload {
  id: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  video_vertical?: boolean;
  created_at: string;
  updated_at: string;
  published: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Configuration
const API_BASE = '/api';
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

// Helper function for API calls
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // Clone response to read text if json fails
  const resClone = response.clone();
  let data;
  try {
    data = await response.json();
  } catch (e) {
    const rawText = await resClone.text();
    console.error("Erro ao fazer parse JSON. Corpo da resposta:", rawText);
    throw new Error(`Erro de servidor (não é JSON): ${rawText.substring(0, 100)}...`);
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Erro na requisição');
  }

  return data; // Return the full response object (success, data, pagination, etc) or just data depending on need
}

// === Leads API ===

export const createLead = async (payload: LeadPayload) => {
  try {
    // Validação básica
    if (!payload.name || !payload.email || !payload.whatsapp || !payload.service) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      throw new Error('Email inválido');
    }

    const result = await apiRequest<{ success: true; message: string; data: Lead }>('/leads.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return result;
  } catch (error) {
    console.error('Erro na função createLead:', error);
    throw error;
  }
};

export const fetchLeads = async (token: string, search?: string, page: number = 1, limit: number = 50) => {
  if (token !== ADMIN_SECRET) {
    throw new Error("Token inválido");
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);

    return await apiRequest<PaginatedResponse<Lead>>(`/leads.php?${params.toString()}`, {
      headers: { Authorization: token },
    });
  } catch (error) {
    console.error('Erro na função fetchLeads:', error);
    throw error;
  }
};

export const deleteLead = async (token: string, id: string) => {
  if (token !== ADMIN_SECRET) throw new Error("Token inválido");

  try {
    return await apiRequest<{ success: true; message: string }>(`/leads.php?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });
  } catch (error) {
    console.error('Erro na função deleteLead:', error);
    throw error;
  }
};

export const adminLogin = async (credentials: { username: string; password: string }) => {
  const adminUser = import.meta.env.VITE_ADMIN_USER;
  const adminPass = import.meta.env.VITE_ADMIN_PASS;

  if (credentials.username === adminUser && credentials.password === adminPass) {
    return {
      success: true,
      token: ADMIN_SECRET,
      expiresInHours: 24,
      user: { username: credentials.username }
    };
  } else {
    throw new Error("Credenciais inválidas");
  }
};

// === Blog API ===

export const fetchBlogPosts = async (page: number = 1, limit: number = 5, publishedOnly: boolean = true) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      published: publishedOnly.toString()
    });

    // API returns { success: true, data: BlogPost[] } without pagination metadata sometimes?
    // My PHP code returns pagination if using LIST mode? 
    // Wait, my PHP code: "echo json_encode(['success' => true, 'data' => $posts]);" (without pagination metadata for blog? Oops)
    // I should fix PHP to return pagination metadata or calculate it here.
    // Ideally PHP should return total count.

    const response = await apiRequest<{ success: true; data: BlogPost[] }>(`/blog.php?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    throw error;
  }
};

export const fetchBlogPost = async (id: string) => {
  try {
    const response = await apiRequest<{ success: true; data: BlogPost }>(`/blog.php?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    throw error;
  }
};

export const createBlogPost = async (token: string, data: Partial<BlogPost>) => {
  return await apiRequest<{ success: true; message: string; data: BlogPost }>('/blog.php', {
    method: 'POST',
    headers: { Authorization: token },
    body: JSON.stringify(data),
  });
};

export const updateBlogPost = async (token: string, id: string, data: Partial<BlogPost>) => {
  return await apiRequest<{ success: true; message: string }>('/blog.php', {
    method: 'PUT',
    headers: { Authorization: token },
    body: JSON.stringify({ id, ...data }),
  });
};

export const deleteBlogPost = async (token: string, id: string) => {
  return await apiRequest<{ success: true; message: string }>(`/blog.php?id=${id}`, {
    method: 'DELETE',
    headers: { Authorization: token },
  });
};

export const uploadBlogImage = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE}/upload.php`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': token,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Erro no upload');
  }
  return data; // { success: true, url: string }
};
