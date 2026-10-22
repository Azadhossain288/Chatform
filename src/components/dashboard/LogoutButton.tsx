'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={logout}>
      Log out
    </Button>
  );
}