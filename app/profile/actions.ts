'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user, userProfile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function deleteAccount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Não autenticado');
  }

  // A cascata no schema irá apagar sessões, progresso, subscrições, etc.
  await db.delete(user).where(eq(user.id, session.user.id));

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Não autenticado');
  }

  const userId = session.user.id;
  const headline = formData.get('headline') as string;
  const bio = formData.get('bio') as string;
  const githubUrl = formData.get('githubUrl') as string;
  const linkedinUrl = formData.get('linkedinUrl') as string;
  
  const techString = formData.get('technologies') as string;
  const technologies = techString ? techString.split(',').map(s => s.trim()).filter(Boolean) : [];

  const existingProfile = await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1);

  if (existingProfile.length > 0) {
    await db.update(userProfile)
      .set({ headline, bio, githubUrl, linkedinUrl, technologies, updatedAt: new Date() })
      .where(eq(userProfile.userId, userId));
  } else {
    await db.insert(userProfile).values({
      userId,
      headline,
      bio,
      githubUrl,
      linkedinUrl,
      technologies,
    });
  }

  revalidatePath('/profile');
  revalidatePath(`/user/${userId}`);
}
