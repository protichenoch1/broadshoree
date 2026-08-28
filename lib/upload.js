import { supabase } from './supabase';

export async function uploadApplicantFile(file, folder) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('applicant-documents')
    .upload(filePath, file);

  if (error) {
    console.error('File Upload Error:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('applicant-documents')
    .getPublicUrl(filePath);

  return { name: file.name, url: publicUrlData.publicUrl, path: filePath };
}