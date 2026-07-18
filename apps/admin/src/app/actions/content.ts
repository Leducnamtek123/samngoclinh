'use server';

import { fetchApi } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function createArticleAction(payload: any) {
  try {
    const res = await fetchApi('/admin/content/articles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || 'Lỗi khi tạo bài viết.' };
    }
    revalidatePath('/[lang]/content');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateArticleAction(id: string, payload: any) {
  try {
    const res = await fetchApi(`/admin/content/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || 'Lỗi khi cập nhật bài viết.' };
    }
    revalidatePath('/[lang]/content');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    const res = await fetchApi(`/admin/content/articles/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || 'Lỗi khi xóa bài viết.' };
    }
    revalidatePath('/[lang]/content');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateSettingAction(key: string, value: string) {
  try {
    const res = await fetchApi(`/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || 'Lỗi khi cập nhật cài đặt hệ thống.' };
    }
    revalidatePath('/[lang]/content');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
