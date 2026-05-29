'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user, userProfile, subscription } from '@/lib/db/schema';
import { getStripe } from '@/lib/billing/stripe';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function deleteAccount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Não autenticado');
  }

  const userId = session.user.id;

  // 1. Buscar assinatura ativa no Stripe para cancelamento preventivo
  try {
    const subRecord = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    if (subRecord[0]?.stripeSubscriptionId) {
      const stripe = getStripe();
      if (stripe) {
        // Cancelar imediatamente a assinatura no Stripe para evitar cobranças futuras
        await stripe.subscriptions.cancel(subRecord[0].stripeSubscriptionId);
      }
    }
  } catch (err) {
    console.error('Erro ao cancelar assinatura no Stripe durante a exclusão de conta:', err);
    // Prosseguimos com a exclusão local mesmo se houver falha de rede/API com o Stripe
  }

  // 2. A cascata no schema irá apagar sessões, progresso, subscrições, etc. no banco local
  await db.delete(user).where(eq(user.id, userId));

  revalidatePath('/', 'layout');
  return { success: true };
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

  const experiences = formData.get('experiences') as string;
  const projects = formData.get('projects') as string;
  const image = formData.get('image') as string;

  const existingProfile = await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1);

  if (image) {
    await db.update(user)
      .set({ image, updatedAt: new Date() })
      .where(eq(user.id, userId));
  }

  if (existingProfile.length > 0) {
    await db.update(userProfile)
      .set({
        headline,
        bio,
        githubUrl,
        linkedinUrl,
        technologies,
        experiences,
        projects,
        updatedAt: new Date()
      })
      .where(eq(userProfile.userId, userId));
  } else {
    await db.insert(userProfile).values({
      userId,
      headline,
      bio,
      githubUrl,
      linkedinUrl,
      technologies,
      experiences,
      projects,
    });
  }

  revalidatePath('/profile');
  revalidatePath(`/user/${userId}`);
}
