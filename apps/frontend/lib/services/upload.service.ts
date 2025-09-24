import { apiPrivateClient } from '../private';

export interface UploadResponse {
  key: string;
  url: string;
  message: string;
}

class UploadService {
  async uploadImage(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use apiPrivateClient but we need to handle FormData differently
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/upload/image`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - let browser set it with boundary for FormData
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Admin access required to upload images');
      }
      throw new Error(error.message || 'Failed to upload image');
    }
  }

  private async getAuthToken(): Promise<string> {
    // Get token from Supabase session (similar to how apiPrivateClient does it)
    try {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      return session.data.session?.access_token || '';
    } catch {
      return '';
    }
  }
}

export const uploadService = new UploadService();
